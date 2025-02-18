export const USER_TOKEN = "authToken";

const JWT_SECRET_KEY: string | undefined = process.env.JWT_SECRET!;

export function getJwtSecretKey(): string {
  if (!JWT_SECRET_KEY || JWT_SECRET_KEY.length === 0) {
    throw new Error("The environment variable JWT_SECRET_KEY is not set.");
  }

  return JWT_SECRET_KEY;
}

//others Defaults
export const DEFAULT_ROLE_UUID = "93b35be1-e55f-4367-8848-9ef02a6dec99";
export const DEFAULT_DEPARTMENT_UUID = "c08a5973-b1ec-4db9-b812-4bf2aa74ffda";
