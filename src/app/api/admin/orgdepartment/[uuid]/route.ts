import { NextResponse } from "next/server";
import prisma from "lib/prisma";
import { hasPermission } from "lib/authTask";

// POST: update a department
export async function PUT(request: Request) {
  try {
    const authresponse = await hasPermission(
      "manage_admin_organisation_departments"
    );
    if (!authresponse) {
      return NextResponse.json(
        {
          message: "Unauthorized",
          error: "manage_admin_organisation_departments permission required",
        },
        { status: 401 }
      );
    }
    const body = await request.json();
    const { name, description, activeStatus } = body;

    // Basic input validation
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
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
