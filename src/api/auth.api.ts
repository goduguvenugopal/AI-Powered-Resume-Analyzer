import api from "./axios.instance";
import type { IUser, ApiResponse } from "../types";

/**
 * POST /api/auth/google
 * Sends Firebase idToken → backend verifies → sets httpOnly cookie + returns user
 */
export const googleLoginApi = async (
  idToken: string
): Promise<ApiResponse<IUser>> => {
  const { data } = await api.post<ApiResponse<IUser>>("/api/auth/google", {
    idToken,
  });
  return data;
};

/**
 * GET /api/auth/me
 * Restores session using the httpOnly JWT cookie (no token needed in header)
 */
export const getMeApi = async (): Promise<ApiResponse<IUser>> => {
  const { data } = await api.get<ApiResponse<IUser>>("/api/auth/me");
  return data;
};

/**
 * POST /api/auth/logout
 * Clears the httpOnly cookie on the server
 */
export const logoutApi = async (): Promise<ApiResponse<null>> => {
  const { data } = await api.post<ApiResponse<null>>("/api/auth/logout");
  return data;
};

/**
 * PUT /api/auth/me
 * Updates the authenticated user's displayName
 */
export const updateProfileApi = async (
  displayName: string
): Promise<ApiResponse<IUser>> => {
  const { data } = await api.put<ApiResponse<IUser>>("/api/auth/me", {
    displayName,
  });
  return data;
};