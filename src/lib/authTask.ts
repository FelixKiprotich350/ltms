import { authOptions } from "app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function hasPermission(
  permissionCodeName: string
): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.UserPermissions) {
      return false;
    }
    const requiredPermission = await prisma?.permissionMaster.findUnique({
      where: { codeName: permissionCodeName },
    });
    return session.user.UserPermissions.some(
      (p) => p.permissionUuid === requiredPermission?.uuid
    );
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
}
export async function hasPermissions(
  permissionCodeNames: string[]
): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.UserPermissions) {
      return false;
    }

    const requiredPermissions =
      (await prisma?.permissionMaster.findMany({
        where: { codeName: { in: permissionCodeNames } },
      })) ?? [];

    const hasPermission = requiredPermissions.some((requiredPermission) =>
      session.user.UserPermissions.some(
        (p) => p.permissionUuid === requiredPermission.uuid
      )
    );

    return hasPermission; // ✅ Ensure the function returns the result
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
}

export async function hasRole(role: string): Promise<boolean> {
  try {
    const session = await getServerSession();
    if (!session || !session.user || !session.user.UserRole) return false;

    return session.user.UserRole.codeName === role;
  } catch (error) {
    console.error("Error checking role:", error);
    return false;
  }
}
