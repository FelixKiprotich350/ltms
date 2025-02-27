import { NextResponse } from "next/server";
import prisma from "lib/prisma"; // Ensure you have a shared Prisma client in `lib/prisma`

// // GET: Fetch a single notification by ID
export async function GET(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  const { uuid } = params;
  try {
    const category = await prisma.recipientsMaster.findUnique({
      where: {
        uuid: uuid,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching Notification:", error);
    return NextResponse.json(
      { error: "Failed to fetch Notification" },
      { status: 500 }
    );
  }
}

// PUT: Update a Notification by ID
export async function PUT(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  const { uuid } = params;

  try {
    const body = await request.json();
    const { isEnabled } = body;

    const updatedNotification = await prisma.notificationMaster.update({
      where: {
        uuid: uuid,
      },
      data: {
        isEnabled: isEnabled as boolean,
      },
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error("Error updating Notification:", error);
    return NextResponse.json(
      { error: "Failed to update Notification" },
      { status: 500 }
    );
  }
}
