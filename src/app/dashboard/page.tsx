"use client";

import React from "react";
import { Grid, Column, Layer, Tag } from "@carbon/react";
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@carbon/react";
import {
  PieChart,
  ScaleTypes,
  SimpleBarChart,
  ToolbarControlTypes,
} from "@carbon/charts-react";
import "@carbon/charts/styles.css";
import {
  UserMultiple,
  CheckmarkFilled,
  WarningAltFilled,
  TaskComplete,
} from "@carbon/icons-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Users",
      value: 1200,
      color: "bg-blue-600",
      icon: UserMultiple,
    },
    {
      title: "Active Users",
      value: 950,
      color: "bg-green-600",
      icon: CheckmarkFilled,
    },
    {
      title: "Pending Requests",
      value: 45,
      color: "bg-yellow-500",
      icon: WarningAltFilled,
    },
    {
      title: "Total Letters",
      value: 1100,
      color: "bg-teal-600",
      icon: TaskComplete,
    },
  ];

  const headers = ["Name", "Sender", "Status"];
  const rows = [
    { id: "1", name: "Test Subject A", role: "Person", status: "Pending" },
    { id: "2", name: "Test Subject B", role: "Department", status: "Pending" },
    { id: "3", name: "Test Subject C", role: "Department", status: "Received" },
  ];

  const pieData = [
    { group: "Active Users", value: 950 },
    { group: "Inactive Users", value: 250 },
    { group: "Pending Requests", value: 45 },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Upper Section - Stats */}
      <div className="w-full bg-white rounded-lg shadow-md p-6 mb-6">
        <Grid fullWidth className="gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Column key={index} sm={4} md={4} lg={4}>
                <div
                  className={`${stat.color} text-white p-6 rounded-lg shadow-lg flex flex-col items-center`}
                >
                  <IconComponent size={32} className="mb-2" />
                  <h4 className="text-xl font-semibold">{stat.title}</h4>
                  <p className="text-4xl font-bold">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
              </Column>
            );
          })}
        </Grid>
      </div>

      {/* Lower Section */}
      <Grid fullWidth>
        {/* Left Column - Table */}
        <Column sm={4} md={6} lg={8}>
          <Layer className="p-6 rounded-lg shadow-md bg-white">
            <TableContainer title="User Data">
              <Table>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader key={header}>{header}</TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.role}</TableCell>
                      <TableCell>
                        <Tag
                          type={
                            row.status === "Received"
                              ? "green"
                              : row.status === "Pending"
                              ? "yellow"
                              : "red"
                          }
                        >
                          {row.status}
                        </Tag>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Layer>
        </Column>

        {/* Right Column - Pie Chart */}
        <Column sm={4} md={6} lg={8}>
          <Layer className="p-6 rounded-lg shadow-md bg-white">
            <SimpleBarChart
              data={pieData}
              options={{
                title: "Custom colors (simple bar)",
                axes: {
                  left: {
                    mapsTo: "value",
                  },
                  bottom: {
                    scaleType: ScaleTypes.LABELS,
                    mapsTo: "group",
                  },
                },
                color: {
                  pairing: {
                    option: 2,
                  },
                  scale: {
                    Qty: "#925699",
                    Misc: "#525669",
                  },
                },
                height: "400px",
                toolbar: {
                  enabled: true,
                  controls: [{ type: ToolbarControlTypes.SHOW_AS_DATATABLE }],
                  numberOfIcons: 2, // Ensures only two icons are shown
                },
              }}
            ></SimpleBarChart>
          </Layer>
        </Column>
      </Grid>
    </div>
  );
}
