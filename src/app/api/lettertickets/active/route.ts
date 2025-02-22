import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "lib/prisma";
import { authOptions } from "app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    const userUuid = session?.user?.uuid;
    if (!userUuid)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch user's department UUID
    const user = await prisma.ltmsUser.findUnique({
      where: { uuid: userUuid },
      select: { Department: { select: { uuid: true } } },
    });

    const departmentUuid = user?.Department?.uuid;
    if (!departmentUuid)
      return NextResponse.json(
        { error: "User department not found" },
        { status: 404 }
      );

    // Get letter UUIDs related to the user
    const letterUuids = await prisma.letterRecipients.findMany({
      where: {
        OR: [
          { RecipientMaster: { recipientType: "DEPARTMENT", departmentUuid } },
          {
            RecipientMaster: {
              recipientType: "PERSON",
              userPersonUuid: userUuid,
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
      where: { letterUuid: { in: uuidList }, ticketClosed: false },
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
