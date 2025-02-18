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
  } finally {
    prisma.$disconnect();
  }
}

// PUT: Update a category by ID
export async function PUT(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  const { uuid } = params;

  try {
    const body = await request.json();
    const { name, description } = body;

    const updatedCategory = await prisma.organisationDepartment.update({
      where: {
        uuid: uuid,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  } finally {
    prisma.$disconnect();
  }
}

// DELETE: Delete a category by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await prisma.organisationDepartment.delete({
      where: {
        uuid: id,
      },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  } finally {
    prisma.$disconnect();
  }
}


export async function generateTicketNumber() {
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
  const ticketNumber = `T-${month}-${year}-${String(nextNumber).padStart(3, "0")}`;

  return ticketNumber;
}