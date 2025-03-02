import { NextRequest, NextResponse } from "next/server";
import prisma from "lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { hasPermissions } from "lib/authTask";

// GET: Fetch outgoing requests
export async function GET(request: NextRequest) {
  try {
    const authresponse = await hasPermissions(request, ["view_outgoing_letters"]);
    if (!authresponse.isAuthorized) {
      return authresponse.message;
    }
    const res = await authresponse?.message.json();
    const user = res?.data?.description?.user;
    if (!user) {
      return NextResponse.json(
        { error: "User Data not found" },
        { status: 400 }
      );
    }

    if (!user.OrganisationDepartment) {
      return NextResponse.json(
        { error: "User department not found" },
        { status: 404 }
      );
    }

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
              { senderDepartmentUuid: user.OrganisationDepartment.uuid },
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
