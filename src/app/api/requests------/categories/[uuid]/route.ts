import { NextResponse } from "next/server";
import prisma from "lib/prisma"; // Ensure you have a shared Prisma client in `lib/prisma`

// // GET: Fetch a single category by ID
export async function GET(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  const { uuid } = params;
  try {
    const category = await prisma.organisationDepartment.findUnique({
      where: {
        uuid: uuid,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed   to fetch category" },
      { status: 500 }
    );
  }  
}


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
