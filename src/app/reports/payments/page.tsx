"use client";

import React, { FC, useEffect, useState } from "react";
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
import { SalesPayments } from "@prisma/client";

export default function Payments() {
  const [payments, setPayments] = useState<SalesPayments[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/reports/payments");
      const data = await response.json();

      setPayments(data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <h3>Sales Reports</h3>

      <TableContainer title="Payments Reports as of ...">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>ID</TableHeader>
              <TableHeader>Mode</TableHeader>
              <TableHeader>Amount</TableHeader>
              <TableHeader>Date</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.paymentMode}</TableCell>
                <TableCell>Ksh {Number(item.amountPaid).toFixed(2)}</TableCell>
                <TableCell>{item.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
