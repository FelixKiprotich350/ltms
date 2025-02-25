"use client";

import React, { useState, useEffect, use } from "react";
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
  Dropdown,
} from "@carbon/react";
import { useSession } from "next-auth/react";
import { useUserAccount } from "app/hooks/useUserAccount";

interface ExtendedUser extends LtmsUser {
  Person?: Person;
  UserRole?: UserRole;
  Department?: OrganisationDepartment;
}

export default function MyProfilePage() {
  const { data: sessionData, status, update } = useSession();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {
    user,
    isLoading: fetchisloading,
    error: fetcherror,
  } = useUserAccount(sessionData?.user?.uuid ?? null);

  return (
    <Grid fullWidth>
      <Column sm={4} md={8} lg={8}>
        <Tile>
          <h3>User Details</h3>
          {isLoading ? (
            <InlineLoading description="Loading user details..." />
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : user ? (
            <>
              <h4>
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
                <strong>Deoartment:</strong> {user.Department?.name}
              </p>
              <p>
                <strong>Login Status:</strong> {user.loginStatus}
              </p>
              <p>
                <strong>Approval Status:</strong> {user.approvalStatus}
              </p>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <Button kind="secondary ">Change Password</Button>
              </div>
            </>
          ) : (
            <p>User not found.</p>
          )}
        </Tile>
      </Column>
    </Grid>
  );
}
