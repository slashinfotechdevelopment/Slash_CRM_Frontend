export interface UserPermissionsContext {
  role?: string;
  roles?: Array<{ code?: string; name?: string; permissions?: Array<{ code: string } | string> }>;
  permissions?: Array<string | { code: string; effect?: string }>;
}

export function hasPermission(
  user: UserPermissionsContext | null | undefined,
  requiredPermission?: string
): boolean {
  if (!user) return false;
  if (!requiredPermission) return true;

  // Super Admin always has full access
  const roleCode = user.role?.toUpperCase();
  if (roleCode === 'SUPER_ADMIN' || roleCode === 'ADMIN') return true;

  const roles = user.roles || [];
  if (roles.some((r) => r.code?.toUpperCase() === 'SUPER_ADMIN' || r.name?.toUpperCase() === 'SUPER ADMIN')) {
    return true;
  }

  // Check explicit user-level permission overrides
  if (user.permissions && Array.isArray(user.permissions)) {
    for (const p of user.permissions) {
      if (typeof p === 'string' && (p === requiredPermission || p === '*')) {
        return true;
      }
      if (typeof p === 'object' && p !== null) {
        if (p.code === requiredPermission || p.code === '*') {
          if (p.effect === 'DENY') return false;
          return true;
        }
      }
    }
  }

  // Check role-level permissions
  for (const r of roles) {
    if (r.permissions && Array.isArray(r.permissions)) {
      for (const rp of r.permissions) {
        const code = typeof rp === 'string' ? rp : rp.code;
        if (code === requiredPermission || code === '*') {
          return true;
        }
      }
    }
  }

  return false;
}
