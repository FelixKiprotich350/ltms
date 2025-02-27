import { NextResponse } from "next/server";
import prisma from "lib/prisma"; // Ensure you have a shared Prisma client in `lib/prisma`

// PUT: Update a department
export async function PUT(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  const { uuid } = params;

  try {
    const body = await request.json();
    const { name, description } = body;

    const updatedDepartment = await prisma.organisationDepartment.update({
      where: {
        uuid: uuid,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(updatedDepartment);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }  
}
