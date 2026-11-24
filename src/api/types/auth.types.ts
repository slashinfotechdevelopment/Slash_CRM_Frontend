export interface RequestOtpDto {
  email: string;
}

export interface RequestOtpResponse {
  message: string;
  expiresInSeconds?: number;
  // Included in dev mode for ease of local testing
  otp?: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface LogoutDto {
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role?: string;
  organizationId?: string;
  organizationName?: string;
  departmentId?: string;
  departmentName?: string;
  status?: string;
  avatarUrl?: string;
  roles?: Array<{
    id: string;
    name: string;
    code: string;
    permissions?: Array<{ id: string; code: string; name: string }>;
  }>;
  permissions?: Array<string | { code: string; effect: 'ALLOW' | 'DENY' }>;
}

export interface AuthSessionResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface BootstrapSuperAdminDto {
  email: string;
  name: string;
  organizationName: string;
}
