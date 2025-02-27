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