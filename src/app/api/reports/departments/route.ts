import { hasPermissions } from "lib/authTask";
import prisma from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authresponse = await hasPermissions(request, ["view_admin_reports"]);
  if (!authresponse.isAuthorized) {
    return authresponse.message;
  }

  const departments = await prisma.organisationDepartment.findMany({
    include: {
      Letters: true,
      Users: true,
      RecipientsMaster: true,
    },
  });

  // Process the data to add counts
  const departmentsWithCounts = departments.map((department) => ({
    ...department,
    LettersCount: department.Letters?.length ?? 0,
    RecipientsCount: department.RecipientsMaster?.length ?? 0,
    TicketsCount:
      department.Letters.filter(
        (l) => l.rootLetterUuid == null && l.parentLetterUuid == null
      ).length ?? 0,
  }));

  return NextResponse.json(departmentsWithCounts);
}
