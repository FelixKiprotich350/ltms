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
  Modal,
  TextInput,
  Select,
  SelectItem,
  InlineNotification,
} from "@carbon/react";
import { Category, Product, PackagingUnit } from "@prisma/client";
import { useNotification } from "app/layoutComponents/notificationProvider";

interface ProductModel extends Product {
  Category?: Category;
  PackagingUnit?: PackagingUnit;
}

export default function InventoryItems() {
  const { addNotification } = useNotification();

  const [inventory, setInventory] = useState<ProductModel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [basicUnits, setBasicUnits] = useState<PackagingUnit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editProduct, setEditProduct] = useState<ProductModel | null>(null);
  const [formData, setFormData] = useState<Partial<ProductModel>>({
    name: "",
    categoryUuid: "",
    basicUnitUuid: "",
    description: null,
  });

  // Fetch inventory, categories, and basic units data
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/inventory/products");
        if (!response.ok) {
          throw new Error("Failed to fetch inventory data.");
        }
        const data: ProductModel[] = await response.json();
        setInventory(data);
      } catch (err: any) {
        addNotification({
          kind: "error",
          title: "Operation Failed",
          subtitle: "An error occurred while fetching inventory data.",
          timeout: 8000, // 5 seconds
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/inventory/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories.");
        }
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (err: any) {
        addNotification({
          kind: "error",
          title: "Operation Failed",
          subtitle: "An error occurred while fetching categories.",
          timeout: 8000, // 5 seconds
        });
      }
    };

    const fetchBasicUnits = async () => {
      try {
        const response = await fetch("/api/inventory/packunits");
        if (!response.ok) {
          throw new Error("Failed to fetch basic units.");
        }
        const data: PackagingUnit[] = await response.json();
        setBasicUnits(data);
      } catch (err: any) {
        addNotification({
          kind: "error",
          title: "Operation Failed",
          subtitle: "An error occurred while fetching basic units",
          timeout: 8000, // 5 seconds
        });
      }
    };

    fetchInventory();
    fetchCategories();
    fetchBasicUnits();
  }, []);

  // Handle input change for form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  // Open modal for adding/editing a product
  const openModal = (product: ProductModel | null = null) => {
    setEditProduct(product);
    setFormData(
      product || {
        name: "",
        categoryUuid: "",
        basicUnitUuid: "",
        description: null,
      }
    );

    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditProduct(null);
    setFormData({
      basicUnitUuid: "",
      name: "",
      categoryUuid: "",
      description: null,
    });
  };

  // Add or update product
  const saveProduct = async () => {
    try {
      const method = editProduct ? "PUT" : "POST";
      const url = editProduct
        ? `/api/inventory/products`
        : "/api/inventory/products";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        addNotification({
          kind: "error",
          title: "Operation Failed",
          subtitle: "An error occurred while saving the product.",
          timeout: 8000, // 8 seconds
        });
        closeModal();

        return;
      }

      const savedProduct: ProductModel = await response.json();
      setInventory((prev) => {
        if (editProduct) {
          return prev.map((item) =>
            item.id === savedProduct.id ? savedProduct : item
          );
        } else {
          return [...prev, savedProduct];
        }
      });

      closeModal();
      addNotification({
        kind: "success",
        title: "Operation Completed",
        subtitle: "Product saved successfully.",
        timeout: 8000, // 8 seconds
      });
    } catch (err: any) {
      addNotification({
        kind: "error",
        title: "Operation Failed",
        subtitle: "An error occurred while saving the product.",
        timeout: 8000, // 5 seconds
      });
    }
  };

  // Delete product
  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/inventory/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product.");
      }

      setInventory((prev) => prev.filter((item) => item.uuid !== id));
    } catch (err: any) {
      addNotification({
        kind: "error",
        title: "Operation Failed",
        subtitle: "An error occurred while deleting the product.",
        timeout: 8000, // 5 seconds
      });
    }
  };

  return (
    <div>
      <h3>Inventory Items</h3>
      <Button onClick={() => openModal()} kind="primary">
        Add New Product
      </Button>

      <TableContainer title="Inventory List">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>ID</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Category</TableHeader>
              <TableHeader>Basic Unit</TableHeader>
              <TableHeader>SKU</TableHeader>
              <TableHeader>Selling Price</TableHeader>
              <TableHeader>Description</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.Category?.name}</TableCell>
                <TableCell>{item.PackagingUnit?.name}</TableCell>
                <TableCell>{item.skuLevel}</TableCell>
                <TableCell>
                  Ksh {Number(item.sellingPrice)?.toFixed(2) || 0}
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <Button
                    kind="secondary"
                    size="sm"
                    onClick={() => openModal(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    kind="danger"
                    size="sm"
                    onClick={() => deleteProduct(item.uuid)}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal
          open={showModal}
          modalHeading={editProduct ? "Edit Product" : "Add New Product"}
          primaryButtonText={editProduct ? "Save Changes" : "Add Product"}
          secondaryButtonText="Cancel"
          onRequestClose={closeModal}
          onRequestSubmit={saveProduct}
        >
          <div>
            <TextInput
              id="name"
              name="name"
              labelText="Product Name"
              value={formData.name || ""}
              onChange={handleInputChange}
            />
            <Select
              id="categoryUuid"
              name="categoryUuid"
              labelText="Category"
              value={formData.categoryUuid || ""}
              onChange={handleInputChange}
            >
              <SelectItem text="Select a category" value="" />
              {categories.map((category) => (
                <SelectItem
                  key={category.uuid}
                  text={category.name}
                  value={category.uuid}
                />
              ))}
            </Select>
            <Select
              id="basicUnitUuid"
              name="basicUnitUuid"
              labelText="Basic Unit"
              value={formData.basicUnitUuid || ""}
              onChange={handleInputChange}
            >
              <SelectItem text="Select a basic unit" value="" />
              {basicUnits.map((unit) => (
                <SelectItem
                  key={unit.uuid}
                  text={unit.name}
                  value={unit.uuid}
                />
              ))}
            </Select>
            <TextInput
              id="sellingPrice"
              name="sellingPrice"
              labelText="Selling Price"
              type="number"
              value={formData.sellingPrice?.toString() || 1}
              onChange={handleInputChange}
              min="1"
            />
            <TextInput
              id="skuLevel"
              name="skuLevel"
              labelText="SKU Level"
              type="number"
              value={formData.skuLevel || 1}
              onChange={handleInputChange}
              min="1"
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
