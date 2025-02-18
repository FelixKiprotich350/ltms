'use client';

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
} from "@carbon/react";

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function ProductCategories () {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({ id: "", name: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/inventory/categories");
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

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = async () => {
    if (newCategory.name && newCategory.description) {
      try {
        const response = await fetch("/api/inventory/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCategory),
        });

        if (response.ok) {
          const createdCategory = await response.json();
          setCategories([...categories, createdCategory]);
          setNewCategory({ id: "", name: "", description: "" });
          setIsModalOpen(false);
        } else {
          console.error("Failed to add category");
        }
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
    setNewCategory(category);
  };

  const handleSaveCategory = async () => {
    if (editingCategory) {
      try {
        const response = await fetch(`/api/inventory/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCategory),
        });

        if (response.ok) {
          const updatedCategory = await response.json();
          setCategories(
            categories.map((cat) =>
              cat.id === updatedCategory.id ? updatedCategory : cat
            )
          );
          setEditingCategory(null);
          setNewCategory({ id: "", name: "", description: "" });
          setIsModalOpen(false);
        } else {
          console.error("Failed to save category");
        }
      } catch (error) {
        console.error("Error saving category:", error);
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/inventory/categories/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCategories(categories.filter((category) => category.id !== id));
      } else {
        console.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div>
      <h3>Product Categories</h3>
      <TextInput
        id="search-categories"
        labelText="Search Categories"
        placeholder="Search by Name or Description"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: "1rem", width: "100%" }}
      />
      <Button kind="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: "1rem" }}>
        Add Category
      </Button>

      {isLoading ? (
        <InlineLoading description="Loading categories..." />
      ) : (
        <TableContainer title="Product Categories">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>ID</TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
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
                    <Button
                      size="sm"
                      kind="danger"
                      onClick={() => handleDeleteCategory(category.id)}
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
          modalHeading={editingCategory ? "Edit Category" : "Add Category"}
          primaryButtonText={editingCategory ? "Save" : "Add"}
          secondaryButtonText="Cancel"
          onRequestClose={() => setIsModalOpen(false)}
          onRequestSubmit={editingCategory ? handleSaveCategory : handleAddCategory}
        >
          <TextInput
            id="category-name"
            labelText="Category Name"
            value={newCategory.name}
            onChange={(e: any) => setNewCategory({ ...newCategory, name: e.target.value })}
            style={{ marginBottom: "1rem" }}
          />
          <TextInput
            id="category-description"
            labelText="Category Description"
            value={newCategory.description}
            onChange={(e: any) => setNewCategory({ ...newCategory, description: e.target.value })}
          />
        </Modal>
      )}
    </div>
  );
};

