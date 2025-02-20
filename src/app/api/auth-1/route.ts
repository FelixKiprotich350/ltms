import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"; // Install with `npm install jsonwebtoken`
import { USER_TOKEN } from "lib/constants";

const SECRET = process.env.JWT_SECRET!; // Ensure you have this in your .env file

export async function GET() {
  try {
    // Get the token from cookies
    const token = cookies().get(USER_TOKEN)?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, SECRET);
    return NextResponse.json(
      { authenticated: true, user: decoded },
      { status: 200 }
    );
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 401 }
    );
  }
}
