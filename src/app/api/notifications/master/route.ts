import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import prisma from "lib/prisma";

// GET: Fetch all notificationsMaster
export async function GET(request: Request) {
  try {
    // Get the query parameters from the request
    const url = new URL(request.url);
    const withRelations = url.searchParams.get("withrelations") === "true"; // Convert to boolean

    // Conditionally include
    const notifications = await prisma.notificationMaster.findMany({
      include: withRelations
        ? {
            ChildNotifications: true,
          }
        : {}, // Conditional inclusion
    });

    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" });
  }
}
