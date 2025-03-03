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
import { useFetchLettersReport } from "../hooks/useFetchLettersReport";
import { LetterSenderRecipientType } from "lib/constants";

interface Report {
  id: string;
  date: string;
  type: string;
  details: any[];
}

export default function Reports() {
  const { allletters, isLoading, error } = useFetchLettersReport();

  return (
    <div>
      <h3>Reports</h3>
      <TableContainer title="Letters List Report">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Subject</TableHeader>
              <TableHeader>Sender</TableHeader>
              <TableHeader>Category</TableHeader>
              <TableHeader>Recipients No</TableHeader>
              <TableHeader>Date</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {allletters.map((letter) => (
              <TableRow key={letter.uuid}>
                <TableCell>{letter.subject}</TableCell>
                <TableCell>
                  {letter.senderType == LetterSenderRecipientType.DEPARTMENT
                    ? letter.SenderDepartment?.name
                    : letter.senderType == LetterSenderRecipientType.PERSON
                    ? letter.SenderUser.email
                    : "Unknown"}
                </TableCell>
                <TableCell>{letter.LetterCategory?.name}</TableCell>
                <TableCell>{letter.LetterRecipients?.length}</TableCell>
                <TableCell>{letter.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
