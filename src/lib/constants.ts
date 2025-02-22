export const USER_TOKEN = "authToken";

const JWT_SECRET_KEY: string | undefined = process.env.JWT_SECRET!;

export function getJwtSecretKey(): string {
  if (!JWT_SECRET_KEY || JWT_SECRET_KEY.length === 0) {
    throw new Error("The environment variable JWT_SECRET_KEY is not set.");
  }

  return JWT_SECRET_KEY;
}

//others Defaults
export const DEFAULT_ROLE_UUID = "550e8400-e29b-41d4-a716-446655440012";
export const DEFAULT_DEPARTMENT_UUID = "550e8400-e29b-41d4-a716-446655440000";
export const enum LetterSenderRecipientType {
  DEPARTMENT = "DEPARTMENT",
  PERSON = "PERSON",
}
export const enum LeterRecipientReceivedStatus {
  RECEIVED = "RECEIVED",
  PENDING = "PENDING",
}

export const enum UserAccountLoginStatus {
  ENABLED = "ENABLED",
  DISABLED = "DISABLED",
}
export const enum UserAccountApprovalStatus {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}
