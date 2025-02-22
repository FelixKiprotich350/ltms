import { NextResponse } from "next/server";
import prisma from "lib/prisma";

// GET: Fetch all departments
export async function GET() {
  try {
    const departments = await prisma.letterCategory.findMany({});
    return NextResponse.json(departments, { status: 200 });
  } catch (error) {
    console.error("Error fetching Categories:", error);
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
    const { name, description, isretired,recipientType } = body;

    // Basic input validation
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    const newCategory = await prisma.letterCategory.create({
      data: {
        name,
        description, 
        isretired: Boolean(isretired), 
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
