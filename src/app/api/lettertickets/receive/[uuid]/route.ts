import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // Import session handler
import prisma from "lib/prisma"; // Ensure Prisma client is properly imported
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { LetterTicket } from "@prisma/client";

// PUT: Update a request by uuid and create a related ticket
export async function PUT(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  const { uuid } = params;

  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userUuid = session.user.uuid;
    if (!userUuid) {
      return NextResponse.json({ error: "User is required" }, { status: 400 });
    }

    const letter = await prisma.letterRequest.findUnique({
      where: { uuid },
      include: { LetterTicket: true },
    });

    if (!letter) {
      return NextResponse.json(
        { error: "Letter Request not found" },
        { status: 404 }
      );
    }

    if (letter.status === "RECEIVED") {
      return NextResponse.json(
        { error: "Letter request has already been received!" },
        { status: 400 }
      );
    }

    const existingTicket = letter.LetterTicket.length > 0 ? letter.LetterTicket[0] : null;

    // Start Prisma transaction
    const transactionResults = await prisma.$transaction([
      // Update the letter request status
      prisma.letterRequest.update({
        where: { uuid },
        data: { status: "RECEIVED" },
      }),

      // Only create a new ticket if none exists
      existingTicket
        ? prisma.letterTicket.findUnique({
            where: { uuid: existingTicket.uuid },
          })
        : prisma.letterTicket.create({
            data: {
              letterUuid: uuid,
              userCreatingTicketUuuid: userUuid,
              ticketNumber: await generateTicketNumber(),
            },
          }),
    ]);

    const [updatedRequest, createdOrFetchedTicket] = transactionResults;

    return NextResponse.json({
      updatedRequest,
      createdTicket: createdOrFetchedTicket || null,
    });
  } catch (error) {
    console.error("Error updating request and creating ticket:", error);
    return NextResponse.json(
      { error: "Failed to update request and create ticket" },
      { status: 500 }
    );
  } finally {
    prisma.$disconnect();
  }
}




// Function to generate a unique ticket number
async function generateTicketNumber() {
  const currentDate = new Date();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits
  const year = currentDate.getFullYear();

  // Get the latest ticket for the current month and year
  const latestTicket = await prisma.letterTicket.findFirst({
    where: {
      ticketNumber: {
        startsWith: `T-${month}-${year}`,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Extract last incrementing number
  let nextNumber = 1;
  if (latestTicket) {
    const parts = latestTicket.ticketNumber.split("-");
    nextNumber = parseInt(parts[3], 10) + 1; // Increment last number
  }

  // Format the ticket number
  const ticketNumber = `T-${month}-${year}-${String(nextNumber).padStart(
    3,
    "0"
  )}`;

  return ticketNumber;
}
