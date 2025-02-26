import { NextResponse } from "next/server";
import prisma from "lib/prisma";
import fs from "fs";
import path from "path";
import mime from "mime";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import {
  LeterRecipientReceivedStatus,
  LetterSenderRecipientType,
} from "lib/constants";
import { LetterRecipient, RecipientsMaster } from "@prisma/client";

interface FileMeta {
  fileUrl: string;
  fileName: string;
  fileType: string;
  userFileName: string;
}

interface LetterRecipientModel extends LetterRecipient {
  RecipientMaster: RecipientsMaster;
}
export async function POST(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  const { uuid: parentletteruuid } = params;
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user?.uuid == undefined || session.user?.uuid == null) {
      return NextResponse.json(
        { error: "User Required in this action." },
        { status: 401 }
      );
    }
    // Extract department UUID from the user's session
    const user = await prisma.ltmsUser.findUnique({
      where: { uuid: session.user.uuid }, // Assuming email is unique
      include: {
        Department: true,
      },
    });
    if (!user) {
      return NextResponse.json("Unknown User", { status: 401 });
    }

    if (!user.Department) {
      return NextResponse.json("Unauthorized User: Missing Department", {
        status: 401,
      });
    }

    // Extract the parent letter
    const parentletter = await prisma.letterRequest.findUnique({
      where: { uuid: parentletteruuid }, // Assuming email is unique
      include: {
        LetterRecipients: {
          include: {
            RecipientMaster: true,
          },
        },
      },
    });

    if (!parentletter) {
      return NextResponse.json(
        "The Parent Letter you are replying does not Exist!",
        {
          status: 400,
        }
      );
    }

    // Extract the parent letter
    const userAsRecipient = (
      parentletter.LetterRecipients as Array<LetterRecipientModel>
    ).find(
      (item) =>
        (item.RecipientMaster?.userPersonUuid == session.user.uuid &&
          item.RecipientMaster?.recipientType ==
            LetterSenderRecipientType.PERSON) ||
        (item.RecipientMaster?.userPersonUuid == session.user.departmentUuid &&
          item.RecipientMaster?.recipientType ==
            LetterSenderRecipientType.DEPARTMENT)
    );

    if (!userAsRecipient) {
      return NextResponse.json(
        "The User was not a recipient of the current letter!",
        {
          status: 400,
        }
      );
    }

    // Extract the parent letter address as recipient
    const parentLetterSenderAsRecipient =
      await prisma.recipientsMaster.findFirst({
        where: {
          OR: [
            {
              recipientType: LetterSenderRecipientType.DEPARTMENT,
              departmentUuid: parentletter.senderDepartmentUuid,
            },
            {
              recipientType: LetterSenderRecipientType.PERSON,
              userPersonUuid: parentletter.senderUserUuid, // Fixed key to match userUuid instead of departmentUuid
            },
          ],
        },
      });

    if (!parentLetterSenderAsRecipient) {
      return NextResponse.json(
        "The sender you are replying to does not receive Letters!",
        {
          status: 400,
        }
      );
    }
    const formData = await request.formData();

    const body = formData.get("replyMessage") as string;
    const attachments = formData.getAll("attachments[]");

    // Define upload directory
    const uploadDir = path.join(process.cwd(), "public/attachments");

    // Ensure the directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save files locally and generate file paths
    const savedFiles = await Promise.all(
      attachments.map(async (file, index) => {
        if (file instanceof Blob) {
          const buffer = Buffer.from(await file.arrayBuffer());
          // Get proper file extension
          const mimeType = file.type;
          const fileExtension = mime.getExtension(mimeType) || "bin"; // Default to .bin if unknown
          const fileName = `LRA-${Date.now()}_${index}.${fileExtension}`;
          const filePath = path.join(uploadDir, fileName);
          fs.writeFileSync(filePath, buffer);
          return {
            fileUrl: `/attachments/${fileName}`,
            fileName: fileName,
            fileType: file.type,
            userFileName: file.name,
          };
        }
        return null;
      })
    );

    // Filter out null values
    const validFiles = savedFiles.filter(Boolean) as FileMeta[];

    // Use a transaction to insert the data
    const result = await prisma.$transaction(async (tx) => {
      // Create LetterRequest
      const letterRequest = await tx.letterRequest.create({
        data: {
          subject: parentletter.subject,
          body,
          senderType: userAsRecipient.RecipientMaster.recipientType,
          externalReference: null,
          letterCategoryUuid: parentletter.letterCategoryUuid,
          senderUserUuid: user.uuid,
          senderDepartmentUuid: user.Department?.uuid ?? "",
          letterIsArchived: false,
          parentLetterUuid: parentletter.uuid,
          rootLetterUuid: parentletter.rootLetterUuid
            ? parentletter.rootLetterUuid
            : parentletter.uuid,
        },
      });

      // Create Recipients
      await tx.letterRecipient.create({
        data: {
          recipientUuid: parentLetterSenderAsRecipient.uuid,
          letterUuid: letterRequest.uuid,
          status: LeterRecipientReceivedStatus.PENDING,
        },
      });

      // Create Attachments
      await Promise.all(
        validFiles.map((file) =>
          tx.attachment.create({
            data: {
              letterUuid: letterRequest.uuid,
              fileUrl: file.fileUrl,
              fileType: file.fileType,
              systemFileName: file.fileName,
              userFileName: file.userFileName,
            },
          })
        )
      );

      return letterRequest;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating letter:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
