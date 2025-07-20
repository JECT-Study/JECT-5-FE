export interface ErrorResponse {
    code: number | string;
    message: string;
    data?: unknown;
}

export interface ApiResponse<T = unknown> {
    result: "SUCCESS" | "ERROR";
    data?: T | null;
    error?: ErrorResponse | null;
}