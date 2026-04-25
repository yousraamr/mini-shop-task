export function appError(statusCode: number, error: string, message: string) {
  return {
    statusCode,
    error,
    message,
  };
}