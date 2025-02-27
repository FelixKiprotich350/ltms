import { NextResponse } from "next/server";
import prisma from "lib/prisma"; // Ensure you have a shared Prisma client in `lib/prisma`

// // GET: Fetch a single category by ID
export async function GET(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  const { uuid } = params;
  try {
    const category = await prisma.recipientsMaster.findUnique({
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

// PUT: Update a category by ID
export async function PUT(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  const { uuid } = params;

  try {
    const body = await request.json();
    const { isActive } = body;

    const updatedCategory = await prisma.recipientsMaster.update({
      where: {
        uuid: uuid,
      },
      data: {
        isActive: isActive as boolean,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
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
  } 
}
