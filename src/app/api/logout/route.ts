// app/api/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateToken, verifyToken } from "../../../lib/jwt";
import { hashPassword, verifyPassword } from "../../../lib/password";

const prisma = new PrismaClient();

//interfaces
interface LoginCredentials {
  email: string;
  password: string;
}

 


export async function POST(request: Request) {
  const response = NextResponse.json({ message: 'Logout successful' });
  response.cookies.delete('authToken'); // Remove the cookie
 

  return response;
}
