import { NextResponse } from "next/server";
import prisma from "lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";

// GET: Fetch outgoing requests
export async function GET(request: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user?.uuid == undefined || session.user?.uuid == null) {
      return NextResponse.json(
        { error: "User Required in this action." },
        { status: 401 }
      );
    }
    // Extract department UUID from the user's session
    const user = await prisma.ltmsUser.findUnique({
      where: { uuid: session.user.uuid }, // Assuming email is unique
      include: {
        Department: true,
      },
    });

    if (!user || !(user as any).Department) {
      return NextResponse.json(
        { error: "User department not found" },
        { status: 404 }
      );
    }

    const departmentUuid = (user as any)?.Department?.uuid;

    // Parse request parameters
    const url = new URL(request.url);
    const withRelations = url.searchParams.get("withrelations") === "true";

    // Fetch letters
    const letters = await prisma.letterRequest.findMany({
      where: {
        OR: [
          {
            AND: [
              { senderType: "DEPARTMENT" },
              { senderDepartmentUuid: departmentUuid },
            ],
          },
          {
            AND: [{ senderType: "PERSON" }, { senderUserUuid: user.uuid }],
          },
        ],
      },
      include: withRelations
        ? {
            SenderDepartment: true,
            SenderUser: {
              include: {
                Person: true,
                UserRole: true,
              },
            },
          }
        : {},
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(letters, { status: 200 });
  } catch (error) {
    console.error("Error fetching letter requests:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
