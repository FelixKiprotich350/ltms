import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET: Fetch all packaging units
export async function GET(request: Request) {
  try {
    // Get the query parameters from the request
    const url = new URL(request.url);
    const includeProducts = url.searchParams.get("includeproducts") === "true"; // Check if includeProducts is true

    // Conditionally include Products based on the query parameter
    const units = await prisma.packagingUnit.findMany({
      orderBy: { createdAt: "desc" },
      include: includeProducts
        ? { Products: true } // Include Products if true
        : {}, // Don't include Products if false
    });

    return NextResponse.json(units);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" });
  } finally {
    prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse the JSON body explicitly
    const { name, countable } = body;
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newUnit = await prisma.packagingUnit.create({
      data: {
        name,
        countable: Boolean(countable),
      },
    });

    return NextResponse.json(newUnit, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    prisma.$disconnect();
  }
}

// PUT: Update a packaging unit
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, countable } = body;
    if (!id) {
      return NextResponse.json({ error: "ID is required" });
    }

    const updatedUnit = await prisma.packagingUnit.update({
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
  } finally {
    prisma.$disconnect();
  }
}

// DELETE: Delete a packaging unit
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" });
    }

    const deletedUnit = await prisma.packagingUnit.delete({
      where: { uuid: id },
    });

    return NextResponse.json(deletedUnit);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" });
  } finally {
    prisma.$disconnect();
  }
}
