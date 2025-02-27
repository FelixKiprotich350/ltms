"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  TextInput,
  InlineLoading,
  Tabs,
  Tab,
  TabPanel,
  TabList,
  TabPanels,
  Tag,
  Checkbox,
} from "@carbon/react";
import { LtmsUser, NotificationMaster, Notification } from "@prisma/client";
import { LetterSenderRecipientType } from "lib/constants";

interface NotificationMasterModel extends NotificationMaster {
  ChildNotifications: Notification[];
}

export default function MasterRecipient() {
  const [allNotifications, setAllNotifications] = useState<
    NotificationMasterModel[]
  >([]);
  const [notificationSearch, setNotificationSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const url = new URL("/api/notifications/master", window.location.origin);

      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        setAllNotifications(data);
      } else {
        console.error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = allNotifications.filter(
    (rec) =>
      rec.commonName
        ?.toLowerCase()
        .includes(notificationSearch.toLowerCase()) ||
      rec.description?.toLowerCase().includes(notificationSearch.toLowerCase())
  );
  const handleNotificationCheckBoxChange = async (
    notificationItem: NotificationMasterModel,
    checked: boolean
  ) => {
    try {
      const editurl = `/api/notifications/master/${notificationItem.uuid}`;

      const response = await fetch(editurl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: checked,
        }),
      });

      if (response.ok) {
        fetchNotifications();
      } else {
        console.error("Failed to update recipient");
      }
    } catch (error) {
      console.error("Error updating recipient:", error);
    }
  };

  return (
    <div>
      <h3>Notification Items</h3>
      <TextInput
        id="search-notification"
        labelText="Search Notification"
        placeholder="Search by Name and Type"
        value={notificationSearch}
        onChange={(e: any) => setNotificationSearch(e.target.value)}
        style={{ marginBottom: "1rem", width: "100%" }}
      />
      {isLoading ? (
        <InlineLoading description="Loading Notifications..." />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Action</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNotifications.map((rec) => (
                <TableRow key={rec.uuid}>
                  <TableCell>{rec.commonName}</TableCell>
                  <TableCell>{rec.description}</TableCell>
                  <TableCell>
                    <Tag type={rec.isEnabled ? "green" : "red"}>
                      {rec.isEnabled ? "Enabled" : "Disabled"}
                    </Tag>
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      labelText=""
                      id={`checkbox-${rec.uuid}`}
                      checked={rec.isEnabled}
                      onChange={(e: any) =>
                        handleNotificationCheckBoxChange(rec, e.target.checked)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
