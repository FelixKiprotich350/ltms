import { hasPermissions } from "lib/authTask";
import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authresponse = await hasPermissions(request, ["view_admin_reports"]);
  if (!authresponse.isAuthorized) {
    return authresponse.message;
  }
  const letters = await prisma.letterRequest.findMany({
    include: {
      SenderUser: true,
      SenderDepartment: true,
      LetterCategory: true,
      LetterRecipients: true,
    },
  });
  return NextResponse.json(letters);
}
