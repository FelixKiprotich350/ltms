"use client";

import React, { useState, useEffect } from "react";
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
  Checkbox,
} from "@carbon/react";
import { useUserRoles } from "app/hooks/useUserRoles";
import { useUserDetails } from "app/hooks/useUserDetails";

interface ExtendedUser extends LtmsUser {
  Person?: Person;
  UserRole?: UserRole;
  Department?: OrganisationDepartment;
  permissions?: string[];
}

export default function UserDetailsPage() {
  const { uuid } = useParams();
  const { roles } = useUserRoles();
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading } = useUserDetails(uuid);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);

  // Fetch all available permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetch("/api/permissions");
        if (!response.ok) throw new Error("Failed to fetch permissions.");
        const data: string[] = await response.json();
        setPermissions(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      }
    };

    fetchPermissions();
  }, [uuid]);

  const updateUserPermissions = async (updatedPermissions: string[]) => {
    try {
      const response = await fetch(`/api/users/${uuid}/permissions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions: updatedPermissions }),
      });
      if (!response.ok) {
        throw new Error("Failed to update permissions.");
      }
      setUserPermissions(updatedPermissions);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    }
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    const updatedPermissions = checked
      ? [...userPermissions, permission]
      : userPermissions.filter((perm) => perm !== permission);

    setUserPermissions(updatedPermissions);
    updateUserPermissions(updatedPermissions);
  };

  return (
    <Grid fullWidth>
      <Column sm={4} md={6} lg={8}>
        <Tile style={{ padding: "1.5rem", borderRadius: "8px" }}>
          <h3 style={{ marginBottom: "1rem" }}>User Details</h3>

          {isLoading ? (
            <SkeletonPlaceholder style={{ height: "40px", width: "80%" }} />
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : user ? (
            <div>
              <h4 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                {user.Person?.firstName} {user.Person?.lastName}
              </h4>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.UserRole?.name}
              </p>

              <h4>Permissions</h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {permissions.map((permission) => (
                  <Checkbox
                    key={permission}
                    id={permission}
                    labelText={permission}
                    checked={userPermissions.includes(permission)}
                    onChange={(e: any) =>
                      handlePermissionChange(permission, e.target.checked)
                    }
                  />
                ))}
              </div>

              <div
                style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}
              >
                {user.approvalStatus === "PENDING" && (
                  <Button kind="primary">Approve User</Button>
                )}
              </div>
            </div>
          ) : (
            <p>User not found.</p>
          )}
        </Tile>
      </Column>
    </Grid>
  );
}
