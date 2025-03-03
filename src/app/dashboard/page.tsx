"use client";

import React, { useEffect, useState } from "react";
import {
  Grid,
  Column,
  Layer,
  Tag,
  Tile,
  SkeletonText,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  SkeletonPlaceholder,
  Loading,
} from "@carbon/react";
import {
  SimpleBarChart,
  ScaleTypes,
  ToolbarControlTypes,
} from "@carbon/charts-react";
import "@carbon/charts/styles.css";
import {
  UserMultiple,
  Task,
  DocumentPdf,
  Categories,
} from "@carbon/icons-react";
import "./page.css";
import { useDashboardData } from "./hooks/useDashboardData";
import { blue20, coolGray10, green20, red20 } from "@carbon/colors";

interface CountData {
  title: string;
  value: string | number | Array<any>;
  color: string;
  icon: any;
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<CountData[]>([]);
  const { data, isLoading, error } = useDashboardData();

  useEffect(() => {
    if (data) {
      setDashboardData([
        {
          title: "Total Letters",
          value: data.letterscount ?? 0,
          color: green20,
          icon: DocumentPdf,
        },
        {
          title: "Total Tickets",
          value: data.ticketscount ?? 0,
          color: blue20,
          icon: Task,
        },
        {
          title: "Total Users",
          value: data.userscount ?? 0,
          color: coolGray10,
          icon: UserMultiple,
        },
        {
          title: "Departments",
          value: data.departmentscount ?? 0,
          color: red20,
          icon: Categories,
        },
      ]);
    }
  }, [data]);

  const headers = ["Department", "Letters", "Replies"];
  const rows =
    data?.topdepartments?.map((dep) => ({
      id: dep.uuid,
      name: dep.name,
      totalRooteLetters: dep.totalRooteLetters,
      totalReplyLetters: dep.totalReplyLetters,
    })) ?? [];

  const chartData =
    data?.lettersperdepartment?.map((dept) => ({
      group: dept.name,
      value: dept._count?.Letters ?? 0,
    })) ?? [];

  return (
    <Layer className="dashboardContainer">
      {/* Upper Section - Stats */}
      <Grid fullWidth style={{ paddingLeft: "4px", paddingRight: "4px" }}>
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Column
                key={index}
                sm={4}
                md={4}
                lg={4}
                className="dashboardStatColumn"
              >
                <Tile className="dashboardStatTile">
                  <SkeletonText width="50px" />
                  <SkeletonText width="100px" />
                  <SkeletonText width="60px" />
                </Tile>
              </Column>
            ))
          : dashboardData.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Column
                  key={index}
                  sm={4}
                  md={4}
                  lg={4}
                  className="dashboardStatColumn"
                >
                  <Tile
                    className="dashboardStatTile"
                    style={{ backgroundColor: stat.color }}
                  >
                    {/* <IconComponent size={32} />
                    <h4 style={{ fontSize: "1.25rem", fontWeight: "600" }}>
                      {stat.title}
                    </h4>
                    <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
                      {stat.value.toLocaleString()}
                    </p> */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <IconComponent size={32} />
                      <h4
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "600",
                          margin: 0,
                        }}
                      >
                        {stat.title}
                      </h4>
                    </div>
                    <p
                      style={{
                        fontSize: "2rem",
                        fontWeight: "bold",
                        marginTop: "0.5rem",
                      }}
                    >
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
          height: "calc(100vh - 210px)",
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
              title="Top Departments (By Letters)"
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
                    {isLoading
                      ? Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <SkeletonText width="100px" />
                            </TableCell>
                            <TableCell>
                              <SkeletonText width="60px" />
                            </TableCell>
                            <TableCell>
                              <SkeletonText width="80px" />
                            </TableCell>
                          </TableRow>
                        ))
                      : rows.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.totalRooteLetters}</TableCell>
                            <TableCell>{row.totalReplyLetters}</TableCell>
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
            {isLoading ? (
              <SkeletonPlaceholder>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                ></div>
              </SkeletonPlaceholder>
            ) : (
              <SimpleBarChart
                data={chartData}
                options={{
                  title: "Letter Distribution Per Department",
                  axes: {
                    left: { mapsTo: "value" },
                    bottom: {
                      scaleType: ScaleTypes.LABELS,
                      mapsTo: "group",
                      visible: false,
                    },
                  },
                  legend: { enabled: true },
                  height: "100%",
                  resizable: true,
                  toolbar: {
                    enabled: true,
                    controls: [{ type: ToolbarControlTypes.SHOW_AS_DATATABLE }],
                  },
                }}
              />
            )}
          </Layer>
        </Column>
      </Grid>
    </Layer>
  );
}
