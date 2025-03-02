import { NextResponse } from "next/server";

export type ApiResponse<T> = {
  data: T;
  isLoading: boolean;
  error?: object;
};

export type AuthorizeApiResponse = {
  message: NextResponse;
  isAuthorized: boolean;
};
