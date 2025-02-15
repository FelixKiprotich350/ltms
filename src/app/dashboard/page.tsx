"use client";

import { FC, useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  IconButton,
  Tile,
} from "@carbon/react";
import { PackagingUnit, Product } from "@prisma/client";
import { Edit, Money, ShoppingCart, Box, User } from "@carbon/icons-react";
import { useNotification } from "app/layoutComponents/notificationProvider";

interface TopSellingProduct {
  id: number;
  productUuid: string;
  name: string;
  basicUnitUuid: string;
  categoryUuid: string;
  totalSold: number;
}

interface DashboardStatistics {
  topSellingProducts: Array<TopSellingProduct>;
  totalSales: number;
  totalTransactions: number;
  totalProducts: number;
  totalUsers: number;
}

export default function Dashboard() {
  const { addNotification } = useNotification();
  const [dashboardData, setDashboardData] = useState<DashboardStatistics>({
    topSellingProducts: [],
    totalProducts: 0,
    totalSales: 0,
    totalTransactions: 0,
    totalUsers: 0,
  });
  // useAuthCheck();
  // Fetch data from APIs
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        addNotification({
          title: "Error",
          subtitle: "Failed to fetch products",
          kind: "error",
        });
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 55px)",
        overflow: "hidden",
      }}
    >
      {/* Left Column */}
      <div style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
        <TableContainer title="Top 10 Selling Items">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Selling Unit</TableHeader>
                <TableHeader>Category</TableHeader>
                <TableHeader>Total Sold</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {dashboardData.topSellingProducts.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.basicUnitUuid}</TableCell>
                  <TableCell>{item.categoryUuid}</TableCell>
                  <TableCell>{item.totalSold}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Right Column */}
      <div
        style={{
          flex: 1,
          padding: "1rem",
          borderLeft: "1px solid #e0e0e0",
          overflowY: "auto",
        }}
      >
        <h3>Dashboard Statistics</h3>
        <div style={{ display: "grid", gap: "1rem" }}>
          <Tile
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Money size={32} />
            <div>
              <h4>Total Sales</h4>
              <strong>Ksh {dashboardData.totalSales.toFixed(2)}</strong>
            </div>
          </Tile>

          <Tile
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <ShoppingCart size={32} />
            <div>
              <h4>Total Transactions</h4>
              <strong>{dashboardData.totalTransactions}</strong>
            </div>
          </Tile>

          <Tile
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Box size={32} />
            <div>
              <h4>Total Products</h4>
              <strong>{dashboardData.totalProducts}</strong>
            </div>
          </Tile>

          <Tile
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <User size={32} />
            <div>
              <h4>Total Users</h4>
              <strong>{dashboardData.totalUsers}</strong>
            </div>
          </Tile>
        </div>
      </div>
    </div>
  );
}
