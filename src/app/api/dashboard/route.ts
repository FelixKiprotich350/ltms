import { NextResponse } from "next/server";
import prisma from "lib/prisma";

// GET: Fetch top 10 selling products
export async function GET() {
  try {
    const categories = await prisma.letterCategory.count();
    const recentletters = await prisma.letterRequest.findMany({
      where: { rootLetterUuid: null },
      select: {
        uuid: true,
        subject: true,
        createdAt: true,
        senderType: true,
        SenderDepartment: true,
        SenderUser: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    const letterscount = await prisma.letterRequest.count();
    const userscount = await prisma.ltmsUser.count();
    const departmentscount = await prisma.organisationDepartment.count();
    const ticketscount = await prisma.letterTicket.count();

    const resdata = {
      categories,
      recentletters,
      letterscount,
      userscount,
      departmentscount,
      ticketscount,
    };
    return NextResponse.json({ data: resdata }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    prisma.$disconnect();
  }
}
