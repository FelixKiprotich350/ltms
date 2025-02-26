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
import { UserAccountLoginStatus } from "lib/constants";

interface Department {
  uuid: string;
  name: string;
  activeStatus: boolean;
  description: string;
}
interface RecipientModel {
  uuid: string;
  departmentUuid: string;
  userPersonUuid?: string;
  name: string;
  recipientType: string;
  isActive: boolean;
  description: string;
}
export default function RecipientDepartment() {
  const [recipients, setRecipients] = useState<RecipientModel[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    activeStatus: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const fetchRecipients = async () => {
    try {
      const url = new URL("/api/recipients/master", window.location.origin);
      url.searchParams.append("withrelations", "true"); // Add the parameter

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
    }
  };
  // Fetch departments from the backend
  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/admin/orgdepartment");
        if (response.ok) {
          const data = await response.json();
          setDepartments(data);
        } else {
          console.error("Failed to fetch departments");
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
    fetchRecipients();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredDepartments = departments.filter(
    (department) =>
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.description.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleEditCategory = (category: Department) => {
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

  const handleCheckBoxChange = async (departmentItem: Department) => {
    try {
      const editingRecipient = recipients.find(
        (item) => item.departmentUuid == departmentItem.uuid
      );
      const isRecipient = editingRecipient ? true : false;
      const editurl = editingRecipient
        ? `/api/recipients/master/${editingRecipient.uuid}`
        : "/api/recipients/master";

      const response = await fetch(editurl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPersonUuid: null,
          departmentUuid: departmentItem.uuid,
          recipientType: "Department",
          isActive: true,
        }),
      });

      if (response.ok) {
        const updatedRecipients = await fetch("/api/recipients/master");
        if (updatedRecipients.ok) {
          const data = await updatedRecipients.json();
          setRecipients(
            data.filter(
              (item: RecipientModel) => item.recipientType == "Department"
            )
          );
        }
      } else {
        console.error("Failed to update recipient");
      }
    } catch (error) {
      console.error("Error updating recipient:", error);
    }
  };

  return (
    <div>
      <h3>Organisational Departments</h3>
      <TextInput
        id="search-departments"
        labelText="Search departments"
        placeholder="Search by Name or Description"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: "1rem", width: "100%" }}
      />

      {isLoading ? (
        <InlineLoading description="Loading Departments..." />
      ) : (
        <TableContainer title="All Departments">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Organizational Status</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader>Action</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDepartments.map((department) => {
                const Recipient = recipients.find(
                  (r) => r.departmentUuid == department.uuid
                );
                let isRecipient = false;
                if (Recipient) {
                  if (Recipient.isActive == true) {
                    isRecipient = true;
                  } else {
                    isRecipient = false;
                  }
                }
                return (
                  <TableRow key={department.uuid}>
                    <TableCell>{department.name}</TableCell>
                    <TableCell>
                      {department.activeStatus ? (
                        <label style={{ color: "green" }}>Active</label>
                      ) : (
                        <label style={{ color: "darkred" }}>Inactive</label>
                      )}
                    </TableCell>
                    <TableCell>{department.description}</TableCell>
                    <TableCell>
                      {recipients.find(
                        (item) => item.departmentUuid === department.uuid
                      )?.isActive ? (
                        <label style={{ color: "darkblue" }}>Enabled</label>
                      ) : (
                        <Button
                          id={`checkbox-${department.uuid}`}
                          kind="tertiary"
                          size="sm"
                          onClick={() => handleCheckBoxChange(department)}
                        >
                          Enable
                        </Button>
                      )}
                    </TableCell>
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
          />
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
            <SelectItem
              key={"ENABLED"}
              text={"ENABLED"}
              value={UserAccountLoginStatus.ENABLED}
            />
            <SelectItem
              key={"DISABLED"}
              text={"DISABLED"}
              value={UserAccountLoginStatus.DISABLED}
            />
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
