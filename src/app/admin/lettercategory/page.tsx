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

interface CategoryPayload {
  uuid?: string;
  name: string;
  isretired: boolean;
  description: string;
}
export default function LetterCategories() {
  const [categories, setCategories] = useState<CategoryPayload[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryPayload | null>(null);
  const [newCategory, setNewCategory] = useState<CategoryPayload>({
    uuid: "",
    name: "",
    isretired: false,
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/admin/lettercategories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.description) return;
    try {
      const response = await fetch("/api/admin/lettercategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        const createdCategory = await response.json();
        setCategories([...categories, createdCategory]);
        setNewCategory({
          uuid: "",
          name: "",
          isretired: false,
          description: "",
        });
        setIsModalOpen(false);
      } else {
        console.error("Failed to add category");
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleEditCategory = (category: CategoryPayload) => {
    setEditingCategory(category);
    setNewCategory(category);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!editingCategory) return;
    try {
      const response = await fetch(
        `/api/admin/lettercategories/${editingCategory.uuid}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCategory),
        }
      );

      if (response.ok) {
        const updatedCategory = await response.json();
        setCategories(
          categories.map((cat) =>
            cat.uuid === updatedCategory.uuid ? updatedCategory : cat
          )
        );
        setEditingCategory(null);
        setNewCategory({
          uuid: "",
          name: "",
          isretired: false,
          description: "",
        });
        setIsModalOpen(false);
      } else {
        console.error("Failed to save category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <div>
      <h3>Letter Categories</h3>
      <TextInput
        id="search-departments"
        labelText="Search categories"
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
        Add Category
      </Button>

      {isLoading ? (
        <InlineLoading description="Loading Categories..." />
      ) : (
        <TableContainer title="All Categories">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Retired</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.uuid}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.isretired ? "Yes" : "No"}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      kind="secondary"
                      onClick={() => handleEditCategory(category)}
                      style={{ marginRight: "0.5rem" }}
                    >
                      Edit
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
          modalHeading={editingCategory ? "Edit Category" : "Add Category"}
          primaryButtonText={editingCategory ? "Save" : "Add"}
          secondaryButtonText="Cancel"
          onRequestClose={() => setIsModalOpen(false)}
          onRequestSubmit={
            editingCategory ? handleSaveCategory : handleAddCategory
          }
        >
          <TextInput
            id="category-name"
            labelText="Category Name"
            value={newCategory?.name}
            onChange={(e: any) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
            style={{ marginBottom: "1rem" }}
          />
          <Select
            id="category-isretired"
            labelText="Retired"
            value={String(newCategory.isretired)}
            onChange={(e: any) =>
              setNewCategory({
                ...newCategory,
                isretired: e.target.value === "true",
              })
            }
            style={{ marginBottom: "1rem" }}
          >
            <SelectItem key="" text="Select Status" value="" />
            <SelectItem key="true" text="Yes" value="true" />
            <SelectItem key="false" text="No" value="false" />
          </Select>
          <TextInput
            id="category-description"
            labelText="Category Description"
            value={newCategory?.description}
            onChange={(e: any) =>
              setNewCategory({ ...newCategory, description: e.target.value })
            }
          />
        </Modal>
      )}
    </div>
  );
}
