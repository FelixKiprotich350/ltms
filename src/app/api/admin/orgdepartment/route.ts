import { NextRequest, NextResponse } from "next/server";
import prisma from "lib/prisma";
import { hasPermissions } from "lib/authTask";

// GET: Get all departments
export async function GET(request: NextRequest) {
  try {
    const authresponse = await hasPermissions(request, [
      "view_admin_organisation_departments",
    ]);
    if (!authresponse.isAuthorized) {
      return authresponse.message;
    }
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
export async function POST(request: NextRequest) {
  try {
    const authresponse = await hasPermissions(request, [
      "manage_admin_organisation_departments",
    ]);
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
