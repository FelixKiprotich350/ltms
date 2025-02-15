"use client";

import React, { useState } from "react";
import { Select, SelectItem } from "@carbon/react";
import StockLevelsReport from "./stockLevel";
import StockReceivedReport from "./stockReceived";

export default function Reports() {
  const [reportType, setReportType] = useState("");

  const handleReportTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReportType(e.target.value);
  };

  return (
    <div>
      <h3>Reports</h3>
      <Select
        id="report-type"
        labelText="Select Report Type"
        value={reportType}
        onChange={handleReportTypeChange}
        style={{ marginBottom: "1rem" }}
      >
        <SelectItem value="stocklevel" text="Stock Level Report" />
        <SelectItem value="stockreceived" text="Products Received Report" />
      </Select>

      {reportType === "stocklevel" && <StockLevelsReport />}
      {reportType === "stockreceived" && <StockReceivedReport />}

      {reportType === "" && <p>You have not selected any report</p>}
    </div>
  );
}
