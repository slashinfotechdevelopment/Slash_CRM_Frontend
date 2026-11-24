import { extractData } from '@/api/client/responseUnwrap';
import { httpClient } from '@/api/client/httpClient';
import { AUTH_ENDPOINTS } from '@/api/endpoints/auth.endpoints';
import {
  RequestOtpDto,
  RequestOtpResponse,
  VerifyOtpDto,
  RefreshTokenDto,
  RefreshTokenResponse,
  LogoutDto,
  AuthUser,
  AuthSessionResponse,
  BootstrapSuperAdminDto,
} from '@/api/types/auth.types';
import { ApiResponse } from '@/api/types/api.types';

export const authConnector = {
  /**
   * POST /api/auth/send-otp
   */
  async requestOtp(dto: RequestOtpDto): Promise<RequestOtpResponse> {
    const res = await httpClient.post<ApiResponse<RequestOtpResponse> | RequestOtpResponse>(
      AUTH_ENDPOINTS.REQUEST_OTP,
      { email: dto.email, purpose: 'LOGIN' }
    );
    return extractData(res);
  },

  /**
   * POST /api/auth/verify-otp
   */
  async verifyOtp(dto: VerifyOtpDto): Promise<AuthSessionResponse> {
    const res = await httpClient.post<ApiResponse<AuthSessionResponse> | AuthSessionResponse>(
      AUTH_ENDPOINTS.VERIFY_OTP,
      { email: dto.email, otp: dto.otp, purpose: 'LOGIN' }
    );
    return extractData(res);
  },

  /**
   * POST /api/auth/refresh
   */
  async refresh(dto: RefreshTokenDto): Promise<RefreshTokenResponse> {
    const res = await httpClient.post<ApiResponse<RefreshTokenResponse> | RefreshTokenResponse>(
      AUTH_ENDPOINTS.REFRESH,
      dto
    );
    return extractData(res);
  },

  /**
   * POST /api/auth/logout
   */
  async logout(dto: LogoutDto): Promise<{ success: boolean; message: string }> {
    const res = await httpClient.post<ApiResponse<{ message: string }> | { message: string }>(
      AUTH_ENDPOINTS.LOGOUT,
      dto
    );
    return {
      success: true,
      message: (res.data as { message?: string })?.message || 'Logged out successfully',
    };
  },

  /**
   * POST /api/auth/logout-all
   */
  async logoutAll(): Promise<{ success: boolean; message: string }> {
    const res = await httpClient.post<ApiResponse<{ message: string }> | { message: string }>(
      AUTH_ENDPOINTS.LOGOUT_ALL
    );
    return {
      success: true,
      message: (res.data as { message?: string })?.message || 'All sessions terminated successfully',
    };
  },

  /**
   * GET /api/auth/me
   */
  async getMe(): Promise<AuthUser> {
    const res = await httpClient.get<ApiResponse<AuthUser> | AuthUser>(AUTH_ENDPOINTS.ME);
    return extractData(res);
  },

  /**
   * POST /api/auth/bootstrap
   */
  async bootstrapSuperAdmin(dto: BootstrapSuperAdminDto): Promise<AuthSessionResponse> {
    const res = await httpClient.post<ApiResponse<AuthSessionResponse> | AuthSessionResponse>(
      AUTH_ENDPOINTS.BOOTSTRAP,
      dto
    );
    return extractData(res);
  },
};
