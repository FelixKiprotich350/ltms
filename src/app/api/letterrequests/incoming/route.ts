import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "lib/prisma";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { hasPermissions } from "lib/authTask";

export async function GET(request: NextRequest) {
  try {
    const authresponse = await hasPermissions(request, ["view_incoming_letters"]);
    if (!authresponse.isAuthorized) {
      return authresponse.message;
    }
    const res = await authresponse?.message.json();
    const user = res?.data?.description?.user;
    if (!user) {
      return NextResponse.json(
        { error: "User Data not found" },
        { status: 400 }
      );
    }

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
              departmentUuid: user?.OrganisationDepartment?.uuid, //
            },
          },
          {
            RecipientMaster: {
              recipientType: "PERSON",
              userPersonUuid: user?.uuid, //
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
            recipient.RecipientMaster.departmentUuid ===
              user.OrganisationDepartment.uuid) ||
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
