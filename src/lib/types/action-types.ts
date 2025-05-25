// Common response types for actions
export interface ActionResponse<T = null> {
  success: boolean;
  error?: string;
  data?: T;
}

export function createSuccessResponse<T = null>(data?: T): ActionResponse<T> {
  return { success: true, data };
}

export function createErrorResponse(error: string): ActionResponse {
  return { success: false, error };
}
