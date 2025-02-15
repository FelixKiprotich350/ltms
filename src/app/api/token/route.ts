import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { USER_TOKEN } from "lib/constants";

const SECRET_KEY = process.env.JWT_SECRET!; // Ensure you have this in your .env file

export async function GET() {
  try {
    const token = cookies().get(USER_TOKEN)?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, SECRET_KEY);
    return NextResponse.json(decoded, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
