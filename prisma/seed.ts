import {
  OrganisationDepartment,
  Person,
  PrismaClient,
  UserRole,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import prisma from "lib/prisma";

async function main() {
  // Hash password
  const passwordHash = await bcrypt.hash("Password123", 10);

  // Seed UserRoles

  await prisma.userRole.createMany({
    data: [
      {
        uuid: "550e8400-e29b-41d4-a716-446655440010", // Optional (Prisma auto-generates UUID)
        name: "Admin",
        codeName: "admin",
        description: "Full access to all system features",
      },

      {
        uuid: "550e8400-e29b-41d4-a716-446655440011",
        name: "Manager",
        codeName: "department_manager",

        description: "Can manage users and permissions",
      },
      {
        uuid: "550e8400-e29b-41d4-a716-446655440012",
        name: "User",
        codeName: "user",
        description: "Regular user with limited access",
      },
    ],
  });

  console.log("User roles seeded successfully!");

  // Seed OrganisationDepartment
  await prisma.organisationDepartment.createMany({
    data: [
      {
        uuid: "550e8400-e29b-41d4-a716-446655440000", // Optional (Prisma auto-generates UUID)
        name: "Finance",
        activeStatus: true,
        description: "Handles financial matters",
      },
      {
        uuid: "550e8400-e29b-41d4-a716-446655440001",
        name: "Human Resources",
        activeStatus: true,
        description: "Manages employee relations",
      },
      {
        uuid: "550e8400-e29b-41d4-a716-446655440002",
        name: "IT Department",
        activeStatus: true,
        description: "Manages IT infrastructure and security",
      },
    ],
  });

  console.log("Seeded organistion department successfully!");

  // Seed Persons
  await prisma.person.createMany({
    data: [
      {
        uuid: "550e8400-e29b-41d4-a716-446655440100", // Optional (Prisma auto-generates UUID)
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phoneNumber: "+254712345678",
        dateOfBirth: new Date("1990-05-15"),
        address: "123 Main St, Nairobi, Kenya",
        gender: "Male",
        nationality: "Kenyan",
      },
      {
        uuid: "550e8400-e29b-41d4-a716-446655440101",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        phoneNumber: "+254798765432",
        dateOfBirth: new Date("1995-08-20"),
        address: "456 Elm St, Mombasa, Kenya",
        gender: "Female",
        nationality: "Kenyan",
      },
      {
        uuid: "550e8400-e29b-41d4-a716-446655440102",
        firstName: "Alice",
        lastName: "Brown",
        email: "alice.brown@example.com",
        phoneNumber: "+254723456789",
        dateOfBirth: new Date("1988-12-10"),
        address: "789 Pine St, Kisumu, Kenya",
        gender: "Female",
        nationality: "Kenyan",
      },
    ],
  });

  console.log("Persons seeded successfully!");

  const persons = await prisma.person.findMany();
  const departments = await prisma.organisationDepartment.findMany();
  const userroles = await prisma.userRole.findMany();

  // Seed LtmsUser linked to the seeded Person, UserRole, and OrganisationDepartment
  await prisma.ltmsUser.create({
    data: {
      uuid: "550e8400-e29b-41d4-a716-446655440500",
      username: "johndoe",
      email: "john.doe@example.com",
      loginStatus: "ENABLED",
      approvalStatus: "APPROVED",
      passwordHash: passwordHash,
      personUuid: (persons as unknown as Array<Person>)[0].uuid,
      userRoleUuid: (userroles as unknown as Array<UserRole>)[0].uuid,
      departmentUuid: (
        departments as unknown as Array<OrganisationDepartment>
      )[0].uuid,
    },
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
