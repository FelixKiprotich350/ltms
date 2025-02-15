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
  Dropdown,
  TextInput,
  Modal,
} from "@carbon/react";
import { IconButton } from "@carbon/react";
import { Edit } from "@carbon/icons-react";
import { Category, PackagingUnit as Packunit, Product } from "@prisma/client";
import { NumberInput } from "@carbon/react";
import { useNotification } from "app/layoutComponents/notificationProvider";

interface ProductModel extends Product {
  Category?: Category;
  PackagingUnit?: Packunit;
}
interface ExtendedPackUnit extends Packunit {
  Products: Array<Product>;
}

export default function ProductPrices() {
  const { addNotification } = useNotification();
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [units, setUnits] = useState<ExtendedPackUnit[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(
    null
  );
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<ExtendedPackUnit | null>(null); // Changed to null for better handling
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch data from API
    fetch("/api/inventory/products") // Replace with your actual API endpoint
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));

    // Fetch list of units from API
    fetch("/api/inventory/packunits?includeproducts=true") // Replace with your actual API endpoint for units
      .then((res) => res.json())
      .then((data) => setUnits(data))
      .catch((err) => console.error("Error fetching units:", err));
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleOpenModal = (product: ProductModel) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedProduct || !unit) return; // Ensure unit is selected

    const payload = {
      productUuid: selectedProduct.uuid,
      quantity: parseFloat(quantity),
      PackUnitUuid: unit.uuid,
      
    };

    try {
      const response = await fetch(`/api/inventory/receivestock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to receive stock");
      }

      addNotification({
        kind: "success",
        title: "Operation Completed",
        subtitle: "Stock received successfully",
        timeout: 5000,
      });

      setIsModalOpen(false);
      setQuantity("");
      setUnit(null);
    } catch (error: any) {
      console.error("Error:", error);
      addNotification({
        kind: "error",
        title: "Operation Failed",
        subtitle: error?.message || "An error occurred",
        timeout: 5000,
      });
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.Category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h3>Receive Inventory Supplies</h3>
      <TextInput
        id="search-products"
        labelText="Search Products"
        placeholder="Search by Name or Category"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: "1rem", width: "100%" }}
      />
      <TableContainer title="Inventory Items">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>ID</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Category</TableHeader>
              <TableHeader>Action</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.Category?.name}</TableCell>
                <TableCell>
                  <IconButton
                    label="Receive"
                    kind="ghost"
                    renderIcon={Edit}
                    onClick={() => handleOpenModal(product)}
                    iconDescription="Edit Product"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for quantity and units */}
      {selectedProduct && (
        <Modal
          open={isModalOpen}
          modalHeading={`Enter details for ${selectedProduct.name}`}
          primaryButtonText="Submit"
          secondaryButtonText="Cancel"
          onRequestClose={() => setIsModalOpen(false)}
          onRequestSubmit={handleSubmit}
        >
          <NumberInput
            id="quantity"
            labelText="Quantity"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e: any) => setQuantity(e.target.value)}
          />
          <Dropdown
            id="unit"
            label="Unit"
            titleText="Packaging Unit"
            items={units.filter((unit) =>
              unit.Products.some(
                (product) => product.uuid === selectedProduct?.uuid
              )
            )}
            itemToString={(item: ExtendedPackUnit) => (item ? item.name : "--")}
            selectedItem={unit}
            onChange={
              ({ selectedItem }: { selectedItem: ExtendedPackUnit | null }) =>
                setUnit(selectedItem) // Adjusted typing
            }
            placeholder="Select a unit"
          />
        </Modal>
      )}
    </div>
  );
}
