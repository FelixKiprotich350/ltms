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
  Button,
  TextInput,
  Modal,
  InlineLoading,
  Select,
  SelectItem,
} from "@carbon/react";

interface Department {
  uuid: string | null;
  name: string;
  activeStatus: boolean;
  description: string;
}

export default function OrganisationalDepartment() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [newDepartment, setNewDepartment] = useState<Department>({
    uuid: null,
    name: "",
    description: "",
    activeStatus: false,
  });
  const [isLoading, setIsLoading] = useState(false);

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
    if (newDepartment.name && newDepartment.description) {
      try {
        const response = await fetch("/api/admin/orgdepartment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newDepartment),
        });

        if (response.ok) {
          const createdDepartment = await response.json();
          setDepartments([...departments, createdDepartment]);
          setNewDepartment({
            uuid: null,
            name: "",
            description: "",
            activeStatus: false,
          });
          setIsModalOpen(false);
        } else {
          console.error("Failed to add department");
        }
      } catch (error) {
        console.error("Error adding department:", error);
      }
    }
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setNewDepartment(department);
    setIsModalOpen(true);
  };

  const handleSaveDepartment = async () => {
    if (editingDepartment) {
      try {
        const response = await fetch(
          `/api/admin/orgdepartment/${editingDepartment.uuid}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newDepartment),
          }
        );

        if (response.ok) {
          const updatedDepartment = await response.json();
          setDepartments(
            departments.map((dep) =>
              dep.uuid === updatedDepartment.uuid ? updatedDepartment : dep
            )
          );
          setEditingDepartment(null);
          setNewDepartment({
            uuid: null,
            name: "",
            description: "",
            activeStatus: false,
          });
          setIsModalOpen(false);
        } else {
          console.error("Failed to save department");
        }
      } catch (error) {
        console.error("Error saving department:", error);
      }
    }
  };

  const handleDeleteDepartment = async (uuid: string) => {
    try {
      const response = await fetch(`/api/admin/orgdepartment/${uuid}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDepartments(departments.filter((dep) => dep.uuid !== uuid));
      } else {
        console.error("Failed to delete department");
      }
    } catch (error) {
      console.error("Error deleting department:", error);
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
      <Button
        kind="primary"
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: "1rem" }}
      >
        Add Department
      </Button>

      {isLoading ? (
        <InlineLoading description="Loading Departments..." />
      ) : (
        <TableContainer title="All Departments">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Active Status</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDepartments.map((department) => (
                <TableRow key={department.uuid}>
                  <TableCell>{department.name}</TableCell>
                  <TableCell>
                    {department.activeStatus ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>{department.description}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      kind="secondary"
                      onClick={() => handleEditDepartment(department)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      kind="danger"
                      onClick={() =>
                        handleDeleteDepartment(department.uuid || "")
                      }
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
            editingDepartment ? handleSaveDepartment : handleAddDepartment
          }
        >
          <TextInput
            id="department-name"
            labelText="Department Name"
            value={newDepartment.name}
            onChange={(e: any) =>
              setNewDepartment({ ...newDepartment, name: e.target.value })
            }
          />
          <TextInput
            id="department-description"
            labelText="Department Description"
            value={newDepartment.description}
            onChange={(e: any) =>
              setNewDepartment({
                ...newDepartment,
                description: e.target.value,
              })
            }
          />
        </Modal>
      )}
    </div>
  );
}
