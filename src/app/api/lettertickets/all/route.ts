import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "lib/prisma";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { hasPermissions } from "lib/authTask";

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const authresponse = await hasPermissions(request, ["view_all_tickets"]);
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

    const departmentUuid = user?.OrganisationDepartment?.uuid;
    if (!user?.OrganisationDepartment)
      return NextResponse.json(
        { error: "User department not found" },
        { status: 404 }
      );

    // Get letter UUIDs related to the user
    const letterUuids = await prisma.letterRecipient.findMany({
      where: {
        OR: [
          { RecipientMaster: { recipientType: "DEPARTMENT", departmentUuid } },
          {
            RecipientMaster: {
              recipientType: "PERSON",
              userPersonUuid: user?.uuid,
            },
          },
        ],
      },
      select: { letterUuid: true },
    });

    const uuidList = letterUuids.map((r) => r.letterUuid);
    if (uuidList.length === 0) return NextResponse.json([], { status: 200 });

    // Fetch tickets related to the letters
    const tickets = await prisma.letterTicket.findMany({
      where: { letterUuid: { in: uuidList } },
      include: { Letter: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error fetching letter tickets:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
