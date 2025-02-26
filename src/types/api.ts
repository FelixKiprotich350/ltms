export type ApiResponse<T> = {
  data: T;
  isLoading: boolean;
  error?: object;
};
