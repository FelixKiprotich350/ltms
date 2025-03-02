import { NextRequest, NextResponse } from "next/server";
import prisma from "lib/prisma";
import fs from "fs";
import path from "path";
import mime from "mime";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { LeterRecipientReceivedStatus } from "lib/constants";
import { hasPermissions } from "lib/authTask";

interface FileMeta {
  fileUrl: string;
  fileName: string;
  fileType: string;
  userFileName: string;
}
export async function POST(request: NextRequest) {
  try {
    // Get user session
    const authresponse = await hasPermissions(request, ["create_new_letters"]);
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

    if (!user.OrganisationDepartment) {
      return NextResponse.json(
        { error: "User department not found" },
        { status: 404 }
      );
    }
    const formData = await request.formData();

    const subject = formData.get("subject") as string;
    const body = formData.get("letterbody") as string;
    const senderType = formData.get("senderType") as string;
    const externalReference = formData.get("externalReference") as string;
    const letterCategoryUuid = formData.get("categoryUuid") as string;
    const recipientDepartments = formData
      .getAll("recipientDepartments")
      .map(String);

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
          subject,
          body,
          senderType,
          externalReference,
          letterCategoryUuid,
          senderUserUuid: user.uuid,
          senderDepartmentUuid: user.OrganisationDepartment.uuid ?? "",
          letterIsArchived: false,
        },
      });

      // Create Recipients
      await Promise.all(
        recipientDepartments.map((recipientUuid) =>
          tx.letterRecipient.create({
            data: {
              recipientUuid,
              letterUuid: letterRequest.uuid,
              status: LeterRecipientReceivedStatus.PENDING,
            },
          })
        )
      );

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
