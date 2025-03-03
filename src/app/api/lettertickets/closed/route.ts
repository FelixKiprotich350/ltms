import { NextRequest, NextResponse } from "next/server";
import prisma from "lib/prisma";
import { hasPermissions } from "lib/authTask";

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const authresponse = await hasPermissions(request, ["view_closed_tickets"]);
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
    if (!departmentUuid)
      return NextResponse.json(
        { error: "User department not found" },
        { status: 404 }
      );

    const url = new URL(request.url);
    const withRelations = url.searchParams.get("withrelations") === "true"; // Convert to boolean

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
      where: { letterUuid: { in: uuidList }, ticketClosed: true },
      include: withRelations ? { Letter: true } : {},
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
