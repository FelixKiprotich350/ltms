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
  Checkbox,
} from "@carbon/react";
import {
  LtmsUser,
  OrganisationDepartment,
  Person,
  UserRole,
} from "@prisma/client";
import { LetterSenderRecipientType } from "lib/constants";

interface RecipientModel {
  uuid: string;
  recipientType: string;
  isActive: boolean;
  description: string;
  DepartmentRecipient?: OrganisationDepartment;
  UserPersonRecipient?: LtmsUser & { Person?: Person; UserRole?: UserRole };
}

export default function MasterRecipient() {
  const [recipients, setRecipients] = useState<RecipientModel[]>([]);
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [personSearch, setPersonSearch] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecipients = async () => {
    setIsLoading(true);
    try {
      const url = new URL("/api/recipients/master", window.location.origin);
      url.searchParams.append("withrelations", "true");

      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        setRecipients(data);
      } else {
        console.error("Failed to fetch recipients");
      }
    } catch (error) {
      console.error("Error fetching recipients:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchRecipients();
  }, []);

  const filteredDepartments = recipients.filter(
    (rec) =>
      rec.recipientType === LetterSenderRecipientType.DEPARTMENT &&
      rec.DepartmentRecipient?.name
        ?.toLowerCase()
        .includes(departmentSearch.toLowerCase())
  );
  const handleDepartmentCheckBoxChange = async (
    recipientItem: RecipientModel,
    checked: boolean
  ) => {
    try {
      const editurl = `/api/recipients/master/${recipientItem.uuid}`;

      const response = await fetch(editurl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: checked,
        }),
      });

      if (response.ok) {
        fetchRecipients();
      } else {
        console.error("Failed to update recipient");
      }
    } catch (error) {
      console.error("Error updating recipient:", error);
    }
  };
  const handlePersonCheckBoxChange = async (
    recipientItem: RecipientModel,
    checked: boolean
  ) => {
    try {
      const editurl = `/api/recipients/master/${recipientItem.uuid}`;

      const response = await fetch(editurl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: checked,
        }),
      });

      if (response.ok) {
        fetchRecipients();
      } else {
        console.error("Failed to update recipient");
      }
    } catch (error) {
      console.error("Error updating recipient:", error);
    }
  };

  const filteredPersons = recipients.filter(
    (rec) =>
      rec.recipientType === LetterSenderRecipientType.PERSON &&
      `${rec.UserPersonRecipient?.Person?.firstName ?? ""} ${
        rec.UserPersonRecipient?.Person?.lastName ?? ""
      }`
        .trim()
        .toLowerCase()
        .includes(personSearch.toLowerCase())
  );

  return (
    <div>
      <h3>Master Recipients</h3>
      <Tabs onSelectionChange={setActiveTab}>
        <TabList contained fullWidth style={{ maxWidth: "500px" }}>
          <Tab>Departments</Tab>
          <Tab>Persons</Tab>
        </TabList>
        <TabPanels>
          {/* Departments Tab */}
          <TabPanel>
            <TextInput
              id="search-departments"
              labelText="Search Departments"
              placeholder="Search by Name"
              value={departmentSearch}
              onChange={(e: any) => setDepartmentSearch(e.target.value)}
              style={{ marginBottom: "1rem", width: "100%" }}
            />
            {isLoading ? (
              <InlineLoading description="Loading Recipients..." />
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>Name</TableHeader>
                      <TableHeader>Recipient Type</TableHeader>
                      <TableHeader>Status</TableHeader>
                      <TableHeader>Description</TableHeader>
                      <TableHeader>Action</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDepartments.map((rec) => (
                      <TableRow key={rec.uuid}>
                        <TableCell>{rec.DepartmentRecipient?.name}</TableCell>
                        <TableCell>{rec.recipientType}</TableCell>
                        <TableCell>
                          {rec.isActive ? (
                            <label style={{ color: "green" }}>Active</label>
                          ) : (
                            <label style={{ color: "darkred" }}>Inactive</label>
                          )}
                        </TableCell>
                        <TableCell>
                          {rec.DepartmentRecipient?.description}
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            labelText=""
                            id={`checkbox-${rec.uuid}`}
                            checked={rec.isActive}
                            onChange={(e: any) =>
                              handleDepartmentCheckBoxChange(
                                rec,
                                e.target.checked
                              )
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          {/* Persons Tab */}
          <TabPanel>
            <TextInput
              id="search-persons"
              labelText="Search Persons"
              placeholder="Search by Name"
              value={personSearch}
              onChange={(e: any) => setPersonSearch(e.target.value)}
              style={{ marginBottom: "1rem", width: "100%" }}
            />
            {isLoading ? (
              <InlineLoading description="Loading Recipients..." />
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>Name</TableHeader>
                      <TableHeader>Recipient Type</TableHeader>
                      <TableHeader>Role</TableHeader>
                      <TableHeader>Status</TableHeader>
                      <TableHeader>Action</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPersons.map((rec) => (
                      <TableRow key={rec.uuid}>
                        <TableCell>
                          {`${
                            rec.UserPersonRecipient?.Person?.firstName ?? ""
                          } ${
                            rec.UserPersonRecipient?.Person?.lastName ?? ""
                          }`.trim()}
                        </TableCell>
                        <TableCell>{rec.recipientType}</TableCell>
                        <TableCell>
                          {rec.UserPersonRecipient?.UserRole?.name}
                        </TableCell>
                        <TableCell>
                          {rec.isActive ? (
                            <label style={{ color: "green" }}>Active</label>
                          ) : (
                            <label style={{ color: "darkred" }}>Inactive</label>
                          )}
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            labelText=""
                            id={`checkbox-${rec.uuid}`}
                            checked={rec.isActive}
                            onChange={(e: any) =>
                              handlePersonCheckBoxChange(rec, e.target.checked)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
