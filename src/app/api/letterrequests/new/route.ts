import { NextResponse } from "next/server";
import prisma from "lib/prisma";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken"; // Ensure you have this installed (npm install jsonwebtoken)
import { cookies } from "next/headers";
import { LtmsUser } from "@prisma/client";
import { USER_TOKEN } from "lib/constants";
import mime from "mime"; // Install with `npm install mime`

interface FileMeta {
  fileUrl: string;
  fileName: string;
  fileType: string;
}
export async function POST(request: Request) {
  try {
    // Read token from cookies
    const token = cookies().get(USER_TOKEN)?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Decode the JWT token to get user details
    const secret = process.env.JWT_SECRET as string; // Ensure you have a secret key in .env
    const decodedToken = jwt.verify(token, secret) as {
      uuid: string;
      email: string;
    };

    const { uuid, email } = decodedToken;
    const user = await prisma.ltmsUser.findFirst({
      where: { email: email },
      include: {
        Department: true,
      },
    });
    if (!user) {
      return NextResponse.json("Unauthorized User", { status: 401 });
    }
    if (!user.Department) {
      return NextResponse.json("Unauthorized User: Missing Department", {
        status: 401,
      });
    }
    const formData = await request.formData();

    const subject = formData.get("subject") as string;
    const body = formData.get("letterbody") as string;
    const externalReference = formData.get("externalReference") as string;
    const letterCategoryUuid = formData.get("categoryUuid") as string;
    const confidentiality = formData.get("confidentiality") as string;
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
          externalReference,
          letterCategoryUuid,
          senderUserUuid: user.uuid,
          senderDepartmentUuid: user.Department?.uuid ?? "",
          status: "PENDING",
          confidentiality,
        },
      });

      // Create Recipients
      await Promise.all(
        recipientDepartments.map((recipientUuid) =>
          tx.letterRecipients.create({
            data: {
              recipientUuid,
              letterUuid: letterRequest.uuid,
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
              fileName: file.fileName,
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
