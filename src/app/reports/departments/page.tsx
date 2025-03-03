"use client";

import React, { FC, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  Tag,
} from "@carbon/react";
import { useFetchDepartmentsReports } from "../hooks/useFetchDepartmentsReports";

export default function Reports() {
  const { departments, isLoading, error } = useFetchDepartmentsReports();

  return (
    <div>
      <h3>Reports</h3>
      <TableContainer title="Departments Report">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Description</TableHeader>
              <TableHeader>Letters</TableHeader>
              <TableHeader>Recipients</TableHeader>
              <TableHeader>Tickets</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map((dep) => (
              <TableRow key={dep.uuid}>
                <TableCell>{dep.name}</TableCell>
                <TableCell>
                  {dep.activeStatus ? <Tag type="purple">Active</Tag> : <Tag TYPE="magenta">Inactive</Tag>}
                </TableCell>
                <TableCell>{dep.description}</TableCell>
                <TableCell>{dep.LettersCount}</TableCell>
                <TableCell>{dep.RecipientsCount}</TableCell>
                <TableCell>{dep.TicketsCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
