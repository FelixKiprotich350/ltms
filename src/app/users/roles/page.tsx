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
import { useUserRoles } from "app/hooks/useUserRoles";

export default function RoleManagement() {
  const { roles,isLoading,error } = useUserRoles();

 

  return (
    <div>
      <h3>Roles Management</h3>

      {isLoading ? (
        <p>Loading Roles...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <TableContainer title="User Roles List">
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
