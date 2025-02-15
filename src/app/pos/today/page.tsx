"use client";

// Imports for all components
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
import { Category, Product, ProductSale } from "@prisma/client";

interface ExtendedSaleItem extends ProductSale {
  InventoryProduct: Product;
}

// Todays Sales Component
export default function TodaysSales() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [sales, setSales] = useState<ExtendedSaleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/inventory/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSales = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/pos/todaysales"); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch sales data.");
        }
        const data: ExtendedSaleItem[] = await response.json();
        setSales(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
    fetchSales();
  }, []);

  const totalSales = sales.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0
  );

  return (
    <div>
      <h3>Today's Sales</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isLoading ? (
        <p>Loading sales data...</p>
      ) : (
        <>
          <p>
            <strong>Total Sales:</strong> Ksh {Number(totalSales).toFixed(2)}
          </p>
          <TableContainer title="Sales Details">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>ID</TableHeader>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Category</TableHeader>
                  <TableHeader>Price</TableHeader>
                  <TableHeader>Date</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.id}</TableCell>
                    <TableCell>{sale.InventoryProduct?.name}</TableCell>
                    <TableCell>
                      {
                        categories.find(
                          (category) =>
                            category.uuid == sale.InventoryProduct?.categoryUuid
                        )?.name
                      }
                    </TableCell>
                    <TableCell>Ksh {Number(sale.price).toFixed(2)}</TableCell>
                    <TableCell>{sale.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
}
