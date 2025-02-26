import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "lib/prisma";
import { authOptions } from "app/api/auth/[...nextauth]/route";

// export async function GET(request: Request) {
//   try {
//     // Get user session
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     if (session.user?.uuid == undefined || session.user?.uuid == null) {
//       return NextResponse.json(
//         { error: "User Required in this action." },
//         { status: 401 }
//       );
//     }
//     // Extract department UUID from the user's session
//     const user = await prisma.ltmsUser.findUnique({
//       where: { uuid: session.user.uuid }, // Assuming email is unique
//       include: {
//         Department: true,
//       },
//     });

//     if (!user || !(user as any).Department) {
//       return NextResponse.json(
//         { error: "User department not found" },
//         { status: 404 }
//       );
//     }

//     const departmentUuid = (user as any)?.Department?.uuid;

//     // Parse request parameters
//     const url = new URL(request.url);
//     const withRelations = url.searchParams.get("withrelations") === "true";

//     const recipients = await prisma.letterRecipient.findMany({
//       where: {
//         OR: [
//           {
//             RecipientMaster: {
//               recipientType: "DEPARTMENT",
//               departmentUuid: departmentUuid,
//             },
//           },
//           {
//             RecipientMaster: {
//               recipientType: "PERSON",
//               userPersonUuid: user.uuid,
//             },
//           },
//         ],
//       },
//     });

//     if (recipients.length === 0) {
//       return []; // No recipients found, return an empty list early
//     }

//     const letters = await prisma.letterRequest.findMany({
//       where: {
//         uuid: { in: recipients.map((r) => r.letterUuid) },
//       },
//       include: withRelations
//         ? {
//             SenderDepartment: true,
//             SenderUser: {
//               include: {
//                 Person: true,
//                 UserRole: true,
//               },
//             },
//           }
//         : {},
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json(letters, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching letter requests:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

export async function GET(request: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.user?.uuid) {
      return NextResponse.json(
        { error: "User Required in this action." },
        { status: 401 }
      );
    }

    // Extract department UUID from the user's session
    const user = await prisma.ltmsUser.findUnique({
      where: { uuid: session.user.uuid },
      include: {
        Department: true,
      },
    });

    if (!user || !user.Department) {
      return NextResponse.json(
        { error: "User department not found" },
        { status: 404 }
      );
    }

    const departmentUuid = user.Department.uuid;

    // Parse request parameters
    const url = new URL(request.url);
    const withRelations = url.searchParams.get("withrelations") === "true";

    // Fetch recipients (letters received by the user or their department)
    const recipients = await prisma.letterRecipient.findMany({
      where: {
        OR: [
          {
            RecipientMaster: {
              recipientType: "DEPARTMENT",
              departmentUuid: departmentUuid,
            },
          },
          {
            RecipientMaster: {
              recipientType: "PERSON",
              userPersonUuid: user.uuid,
            },
          },
        ],
      },
      select: {
        letterUuid: true,
        status: true,
      },
    });

    if (recipients.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Fetch letters that the logged-in user has received
    const letters = await prisma.letterRequest.findMany({
      where: {
        uuid: { in: recipients.map((r) => r.letterUuid) },
      },
      include: withRelations
        ? {
            SenderDepartment: true,
            SenderUser: {
              include: {
                Person: true,
                UserRole: true,
              },
            },
            LetterRecipients: {
              select: {
                status: true,
                RecipientMaster: {
                  select: {
                    recipientType: true,
                    departmentUuid: true,
                    userPersonUuid: true,
                  },
                },
              },
            },
          }
        : {
            LetterRecipients: {
              select: {
                status: true,
                RecipientMaster: {
                  select: {
                    recipientType: true,
                    departmentUuid: true,
                    userPersonUuid: true,
                  },
                },
              },
            },
          },
      orderBy: { createdAt: "desc" },
    });

    // Format letters to include only statuses relevant to the logged-in user
    const lettersWithStatus = letters.map((letter) => {
      const relevantStatuses = letter.LetterRecipients?.filter(
        (recipient) =>
          (recipient.RecipientMaster.recipientType === "DEPARTMENT" &&
            recipient.RecipientMaster.departmentUuid === departmentUuid) ||
          (recipient.RecipientMaster.recipientType === "PERSON" &&
            recipient.RecipientMaster.userPersonUuid === user.uuid)
      ).map((recipient) => recipient.status);

      return {
        ...letter,
        recipientLetterReceivedstatus:
          relevantStatuses.length > 0 ? relevantStatuses[0] : "Unknown", // This will be an array of statuses
      };
    });

    return NextResponse.json(lettersWithStatus, { status: 200 });
  } catch (error) {
    console.error("Error fetching letter requests:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
