"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
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
  Dropdown,
  SkeletonText,
  SkeletonPlaceholder,
} from "@carbon/react";
import { useUserRoles } from "app/hooks/useUserRoles";
import { useUserDetails } from "app/hooks/useUserDetails";

interface ExtendedUser extends LtmsUser {
  Person?: Person;
  UserRole?: UserRole;
  Department?: OrganisationDepartment;
}

export default function UserDetailsPage() {
  const { uuid } = useParams();
  const { roles } = useUserRoles();
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading } = useUserDetails(uuid);

  const updateUserStatus = async (action: "approve" | "disable") => {
    if (!user) return;
    try {
      const response = await fetch(`/api/users/${uuid}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`Failed to ${action} user: ${response.statusText}`);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    }
  };

  const updateUserRole = async (newRole: UserRole) => {
    if (!user) return;
    try {
      const response = await fetch(`/api/users/${uuid}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId: newRole.uuid }),
      });
      if (!response.ok) {
        throw new Error("Failed to update role.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <Grid fullWidth>
      <Column sm={4} md={6} lg={8}>
        <Tile style={{ padding: "1.5rem", borderRadius: "8px" }}>
          <h3 style={{ marginBottom: "1rem" }}>User Details</h3>

          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <SkeletonPlaceholder style={{ height: "40px", width: "80%" }} />
              <SkeletonText width="60%" />
              <SkeletonText width="50%" />
              <SkeletonText width="70%" />
              <SkeletonText width="40%" />
              <SkeletonText width="30%" />
              <SkeletonPlaceholder style={{ height: "40px", width: "120px" }} />
            </div>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
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
                <strong>Role:</strong>
                <Dropdown
                  id="role-dropdown"
                  items={roles}
                  itemToString={(role: UserRole) => role.name}
                  initialSelectedItem={user.UserRole}
                  onChange={( selectedItem:UserRole) => updateUserRole(selectedItem)}
                  style={{ width: "200px", display: "inline-block", marginLeft: "0.5rem" }}
                />
              </p>
              <p>
                <strong>Login Status:</strong> {user.loginStatus}
              </p>
              <p>
                <strong>Approval Status:</strong> {user.approvalStatus}
              </p>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                {user.approvalStatus === "PENDING" && (
                  <Button kind="primary" onClick={() => updateUserStatus("approve")}>
                    Approve User
                  </Button>
                )}
                {user.loginStatus === "ENABLED" && (
                  <Button kind="danger" onClick={() => updateUserStatus("disable")}>
                    Disable Login
                  </Button>
                )}
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
