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
  