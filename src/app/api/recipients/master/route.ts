import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import prisma from "lib/prisma";

// GET: Fetch all recipients
export async function GET(request: Request) {
  try {
    // Get the query parameters from the request
    const url = new URL(request.url);
    const withRelations = url.searchParams.get("withrelations") === "true"; // Convert to boolean

    // Conditionally include
    const recipients = await prisma.recipientsMaster.findMany({
      include: withRelations
        ? {
            DepartmentRecipient: true,
            UserPersonRecipient: {
              include: {
                Person: true, // Fetch the related Person entity
                UserRole:true,
              },
            },
          }
        : {}, // Conditional inclusion
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(recipients);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" });
  }  
}
function getrecipienttype(rectype: string) {
  if (rectype == "all") {
    return "";
  }
  if (rectype == "department") {
    return "department";
  }
  if (rectype == "person") {
    return "person";
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse the JSON body explicitly
    const { userPersonUuid, isActive, recipientType, departmentUuid } = body;

    if (!recipientType || recipientType.trim() === "") {
      return NextResponse.json(
        { error: "recipientType is required" },
        { status: 400 }
      );
    }

    if (!departmentUuid || departmentUuid.trim() === "") {
      return NextResponse.json(
        { error: "departmentUuid is required" },
        { status: 400 }
      );
    }
    if (recipientType == "Person") {
      if (!userPersonUuid || userPersonUuid.trim() == "") {
        return NextResponse.json(
          { error: "userPersonUuid is required" },
          { status: 400 }
        );
      }
    }
    const newrecipient = await prisma.recipientsMaster.create({
      data: {
        departmentUuid,
        isActive: isActive as boolean,
        userPersonUuid: recipientType == "Person" ? userPersonUuid : null,
        recipientType,
      },
    });

    return NextResponse.json(newrecipient, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } 
}

// PUT: Update a recuipient
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, countable } = body;
    if (!id) {
      return NextResponse.json({ error: "ID is required" });
    }

    const updatedUnit = await prisma.recipientsMaster.update({
      where: { uuid: id },
      data: {
        ...(name && { name }),
        ...(countable !== undefined && { countable }),
      },
    });

    return NextResponse.json(updatedUnit);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" });
  } 
}

// DELETE: Delete a packaging unit
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" });
    }

    const deletedUnit = await prisma.recipientsMaster.delete({
      where: { uuid: id },
    });

    return NextResponse.json(deletedUnit);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" });
  } 
}
