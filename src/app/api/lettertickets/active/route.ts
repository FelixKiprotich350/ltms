import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "lib/prisma";
import { authOptions } from "app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.uuid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user and department
    const user = await prisma.ltmsUser.findUnique({
      where: { uuid: session.user.uuid },
      include: { Department: { select: { uuid: true } } },
    });

    if (!user || !user.Department?.uuid) {
      return NextResponse.json(
        { error: "User department not found" },
        { status: 404 }
      );
    }

    const departmentUuid = user.Department.uuid;

    // Parse request parameters
    const url = new URL(request.url);
    const withRelations = url.searchParams.get("withrelations") === "true";

    // Fetch recipients
    const recipients = await prisma.letterRecipients.findMany({
      where: {
        OR: [
          {
            RecipientMaster: {
              recipientType: "DEPARTMENT",
              departmentUuid: departmentUuid,
            },
          },
          {
            RecipientMaster: {
              recipientType: "PERSON",
              userPersonUuid: user.uuid,
            },
          },
        ],
      },
      select: { letterUuid: true },
    });

    if (recipients.length === 0) {
      return NextResponse.json([], { status: 200 }); // Return empty array properly
    }

    // Fetch letters
    const letterUuids = recipients.map((r) => r.letterUuid);
    const letters = await prisma.letterRequest.findMany({
      where: { uuid: { in: letterUuids } },
      select: { uuid: true },
      orderBy: { createdAt: "desc" },
    });

    if (letters.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Fetch tickets
    const tickets = await prisma.letterTicket.findMany({
      where: { uuid: { in: letters.map((r) => r.uuid) } },
      include: { Letter: withRelations },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tickets, { status: 200 });
  } catch (error) {
    console.error("Error fetching letter Tickets:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
