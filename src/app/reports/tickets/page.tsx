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
  Select,
  SelectItem,
  Button,
} from "@carbon/react";
import { LetterSenderRecipientType } from "lib/constants";
import { useFetchTicketsReports } from "../hooks/useFetchTicketsReports";

export default function Reports() {
  const { tickets, isLoading, error } = useFetchTicketsReports();

  return (
    <div>
      <h3>Reports</h3>
      <TableContainer title="Tickets List Report">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Ticket No</TableHeader>
              <TableHeader>Subject</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Date</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((tick) => (
              <TableRow key={tick.uuid}>
                <TableCell>{tick.ticketNumber}</TableCell>
                <TableCell>{tick.Letter?.subject}</TableCell>
                <TableCell>{tick.ticketClosed ? "CLOSED" : "OPEN  "}</TableCell>
                <TableCell>{tick.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
