import api from "./axios.instance";
import type {
  IResumeAnalysis,
  ApiResponse,
  PaginatedResponse,
  AnalysisQueryParams,
} from "../types";

/**
 * POST /api/resume/analyze
 * Uploads a PDF file → backend extracts text → calls LLM → returns analysis
 */
export const analyzeResumeApi = async (
  file: File,
): Promise<ApiResponse<IResumeAnalysis>> => {
  const formData = new FormData();
  formData.append("resume", file);

  const { data } = await api.post<ApiResponse<IResumeAnalysis>>(
    "/api/resume/analyze",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data;
};

/**
 * POST /api/resume/analyze
 * Sends raw resume text → backend processes → returns analysis
 */
export const analyzeResumeTextApi = async (
  resumeText: string,
): Promise<ApiResponse<IResumeAnalysis>> => {
  const { data } = await api.post<ApiResponse<IResumeAnalysis>>(
    "/api/resume/analyze",
    { resumeText }, // ✅ key must match backend
    {
      headers: { "Content-Type": "application/json" },
    },
  );

  return data;
};

/**
 * GET /api/resume/history
 * Returns paginated analysis history for the logged-in user
 */
export const getMyAnalysesApi = async (
  params?: AnalysisQueryParams,
): Promise<PaginatedResponse<IResumeAnalysis>> => {
  const { data } = await api.get<PaginatedResponse<IResumeAnalysis>>(
    "/api/resume/history",
    { params },
  );
  return data;
};

/**
 * GET /api/resume/history/:id
 * Returns a single analysis by ID (must belong to the logged-in user)
 */
export const getAnalysisByIdApi = async (
  id: string,
): Promise<ApiResponse<IResumeAnalysis>> => {
  const { data } = await api.get<ApiResponse<IResumeAnalysis>>(
    `/api/resume/history/${id}`,
  );
  return data;
};

/**
 * DELETE /api/resume/history/:id
 * Deletes a single analysis (must belong to the logged-in user)
 */
export const deleteAnalysisApi = async (id: string): Promise<void> => {
  await api.delete(`/api/resume/history/${id}`);
};

/**
 * DELETE /api/resume/history
 * Wipes ALL analyses for the logged-in user
 */
export const deleteAllAnalysesApi = async (): Promise<ApiResponse<null>> => {
  const { data } = await api.delete<ApiResponse<null>>("/api/resume/history");
  return data;
};
