import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

// GET: Fetch all categories
export async function GET() {
  try {
    const product = await prisma.product.findMany({
      include: {
        Category: true, // Include related category
        PackagingUnit: true, // Include related packaging unit
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
  finally{
      prisma.$disconnect();
    }
}

export async function PUT(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    const { uuid, name, description, basicUnitUuid, categoryUuid,sellingPrice } = body;
 
    // Validate required fields
    if (!uuid || !name || !categoryUuid) {
      return NextResponse.json(
        { error: "Missing required fields: uuid, name, or categoryUuid" },
        { status: 400 }
      );
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { uuid }, // Ensure uuid is unique in the database schema
      data: {
        name,
        description,
        basicUnitUuid,
        categoryUuid,
        sellingPrice: parseFloat(sellingPrice),
      },
      include: {
        Category: true, // Include related category
        PackagingUnit: true, // Include related unit
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
  finally{
      prisma.$disconnect();
    }
}

export async function DELETE() {
  try {
    // await prisma.product.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
  finally{
      prisma.$disconnect();
    }
}

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { name, description, basicUnitUuid, categoryUuid, sellingPrice } =
      body;

    // Validate required fields
    if (!name || !categoryUuid) {
      return NextResponse.json(
        { error: "Missing required fields: name or categoryUuid" },
        { status: 400 }
      );
    }

    // Create a new product
    const newProduct = await prisma.product.create({
      data: {
        name,
        description: description || null, // Optional field
        sellingPrice: Number(sellingPrice) || 1,
        Category: {
          connect: {
            uuid: categoryUuid, // Match your `categoryUuid` field with the unique identifier
          },
        },
        PackagingUnit: {
          connect: {
            uuid: basicUnitUuid, // Match your `basicUnitUuid` field with the unique identifier
          },
        },
      },
    });

    // Return the created product
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
  finally{
      prisma.$disconnect();
    }
}
