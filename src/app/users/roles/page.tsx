"use client";

import React, { FC, useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
} from "@carbon/react";
import { Person, Role, TrtUser as user } from "@prisma/client";

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setIsLoading(true);
        setError(null); // Reset error before a new fetch

        const response = await fetch("/api/roles/all"); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`Failed to fetch Roles: ${response.statusText}`);
        }

        const data = await response.json();
        setRoles(data); // Assume the API returns a list of users
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return (
    <div>
      <h3>Roles Management</h3>

      {isLoading ? (
        <p>Loading Roles...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <TableContainer title="User List">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Description</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.uuid}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
