"use client";

import React, { use, useEffect, useState } from "react";
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
  Category,
} from "@carbon/icons-react";
import "./page.css";
import { useDashboardData } from "./hooks/useDashboardData";
import { color } from "@carbon/charts";
import { LetterRequest } from "@prisma/client";

interface DashboardDataModel {
  categories: number;
  recentletters: LetterRequest[];
  letterscount: number;
  userscount: number;
  departmentscount: number;
  ticketscount: number;
  lettersperdepartment: {
    uuid: string;
    name: string;
    _count: { Letters: number };
  }[];
}

interface CountData {
  title: string;
  value: string | number | Array<any>;
  color: string;
  icon: any;
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<CountData[]>([]);

  const { data, isLoading, error } = useDashboardData();
  console.log(data);
  useEffect(() => {
    if (data) {
      setDashboardData([
        {
          title: "Total Letters",
          value: data.letterscount ?? 0,
          color: "#e2d8d8",
          icon: DocumentPdf,
        },
        {
          title: "Total Tickets",
          value: data.ticketscount ?? 0,
          color: "#e2d8d8",
          icon: Task,
        },
        {
          title: "Total Users",
          value: data.userscount ?? 0,
          color: "#e2d8d8",
          icon: UserMultiple,
        },
        {
          title: "Departments",
          value: data.departmentscount ?? 0,
          color: "#e2d8d8",
          icon: Categories,
        },
      ]);
    }
  }, [data]);

  const headers = ["Subject", "Sender Type", "createdAt"];
  const rows = data?.recentletters
    ? data.recentletters.map((letter) => ({
        id: letter.uuid,
        subject: letter.subject,
        senderType: letter.senderType,
        createdAt: letter.createdAt,
      }))
    : [];

  const pieData = [
    { group: "Active Users", value: 893 },
    { group: "Inactive Users", value: 250 },
    { group: "Pending Requests", value: 55 },
  ];

  const chartData = data?.lettersperdepartment
    ? data?.lettersperdepartment?.map((dept) => ({
        group: dept.name,
        value: dept._count?.Letters ?? 0,
      }))
    : [];
  return (
    <Layer className="dashboardContainer">
      {/* Upper Section - Stats */}
      <Grid fullWidth style={{ paddingLeft: "4px", paddingRight: "4px" }}>
        {dashboardData.map((stat, index) => {
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
                    {rows?.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.subject}</TableCell>
                        {/* <TableCell>{row.senderType}</TableCell> */}
                        <TableCell>
                          <Tag
                            type={
                              row.senderType.toLowerCase() === "person"
                                ? "green"
                                : row.senderType.toLowerCase() === "department"
                                ? "warm-gray"
                                : "red"
                            }
                          >
                            {row.senderType}
                          </Tag>
                        </TableCell>
                        <TableCell>
                          {new Date(row.createdAt).toLocaleDateString()}
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
              data={chartData}
              options={{
                title: "Letter Distribution Per Department",
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
