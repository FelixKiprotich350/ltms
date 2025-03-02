import NextAuth, { ExtendedUser, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import prisma from "lib/prisma";
import bcrypt from "bcryptjs";
import {
  LtmsUser,
  OrganisationDepartment,
  PermissionMaster,
  Person,
  UserPermission,
  UserRole,
} from "@prisma/client";
import { AdapterUser } from "next-auth/adapters";

// Define CustomUser
interface CustomUser extends AdapterUser {
  uuid: string;
  role: UserRole;
  department: OrganisationDepartment;
  person: Person;
  fullName: string;
  permissions: UserPermission[];
}

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
            UserPermissions: {
              include: {
                PermissionMaster: {
                  select: {
                    uuid: true,
                    codeName: true,
                  },
                },
              },
            },
          },
        });

        if (!user || !user?.Department || !user.Person || !user.UserRole)
          return null;

        const validPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!validPassword) return null;

        // Return an object matching CustomUser
        const customUser: CustomUser = {
          id: user.uuid, // Required by NextAuth
          uuid: user.uuid,
          name: `${user.Person?.firstName} ${user.Person?.lastName}`,
          fullName: `${user.Person?.firstName} ${user.Person?.lastName}`,
          email: user.Person?.email ?? "", // Ensure email is not undefined
          role: user.UserRole,
          department: user.Department,
          person: user.Person,
          permissions: user.UserPermissions,
          emailVerified: null,
        };

        return customUser;
      },
    }),
  ],
  // pages: {
  //   signIn: "/signing",
  // },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 10, // 10 minutes
    updateAge: 0, // Refresh JWT every minute
  },
  jwt: {
    maxAge: 60 * 10, // 10 minutes
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as CustomUser;
        token.id = customUser.uuid;
        token.uuid = customUser.uuid;
        token.role = customUser.role;
        token.department = customUser.department;
        token.person = customUser.person;
        token.fullName = customUser.fullName;
        token.permissions = customUser.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user = {
          ...session.user,
          id: token.uuid as string,
          uuid: token.uuid as string,
          UserRole: token.role as UserRole,
          OrganisationDepartment: token.department as OrganisationDepartment,
          Person: token.person as Person,
          UserPermissions: token.permissions as UserPermission[],
        } as ExtendedUser;
      }
      return session;
    },
    // async redirect({ url, baseUrl }) {
    //   console.log(url, baseUrl);
    //   // Preserve callbackUrl if present, otherwise go to home page
    //   return url.startsWith(baseUrl) ? url : baseUrl;
    // },
  },
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }

  interface ExtendedUser extends LtmsUser {
    id: string;
    name?: string;
    image?: string;
    UserRole: UserRole;
    OrganisationDepartment: OrganisationDepartment;
    Person: Person;
    UserPermissions: UserPermission[];
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
