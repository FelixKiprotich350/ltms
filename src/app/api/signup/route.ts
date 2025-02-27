import prisma from "lib/prisma";
import { NextResponse } from "next/server";
import { hashPassword } from "../../../lib/password";
import { DEFAULT_DEPARTMENT_UUID, DEFAULT_ROLE_UUID } from "lib/constants";

//interfaces
type LoginCredentials = {
  email: string;
  password: string;
};

export async function POST(request: Request) {
  try {
    const { email, password, firstname, lastname } = await request.json();

    // Check if the email is already taken
    let person = await prisma.person.findUnique({ where: { email } });
    // Create Person first to get the UUID if not existing
    if (!person) {
      person = await prisma.person.create({
        data: {
          firstName: firstname,
          lastName: lastname,
          email: email,
        },
      });
    }

    if (!person) {
      return NextResponse.json(
        { error: "Failed to create Person" },
        { status: 500 }
      );
    }
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create LtmsUser with the person's UUID
    const user = await prisma.ltmsUser.create({
      data: {
        username: email,
        personUuid: person?.uuid, // Referencing the created person via uuid
        email: email,
        departmentUuid: DEFAULT_DEPARTMENT_UUID,
        passwordHash: await hashPassword(password),
        userRoleUuid: DEFAULT_ROLE_UUID,
      },
    });

    // Return success response
    return NextResponse.json({
      message: "Signup successful",
      user: {
        id: user.uuid,
        username: user.username,
        email: user.email,
        person: {
          firstName: person.firstName,
          lastName: person.lastName,
        },
      },
    });
  } catch (error: any) {
    console.error("Error during signup:", error);

    // Return error response
    return NextResponse.json(
      { error: error.message || "An unknown error occurred." },
      { status: 500 }
    );
  }  
}
