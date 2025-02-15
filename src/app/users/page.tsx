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
  Link,
} from "@carbon/react";
import {useFetchUsers} from "../hooks/useFetchUsers";



export default function UserManagement() { 
  const { users, isLoading, error } = useFetchUsers();



  return (
    <div>
      <h3>User Management</h3>

      {isLoading ? (
        <p aria-live="polite">Loading users...</p>
      ) : error ? (
        <p aria-live="polite">Error: {error}</p>
      ) : (
        <TableContainer title="User List">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>ID</TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Gender</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Login Status</TableHeader>
                <TableHeader>Approval Status</TableHeader>
                <TableHeader>Details</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    {user.Person?.firstName} {user.Person?.lastName}
                  </TableCell>
                  <TableCell>{user.Person?.gender}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.Role?.name}</TableCell>
                  <TableCell>{user.loginStatus}</TableCell>
                  <TableCell>{user.approvalStatus}</TableCell>
                  <TableCell>
                    <Link href={`/users/${user.uuid}`}>
                      <a style={{ color: "#0f62fe", textDecoration: "underline" }}>View User</a>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
