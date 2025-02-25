"use client";

import React from "react";
import { Grid, Column, Layer, Tag, Tile } from "@carbon/react";
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
  Task,
  LicenseDraft,
  DocumentPdf,
  Categories,
  Category
} from "@carbon/icons-react";
import { blue60, green60, yellow50, teal60 } from "@carbon/react";
import "./page.css";

export default function Dashboard() {
  const stats = [
    { title: "Total Letters", value: 1200, color: blue60, icon: DocumentPdf },
    { title: "Total Tickets", value: 950, color: green60, icon: Task },
    { title: "Total Users", value: 450, color: yellow50, icon: UserMultiple },
    { title: "Departments", value: 67, color: teal60, icon: Categories },
  ];

  const headers = ["Name", "Sender", "Status"];
  const rows = [
    { id: "1", name: "Test Subject A", role: "Person", status: "Pending" },
    { id: "1", name: "Test Subject A", role: "Person", status: "Pending" },
    { id: "1", name: "Test Subject A", role: "Person", status: "Pending" },
    { id: "2", name: "Test Subject B", role: "Department", status: "Pending" },
    { id: "3", name: "Test Subject C", role: "Department", status: "Received" },
  ];

  const pieData = [
    { group: "Active Users", value: 893 },
    { group: "Inactive Users", value: 250 },
    { group: "Pending Requests", value: 55 },
  ];

  return (
    <Layer className="dashboardContainer">
      {/* Upper Section - Stats */}
      <Grid fullWidth style={{ paddingLeft: "4px", paddingRight: "4px" }}>
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Column
              key={index}
              sm={4}
              md={4}
              lg={4}
              className="dashboardStatColumn"
            >
              <Tile className="dashboardStatTile">
                <IconComponent size={32} />
                <h4 style={{ fontSize: "1.25rem", fontWeight: "600" }}>
                  {stat.title}
                </h4>
                <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {stat.value.toLocaleString()}
                </p>
              </Tile>
            </Column>
          );
        })}
      </Grid>

      {/* Lower Section */}
      <Grid
        fullWidth
        style={{
          marginTop: "4px",
          paddingLeft: "4px",
          paddingRight: "4px",
          height: "calc(100vh - 250px)",
        }}
      >
        {/* Left Column - Scrollable Table */}
        <Column
          sm={4}
          md={6}
          lg={8}
          style={{
            marginLeft: "4px",
            marginRight: "4px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Layer
            style={{
              padding: "4px",
              borderRadius: "4px",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TableContainer
              title="Recent Letter Requests"
              className="customTableContainer"
            >
              <div
                style={{ overflowY: "auto", flexGrow: 1, maxHeight: "300px" }}
              >
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
              </div>
            </TableContainer>
          </Layer>
        </Column>

        {/* Right Column - Bar Chart (Non-Scrollable) */}
        <Column
          sm={4}
          md={6}
          lg={8}
          style={{
            marginLeft: "4px",
            marginRight: "4px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Layer
            style={{
              padding: "4px",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <SimpleBarChart
              data={pieData}
              options={{
                title: "User Distribution",
                axes: {
                  left: {
                    mapsTo: "value",
                  },
                  bottom: {
                    scaleType: ScaleTypes.LABELS,
                    mapsTo: "group",
                  },
                },
                height: "100%", // Make chart height dynamic
                resizable: true, // Allow chart to resize with parent
                toolbar: {
                  enabled: true,
                  controls: [{ type: ToolbarControlTypes.SHOW_AS_DATATABLE }],
                },
              }}
            />
          </Layer>
        </Column>
      </Grid>
    </Layer>
  );
}
