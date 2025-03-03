import { hasPermissions } from "lib/authTask";
import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authresponse = await hasPermissions(request, ["view_admin_reports"]);
  if (!authresponse.isAuthorized) {
    return authresponse.message;
  }
  const departments = await prisma.letterTicket.findMany({
    include: {
      Letter: true,
    },
  });

  
//   LettersCount: number;
//   RecipientsCount: number;
//   TicketsCount: number;
  return NextResponse.json(departments);
}
 