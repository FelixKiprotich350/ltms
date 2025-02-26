export * from "./enums";
export * from "./modelsinterfaces";
export * from "./api";

// /types/global.d.ts

export interface User {
  id: string;
  name: string;
  email: string;
}

export type LoginCredentials = {
  email: string;
  password: string;
};

export type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};
