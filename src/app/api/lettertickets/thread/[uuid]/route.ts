import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // Import session handler
import prisma from "lib/prisma"; // Ensure Prisma client is properly imported
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { LetterTicket } from "@prisma/client";
import { hasPermissions } from "lib/authTask";

// GET: Get all conversations for this thread
export async function GET(
  request: NextRequest,
  { params }: { params: { uuid: string } }
) {
  const { uuid } = params;

  try {
    // Get user session
    const authresponse = await hasPermissions(request, ["view_thread_tickets"]);
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

    const ticket = await prisma.letterTicket.findUnique({
      where: { uuid },
      include: { Letter: true },
    });
    const parent = await prisma.letterRequest.findUnique({
      where: { uuid: ticket?.letterUuid },
      include: { RootChildLetters: true, LetterTicket: true },
    });
    if (!parent) {
      return NextResponse.json(
        { error: "Original Letter Request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(parent, { status: 200 });
  } catch (error) {
    console.error("Error updating request and creating ticket:", error);
    return NextResponse.json(
      { error: "Failed to update request and create ticket" },
      { status: 500 }
    );
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
