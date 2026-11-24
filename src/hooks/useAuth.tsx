import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { STORAGE_KEYS, DEFAULT_ORGANIZATION_NAME } from '@/config/constants';
import { AuthUser, BootstrapSuperAdminDto } from '@/api/types/auth.types';
import { authConnector } from '@/connectors/auth.connector';
import { NormalizedError } from '@/api/client/errorMapper';

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSuperAdmin: boolean;
  error: NormalizedError | null;
  requestOtp: (email: string) => Promise<{ message: string; otp?: string; expiresInSeconds?: number }>;
  login: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  bootstrap: (dto: BootstrapSuperAdminDto) => Promise<void>;
  refreshProfile: () => Promise<void>;
  hasPermission: (required: string | string[], matchMode?: 'any' | 'all') => boolean;
  hasRole: (requiredRole: string | string[]) => boolean;
}

function saveSession(accessToken: string, refreshToken: string, user: AuthUser) {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

function clearSessionStorage() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<NormalizedError | null>(null);

  const isRefreshingRef = useRef<boolean>(false);

  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;

    try {
      const me = await authConnector.getMe();
      const resolvedRole =
        me.roles?.[0]?.name ||
        me.roles?.[0]?.code ||
        (me as unknown as { role?: string }).role ||
        (me as unknown as { userType?: { name?: string; code?: string } }).userType?.name ||
        (me as unknown as { userType?: { name?: string; code?: string } }).userType?.code ||
        'Employee';
      const userWithOrg: AuthUser = {
        ...me,
        role: resolvedRole,
        organizationName: me.organizationName || DEFAULT_ORGANIZATION_NAME,
      };
      setUser(userWithOrg);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userWithOrg));
      setError(null);
    } catch (err: unknown) {
      const normErr = err as NormalizedError;
      if (normErr?.status === 401) {
        setUser(null);
        clearSessionStorage();
      }
      setError(normErr);
    } finally {
      setIsLoading(false);
      isRefreshingRef.current = false;
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const requestOtp = useCallback(async (email: string) => {
    setError(null);
    return await authConnector.requestOtp({ email });
  }, []);

  const login = useCallback(async (email: string, otp: string) => {
    setError(null);
    const session = await authConnector.verifyOtp({ email, otp });
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, session.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, session.refreshToken);
    try {
      const me = await authConnector.getMe();
      const resolvedRole =
        me.roles?.[0]?.name ||
        me.roles?.[0]?.code ||
        (me as unknown as { role?: string }).role ||
        (me as unknown as { userType?: { name?: string; code?: string } }).userType?.name ||
        (me as unknown as { userType?: { name?: string; code?: string } }).userType?.code ||
        'Employee';
      const userWithOrg: AuthUser = {
        ...me,
        role: resolvedRole,
        organizationName: me.organizationName || DEFAULT_ORGANIZATION_NAME,
      };
      saveSession(session.accessToken, session.refreshToken, userWithOrg);
      setUser(userWithOrg);
    } catch {
      saveSession(session.accessToken, session.refreshToken, session.user);
      setUser(session.user);
    }
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (refreshToken) {
      try {
        await authConnector.logout({ refreshToken });
      } catch {
        // Continue clearing client state even if network fails
      }
    }
    clearSessionStorage();
    setUser(null);
  }, []);

  const logoutAll = useCallback(async () => {
    try {
      await authConnector.logoutAll();
    } catch {
      // Continue clearing client state
    }
    clearSessionStorage();
    setUser(null);
  }, []);

  const bootstrap = useCallback(async (dto: BootstrapSuperAdminDto) => {
    setError(null);
    const session = await authConnector.bootstrapSuperAdmin(dto);
    saveSession(session.accessToken, session.refreshToken, session.user);
    setUser(session.user);
  }, []);

  // Determine if current user is Super Admin
  const isSuperAdmin = useMemo(() => {
    if (!user) return false;
    const userTypeObj = user as { userType?: { code?: string } };
    if (userTypeObj.userType?.code === 'SUPER_ADMIN') return true;
    if (user.role === 'SUPER_ADMIN') return true;
    if (user.roles?.some((r) => r.code === 'SUPER_ADMIN')) return true;
    return false;
  }, [user]);

  // Normalize user permissions to a Set of active code strings
  const permissionSet = useMemo(() => {
    const set = new Set<string>();
    if (!user?.permissions) return set;

    for (const p of user.permissions) {
      if (typeof p === 'string') {
        set.add(p);
      } else if (typeof p === 'object' && p !== null) {
        const permObj = p as { code?: string; effect?: string };
        if (permObj.code && permObj.effect !== 'DENY') {
          set.add(permObj.code);
        }
      }
    }
    return set;
  }, [user?.permissions]);

  const hasPermission = useCallback(
    (required: string | string[], matchMode: 'any' | 'all' = 'any'): boolean => {
      if (!user) return false;
      if (isSuperAdmin) return true;

      const perms = Array.isArray(required) ? required : [required];
      if (perms.length === 0) return true;

      if (matchMode === 'all') {
        return perms.every((p) => permissionSet.has(p));
      }
      return perms.some((p) => permissionSet.has(p));
    },
    [user, isSuperAdmin, permissionSet]
  );

  const hasRole = useCallback(
    (requiredRole: string | string[]): boolean => {
      if (!user) return false;
      if (isSuperAdmin) return true;

      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const userTypeObj = user as { userType?: { code?: string } };
      return roles.some(
        (r) =>
          user.role === r ||
          userTypeObj.userType?.code === r ||
          user.roles?.some((ur) => ur.code === r)
      );
    },
    [user, isSuperAdmin]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isSuperAdmin,
        error,
        requestOtp,
        login,
        logout,
        logoutAll,
        bootstrap,
        refreshProfile,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
