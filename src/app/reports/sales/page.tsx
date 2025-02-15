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
import { Product, ProductSale } from "@prisma/client";

interface ExtendedSale extends ProductSale {
  InventoryProduct: Product;
}
export default function Reports() {
  const [sales, setSales] = useState<ExtendedSale[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/reports/sales");
      const data = await response.json();

      setSales(data);
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

      <TableContainer title="Sales Reports as of ...">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>ID</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Quantity</TableHeader>
              <TableHeader>Date</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.InventoryProduct?.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
