import { NextResponse } from "next/server";
import prisma from "lib/prisma";

// GET: Fetch all departments
export async function GET() {
  try {
    const departments = await prisma.organisationDepartment.findMany({
      include: { Users: true },
    });
    return NextResponse.json(departments, { status: 200 });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: Create a new department
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, activeStatus } = body;

    // Basic input validation
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Invalid name" },
        { status: 400 }
      );
    }

    const newDepartment = await prisma.organisationDepartment.create({
      data: {
        name,
        description,
        activeStatus: activeStatus ?? true, // Default to true if not provided
      },
    });

    return NextResponse.json(newDepartment, { status: 201 });
  } catch (error) {
    console.error("Error creating department:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
