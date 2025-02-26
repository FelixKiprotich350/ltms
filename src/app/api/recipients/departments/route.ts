import { NextResponse } from "next/server";
import prisma from "lib/prisma";

// GET: Fetch all departments
// export async function GET() {
//   try {
//     const departments = await prisma.organisationDepartment.findMany({
//       include: { Users: true },
//     });
//     return NextResponse.json(departments, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching departments:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
