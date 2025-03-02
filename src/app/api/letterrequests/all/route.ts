import { NextRequest, NextResponse } from "next/server";
import prisma from "lib/prisma";
import { hasPermissions } from "lib/authTask";

// GET: Fetch all requests
export async function GET(request: NextRequest) {
  try {
    const authresponse = await hasPermissions(request, ["view_all_letters"]);
    if (!authresponse.isAuthorized) {
      return authresponse.message;
    }
    const url = new URL(request.url);
    const withRelations = url.searchParams.get("withrelations") === "true"; // Convert to boolean

    const letters = await prisma.letterRequest.findMany({
      include: withRelations
        ? {
            SenderDepartment: true,
            SenderUser: {
              include: {
                Person: true, // Fetch the related Person entity
                UserRole: true,
              },
            },
          }
        : {}, // Conditional inclusion
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(letters, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
