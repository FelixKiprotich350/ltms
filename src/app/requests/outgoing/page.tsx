"use client";

import React, { FC, useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  Button,
  TextInput,
  Modal,
  InlineLoading,
  Select,
} from "@carbon/react";
import { SelectItem } from "@carbon/react";
import {  LtmsUser, OrganisationDepartment } from "@prisma/client";

interface LetterRequestModel {
  uuid: string;
  externalReference: string | null;
  subject: string;
  body: string;
  confidentiality: string;
  letterCategoryUuid: string;
  senderUserUuid: string;
  senderDepartmentUuid: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  SenderDepartment: OrganisationDepartment;
  SenderUser: LtmsUser;
}

export default function OutgoingLetterRequests() {
  const [letters, setLetters] = useState<LetterRequestModel[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<any | null>(
    null
  );
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    activeStatus: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const fetchRequests = async () => {
    try {
      const url = new URL("/api/letterrequests/all", window.location.origin);
      url.searchParams.append("withrelations", "true"); // Add the parameter

      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        setLetters(data);
      } else {
        console.error("Failed to fetch recipients");
      }
    } catch (error) {
      console.error("Error fetching recipients:", error);
    } finally {
    }
  };
  // Fetch departments from the backend
  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/letterrequests/all");
        if (response.ok) {
          const data = await response.json();
          setDepartments(data);
        } else {
          console.error("Failed to fetch requests");
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
    fetchRequests();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredRequests = letters.filter(
    (department) =>
      department.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDepartment = async () => {
    if (
      newCategory.name &&
      newCategory.description &&
      newCategory.activeStatus
    ) {
      try {
        const response = await fetch("/api/recipients/departments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newCategory.name,
            activeStatus: newCategory.activeStatus,
            description: newCategory.description,
          }),
        });

        if (response.ok) {
          const createdCategory = await response.json();
          setDepartments([...departments, createdCategory]);
          setNewCategory({
            name: "",
            description: "",
            activeStatus: false,
          });
          setIsModalOpen(false);
        } else {
          console.error("Failed to add category");
        }
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

  const handleEditCategory = (category: any) => {
    setEditingDepartment(category);
    setIsModalOpen(true);
    setNewCategory(category);
  };

  const handleSaveCategory = async () => {
    if (editingDepartment) {
      try {
        const response = await fetch(
          `/api/recipients/departments/${editingDepartment.uuid}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newCategory),
          }
        );

        if (response.ok) {
          const updatedCategory = await response.json();
          setDepartments(
            departments.map((dep) =>
              dep.uuid == updatedCategory.id ? updatedCategory : dep
            )
          );
          setEditingDepartment(null);
          setNewCategory({
            name: "",
            description: "",
            activeStatus: false,
          });
          setIsModalOpen(false);
        } else {
          console.error("Failed to save category");
        }
      } catch (error) {
        console.error("Error saving category:", error);
      }
    }
  };

  return (
    <div>
      <h3>Outgoing Letter Requests</h3>
      <TextInput
        id="search-letters"
        labelText="Search Requests"
        placeholder="Search by Name or Description"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: "1rem", width: "100%" }}
      />

      {isLoading ? (
        <InlineLoading description="Loading Requests..." />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Subject</TableHeader>
                <TableHeader>Sender</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Action</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.map((item) => {
                return (
                  <TableRow key={item.uuid}>
                    <TableCell>{item.subject}</TableCell>
                    <TableCell>{item.SenderDepartment?.name}</TableCell>
                    <TableCell>
                      {item.status == "PENDING" ? (
                        <label
                          style={{ color: "darkred", fontStyle: "italic" }}
                        >
                          {"Pending"}
                        </label>
                      ) : (
                        <label style={{ color: "green" }}>Received</label>
                      )}
                    </TableCell>
                    <TableCell>{item.createdAt}</TableCell>
                    <TableCell>{"More"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {isModalOpen && (
        <Modal
          open={isModalOpen}
          modalHeading={
            editingDepartment ? "Edit Department" : "Add Department"
          }
          primaryButtonText={editingDepartment ? "Save" : "Add"}
          secondaryButtonText="Cancel"
          onRequestClose={() => setIsModalOpen(false)}
          onRequestSubmit={
            editingDepartment ? handleSaveCategory : handleAddDepartment
          }
        >
          <TextInput
            id="department-name"
            labelText="Department Name"
            value={newCategory.name}
            onChange={(e: any) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
            style={{ marginBottom: "1rem" }}
          />{" "}
          <Select
            id="department-activestatus"
            labelText="Department Active Status"
            value={newCategory.activeStatus}
            onChange={(e: any) =>
              setNewCategory({ ...newCategory, activeStatus: e.target.value })
            }
            style={{ marginBottom: "1rem" }}
          >
            <SelectItem key={""} text={"Select Status"} value={""} />
            <SelectItem key={"ENABLED"} text={"ENABLED"} value={"ENABLED"} />
            <SelectItem key={"DISABLED"} text={"DISABLED"} value={"DISABLED"} />
          </Select>
          <TextInput
            id="department-description"
            labelText="Department Description"
            value={newCategory.description}
            onChange={(e: any) =>
              setNewCategory({ ...newCategory, description: e.target.value })
            }
          />
        </Modal>
      )}
    </div>
  );
}
