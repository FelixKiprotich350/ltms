import { NextRequest, NextResponse } from "next/server";
import prisma from "lib/prisma";
import { hasPermissions } from "lib/authTask";

// GET: Fetch all departments
export async function GET(request: NextRequest) {
  try {
    const authresponse = await hasPermissions(request, [
      "view_admin_letter_categories",
    ]);
    if (!authresponse.isAuthorized) {
      return authresponse.message;
    }
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
export async function POST(request: NextRequest) {
  try {
    const authresponse = await hasPermissions(request, [
      "manage_admin_letter_categories",
    ]);
    if (!authresponse.isAuthorized) {
      return authresponse.message;
    }
    const body = await request.json();
    const { name, description, isretired } = body;

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
