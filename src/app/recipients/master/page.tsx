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

interface Department {
  uuid: string;
  name: string;
  activeStatus: string;
  description: string;
}

export default function ProductCategories() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    activeStatus: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch departments from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/recipients/departments");
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

    fetchCategories();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCategories = departments.filter(
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
            activeStatus: "",
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
              dep.uuid === updatedCategory.id ? updatedCategory : dep
            )
          );
          setEditingDepartment(null);
          setNewCategory({
            name: "",
            description: "",
            activeStatus: "",
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

  const handleDeleteCategory = async (uuid: string) => {
    try {
      const response = await fetch(`/api/recipients/departments/${uuid}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDepartments(departments.filter((dep) => dep.uuid !== uuid));
      } else {
        console.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div>
      <h3>Master Recipients</h3>
      <TextInput
        id="search-recipients"
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
        Add Recipient
      </Button>

      {isLoading ? (
        <InlineLoading description="Loading Recipients..." />
      ) : (
        <TableContainer title="All Recipients">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.uuid}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.activeStatus}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      kind="tertiary"
                      onClick={() => handleEditCategory(category)}
                      style={{ marginRight: "0.5rem" }}
                    >
                      Edit
                    </Button>
                    {/* <Button
                      size="sm"
                      kind="danger"
                      onClick={() => handleDeleteCategory(category.uuid)}
                    >
                      Delete
                    </Button> */}
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
