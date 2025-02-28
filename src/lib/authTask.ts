import { getSession } from "next-auth/react";

export async function hasPermission(permission: string): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session || !session.user || !session.user.UserPermissions)
      return false;
    console.log(session.user.UserPermissions);
    return session.user.UserPermissions.some(
      (p: { permissionUuid: string }) => p.permissionUuid === permission
    );
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
}

export async function hasRole(role: string): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session || !session.user || !session.user.UserRole) return false;

    return session.user.UserRole.codeName === role;
  } catch (error) {
    console.error("Error checking role:", error);
    return false;
  }
}
