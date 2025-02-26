"use client";

import React, { useState } from "react";
import {
  LtmsUser,
  OrganisationDepartment,
  Person,
  UserRole,
} from "@prisma/client";
import {
  Grid,
  Column,
  Tile,
  Button,
  InlineLoading,
} from "@carbon/react";
import { useSession } from "next-auth/react";
import { useUserAccount } from "app/hooks/useUserAccount";

interface ExtendedUser extends LtmsUser {
  Person?: Person;
  UserRole?: UserRole;
  Department?: OrganisationDepartment;
}

export default function MyProfilePage() {
  const { data: sessionData } = useSession();
  const [error, setError] = useState<string | null>(null);

  const {
    user,
    isLoading: fetchIsLoading,
    error: fetchError,
  } = useUserAccount(sessionData?.user?.uuid ?? null);

  return (
    <Grid fullWidth>
      <Column sm={4} md={8} lg={8}>
        <Tile style={{ padding: "1.5rem", borderRadius: "8px" }}>
          <h3 style={{ marginBottom: "1rem" }}>User Details</h3>

          {fetchIsLoading ? (
            <InlineLoading description="Loading user details..." />
          ) : fetchError ? (
            <p style={{ color: "red" }}>{fetchError}</p>
          ) : user ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <h4 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                {user.Person?.firstName} {user.Person?.lastName}
              </h4>
              <p>
                <strong>Gender:</strong> {user.Person?.gender}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.UserRole?.name}
              </p>
              <p>
                <strong>Department:</strong> {user.Department?.name}
              </p>
              <p>
                <strong>Login Status:</strong> {user.loginStatus}
              </p>
              <p>
                <strong>Approval Status:</strong> {user.approvalStatus}
              </p>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <Button kind="secondary">Change Password</Button>
              </div>
            </div>
          ) : (
            <p style={{ color: "gray", fontSize: "1.1rem" }}>User not found.</p>
          )}
        </Tile>
      </Column>
    </Grid>
  );
}
