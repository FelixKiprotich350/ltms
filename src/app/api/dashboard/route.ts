import { NextResponse } from "next/server";
import prisma from "lib/prisma";

// GET: Fetch top 10 selling products
export async function GET() {
  try {
    const categories = await prisma.letterCategory.count();
    const departments = await prisma.organisationDepartment.findMany({});

    // Fetch letter counts and sort departments by count in descending order
    const topdepartments = (
      await Promise.all(
        departments.map(async (dep) => {
          const depcount = await prisma.letterRequest.count({
            where: { senderDepartmentUuid: dep.uuid },
          });
          return {
            uuid: dep.uuid,
            name: dep.name,
            totalRooteLetters: depcount,
          };
        })
      )
    )
      .sort((a, b) => b.totalRooteLetters - a.totalRooteLetters) // Sort in descending order
      .slice(0, 5); // Take the top 5 departments

    const letterscount = await prisma.letterRequest.count();
    const userscount = await prisma.ltmsUser.count();
    const departmentscount = await prisma.organisationDepartment.count();
    const ticketscount = await prisma.letterTicket.count();
    const lettersperdepartment = await prisma.organisationDepartment.findMany({
      select: {
        uuid: true,
        name: true,
        _count: {
          select: { Letters: true },
        },
      },
    });

    const resdata = {
      categories,
      topdepartments,
      letterscount,
      departmentscount,
      userscount,
      ticketscount,
      lettersperdepartment,
    };

    return NextResponse.json(resdata, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
