import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import prisma from "lib/prisma";
import bcrypt from "bcryptjs";
import {
  LtmsUser,
  OrganisationDepartment,
  Person,
  UserRole,
} from "@prisma/client";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.ltmsUser.findFirst({
          where: { username: credentials.email },
          include: {
            UserRole: true,
            Department: true,
            Person: true,
          },
        });

        if (!user) return null;

        const validPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!validPassword) return null;

        return {
          id: user.uuid, // Explicitly assign `id`
          uuid: user.uuid, 
          name: user.Person?.firstName + " " + user.Person?.lastName,
          fullName: user.Person?.firstName + " " + user.Person?.lastName,
          email: user.Person?.email, // Assuming `username` is the email
          role: user.UserRole,
          person: user.Person,
          department: user.Department,
        };
      },
    }),
  ],
  pages: {
    signIn: "/signing",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Use JWT-based session
    maxAge: 60 * 5, // Session expires in  5 minutes
    updateAge: 0, // Refresh JWT every hour
  },
  jwt: {
    maxAge: 60 * 5, // Token expires in 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.uuid = (user as any).uuid;
        token.role = (user as any).department;
        token.department = (user as any).role;
        token.person = (user as any).person;
        token.fullName = (user as any).fullName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email;
        session.user.uuid = token.uuid as string;
        session.user.fullName = token.fullName as string;
        session.user.UserRole = token.role as UserRole;
        session.user.OrganisationDepartment =
          token.department as OrganisationDepartment;
        session.user.Person = token.person as Person;
      }
      return session;
    },
  },
};

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      uuid?: string | null;
      fullName?: string | null;
      email?: string | null;
      image?: string | null;
      UserRole?: UserRole;
      OrganisationDepartment?: OrganisationDepartment;
      Person?: Person;
    };
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
