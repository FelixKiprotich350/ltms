// app/api/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, TrtUser } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { USER_TOKEN } from "lib/constants";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET!; // Store in .env

//interfaces
type LoginCredentials = {
  email: string;
  password: string;
};

// export async function POST(request: Request) {
//   try {
//     const { email, password } = await request.json();

//     // Find the user by email
//     const user = await prisma.trtUser.findUnique({
//       where: { email },
//       include: { Person: true },
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: "Invalid email or password" },
//         { status: 401 }
//       );
//     }

//     // Verify the password
//     const isPasswordValid = await verifyPassword(password, user.passwordHash ?? "");
//     if (!isPasswordValid) {
//       return NextResponse.json(
//         { error: "Invalid email or password" },
//         { status: 401 }
//       );
//     }

//     // Generate a JWT token
//     const token = generateToken({ id: user.uuid, email: user.email });

//     // User details to return
//     const userDetails = { name: user.Person?.firstName, email: user.email };

//     // Set the token in a secure cookie
//     const response = NextResponse.json({
//       message: "Login successful",
//       user: userDetails,
//     });
//     response.cookies.set("authToken", token, {
//       httpOnly: false, // Makes the cookie inaccessible via client-side JS
//       secure: process.env.NODE_ENV === "production", // Use secure cookies in production
//       path: "/", // Makes the cookie available across the entire app
//       maxAge: 1 * 60, // Expires in 100 minutes (6000 seconds)
//       // sameSite: "strict", // Prevent cross-site request forgery
//     });

//     return response;
//   } catch (error: any) {
//     console.error("Error during login:", error);
//     return NextResponse.json(
//       { error: "An unexpected error occurred" },
//       { status: 500 }
//     );
//   } finally {
//     prisma.$disconnect();
//   }
// }

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const user = await prisma.trtUser.findFirst({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.uuid, email: user.email }, SECRET_KEY, {
      expiresIn: "5m",
    });

    // Set token in HTTP-only cookie
    cookies().set(USER_TOKEN, token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json({ message: "Login successful" });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
