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
} from "@carbon/react";

interface ProductPrice {
  id: string;
  name: string;
  category: string;
  price: number;
}

export default function ProductPrices() {
  const [products, setProducts] = useState<ProductPrice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Mock data for product prices
    setProducts([
      { id: "P001", name: "Product 1", category: "Electronics", price: 100 },
      { id: "P002", name: "Product 2", category: "Groceries", price: 50 },
      { id: "P003", name: "Product 3", category: "Clothing", price: 75 },
    ]);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h3>Product Prices</h3>
      <TextInput
        id="search-products"
        labelText="Search Products"
        placeholder="Search by Name or Category"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: "1rem", width: "100%" }}
      />
      <TableContainer title="Product Prices">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>ID</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Category</TableHeader>
              <TableHeader>Price</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
