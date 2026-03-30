// ─── User ─────────────────────────────────────────────────────────────────────
export interface IUser {
  _id: string;
  firebaseUid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  emailVerified: boolean;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Resume Analysis ──────────────────────────────────────────────────────────
export interface ILlmResponse {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  score?: number;
}

export interface IResumeAnalysis {
  _id: string;
  userId: string;
  resumeText: string;
  llmResponse: ILlmResponse;
  originalFileName?: string;
  llmModel: string;
  createdAt: string;
  updatedAt: string;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── Query Params ─────────────────────────────────────────────────────────────
export interface AnalysisQueryParams {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  scoreMin?: number;
  scoreMax?: number;
}
