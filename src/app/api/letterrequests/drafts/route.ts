import { NextResponse } from "next/server";
import prisma from "lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import fs from "fs";
import path from "path";
import mime from "mime";
import { LeterRecipientReceivedStatus } from "lib/constants";

interface FileMeta {
  fileUrl: string;
  fileName: string;
  fileType: string;
}

// GET: Fetch drafted requests
export async function GET(request: Request) {
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

    if (!user || !(user as any).Department) {
      return NextResponse.json(
        { error: "User department not found" },
        { status: 404 }
      );
    }

    const departmentUuid = (user as any)?.Department?.uuid;

    // Parse request parameters
    const url = new URL(request.url);
    const withRelations = url.searchParams.get("withrelations") === "true";
    // Fetch letters
    const letters = await prisma.draftedLetterRequest.findMany({
      where: {
        senderUserUuid: user.uuid,
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
          }
        : {},
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(letters, { status: 200 });
  } catch (error) {
    console.error("Error fetching letter requests:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    if (!user || !(user as any).Department) {
      return NextResponse.json(
        { error: "User department not found" },
        { status: 404 }
      );
    }
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
    const senderType = formData.get("senderType") as string;
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
    // const savedFiles = await Promise.all(
    //   attachments.map(async (file, index) => {
    //     if (file instanceof Blob) {
    //       const buffer = Buffer.from(await file.arrayBuffer());
    //       // Get proper file extension
    //       const mimeType = file.type;
    //       const fileExtension = mime.getExtension(mimeType) || "bin"; // Default to .bin if unknown
    //       const fileName = `LRA-${Date.now()}_${index}.${fileExtension}`;
    //       const filePath = path.join(uploadDir, fileName);
    //       fs.writeFileSync(filePath, buffer);
    //       return {
    //         fileUrl: `/attachments/${fileName}`,
    //         fileName: fileName,
    //         fileType: file.type,
    //       };
    //     }
    //     return null;
    //   })
    // );

    // Filter out null values
    // const validFiles = savedFiles.filter(Boolean) as FileMeta[];

    // Use a transaction to insert the data
    const result = await prisma.$transaction(async (tx) => {
      // Create LetterRequest
      const letterRequest = await tx.draftedLetterRequest.create({
        data: {
          subject,
          body,
          senderType,
          externalReference,
          letterCategoryUuid,
          senderUserUuid: user.uuid,
          senderDepartmentUuid: user.Department?.uuid ?? "",
          confidentiality,
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
      // await Promise.all(
      //   validFiles.map((file) =>
      //     tx.attachment.create({
      //       data: {
      //         letterUuid: letterRequest.uuid,
      //         fileUrl: file.fileUrl,
      //         fileType: file.fileType,
      //         fileName: file.fileName,
      //       },
      //     })
      //   )
      // );

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
