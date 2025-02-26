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
  Checkbox,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  TableRowExpanded,
  SkeletonPlaceholder,
} from "@carbon/react";
import { useUserRoles } from "app/hooks/useUserRoles";
import { useUserDetails } from "app/hooks/useUserDetails";

interface Permission {
  uuid: string;
  commonName: string;
  category: string;
  description: string;
}

export default function UserDetailsPage() {
  const { uuid } = useParams();
  const { roles } = useUserRoles();
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading } = useUserDetails(uuid);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);

  // Fetch permissions from API
  useEffect(() => {
    async function fetchPermissions() {
      try {
        const response = await fetch("/api/permissions");
        if (!response.ok) {
          throw new Error("Failed to fetch permissions.");
        }
        const data = await response.json();
        setPermissions(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      }
    }
    fetchPermissions();
  }, []);

  // Fetch user permissions
  // useEffect(() => {
  //   if (!user) return;
  //   async function fetchUserPermissions() {
  //     try {
  //       const response = await fetch(`/api/users/${uuid}/permissions`);
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch user permissions.");
  //       }
  //       const data = await response.json();
  //       setUserPermissions(data);
  //     } catch (err: any) {
  //       setError(err.message || "Something went wrong.");
  //     }
  //   }
  //   fetchUserPermissions();
  // }, [user]);

  // Handle permission assignment
  const handlePermissionChange = async (permissionId: string, isChecked: boolean) => {
    try {
      // const response = await fetch(`/api/users/${uuid}/permissions`, {
      //   method: isChecked ? "POST" : "DELETE",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ permissionId }),
      // });
      // if (!response.ok) {
      //   throw new Error("Failed to update permissions.");
      // }
      setUserPermissions((prev) =>
        isChecked ? [...prev, permissionId] : prev.filter((id) => id !== permissionId)
      );
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <Grid fullWidth>
      <Column sm={16} md={16} lg={16}>
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
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>Assign</TableHeader>
                      <TableHeader>Common Name</TableHeader>
                      <TableHeader>Category</TableHeader>
                      <TableHeader>Description</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {permissions.map((permission) => (
                      <TableRow key={permission.uuid}>
                        <TableCell>
                          <Checkbox
                            id={permission.uuid}
                            checked={userPermissions.includes(permission.uuid)}
                            onChange={(e: any) =>
                              handlePermissionChange(permission.uuid, e.target.checked)
                            }
                          />
                        </TableCell>
                        <TableCell>{permission.commonName}</TableCell>
                        <TableCell>{permission.category}</TableCell>
                        <TableCell>{permission.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

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
