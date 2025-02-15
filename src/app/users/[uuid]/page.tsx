"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Person, Role, TrtUser as User } from "@prisma/client";
import {
  Grid,
  Column,
  Tile,
  Button,
  InlineLoading,
  Dropdown,
} from "@carbon/react";
import { useFetchUsers } from "app/hooks/useFetchUsers";

interface TrtUser extends User {
  Person: Person;
  Role: Role;
}

export default function UserDetailsPage() {
  const { uuid } = useParams();
  const [user, setUser] = useState<TrtUser | null>(null);
  const [currentUser, setCurrentUser] = useState<TrtUser | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const {
    users,
    isLoading: fetchisloading,
    error: fetcherror,
  } = useFetchUsers();

  useEffect(() => {
    if (!uuid) return;

    setUser(users.find((item: TrtUser) => item.uuid == uuid) ?? null);
  }, [uuid]);

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
      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    }
  };

  const updateUserRole = async (newRole: Role) => {
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
      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    }
  };

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
                <strong>Role:</strong>{" "}
                {currentUser?.uuid === user.uuid ? (
                  user.Role?.name // Display only if it's the current user
                ) : (
                  <Dropdown
                    id="role-dropdown"
                    items={roles}
                    itemToString={(role: Role) => role.name}
                    initialSelectedItem={user.Role}
                    onChange={(selectedItem: Role) =>
                      updateUserRole(selectedItem)
                    }
                  />
                )}
              </p>
              <p>
                <strong>Login Status:</strong> {user.loginStatus}
              </p>
              <p>
                <strong>Approval Status:</strong> {user.approvalStatus}
              </p>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                {user.approvalStatus === "PENDING" && (
                  <Button
                    kind="primary"
                    onClick={() => updateUserStatus("approve")}
                  >
                    Approve User
                  </Button>
                )}
                {user.loginStatus === "ENABLED" && (
                  <Button
                    kind="danger"
                    onClick={() => updateUserStatus("disable")}
                  >
                    Disable Login
                  </Button>
                )}
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
