"use client";

import React, { FC, useEffect, useState } from "react";
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
  Checkbox,
} from "@carbon/react";

interface PackagingUnit {
  id: number;
  uuid: string;
  name: string;
  countable: boolean;
}

export default function PackagingUnits() {
  const [units, setUnits] = useState<PackagingUnit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editUnit, setEditUnit] = useState<PackagingUnit | null>(null);
  const [formData, setFormData] = useState<Partial<PackagingUnit>>({
    name: "",
    countable: false,
  });

  // Fetch units
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/inventory/packunits"); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch packaging units.");
        }
        const data: PackagingUnit[] = await response.json();
        setUnits(data);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  // Open modal for adding/editing
  const openModal = (unit: PackagingUnit | null = null) => {
    setEditUnit(unit);
    setFormData(unit || { name: "", countable: false });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditUnit(null);
    setFormData({ name: "", countable: false });
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save a new or edited unit
  const saveUnit = async () => {
    try {
      const method = editUnit ? "PUT" : "POST";
      const url = editUnit
        ? `/api/inventory/packunits/${editUnit.id}`
        : "/api/inventory/packunits";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save the packaging unit.");
      }

      const savedUnit: PackagingUnit = await response.json();

      setUnits((prev) => {
        if (editUnit) {
          // Update existing unit
          return prev.map((unit) =>
            unit.id === savedUnit.id ? savedUnit : unit
          );
        } else {
          // Add new unit
          return [...prev, savedUnit];
        }
      });

      closeModal();
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the unit.");
    }
  };

  // Delete a unit
  const deleteUnit = async (id: number) => {
    try {
      const response = await fetch(`/api/inventory/packunits/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the packaging unit.");
      }

      setUnits((prev) => prev.filter((unit) => unit.id !== id));
    } catch (err: any) {
      setError(err.message || "An error occurred while deleting the unit.");
    }
  };

  if (loading) {
    return <div>Loading packaging units...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Packaging Units</h3>
      <Button onClick={() => openModal()} kind="primary">
        Add New Unit
      </Button>
      <TableContainer title="Packaging Units List">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>ID</TableHeader>
              <TableHeader>UUID</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Countable</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {units.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell>{unit.id}</TableCell>
                <TableCell>{unit.uuid}</TableCell>
                <TableCell>{unit.name}</TableCell>
                <TableCell>{unit.countable ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Button
                    kind="secondary"
                    size="sm"
                    onClick={() => openModal(unit)}
                  >
                    Edit
                  </Button>
                  <Button
                    kind="danger"
                    size="sm"
                    onClick={() => deleteUnit(unit.id)}
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
          modalHeading={
            editUnit ? "Edit Packaging Unit" : "Add New Packaging Unit"
          }
          primaryButtonText={editUnit ? "Save Changes" : "Add Unit"}
          secondaryButtonText="Cancel"
          onRequestClose={closeModal}
          onRequestSubmit={saveUnit}
        >
          <div>
            <TextInput
              id="name"
              name="name"
              labelText="Unit Name"
              value={formData.name || ""}
              onChange={handleInputChange}
              required
            />
            <Checkbox
              id="countable"
              name="countable"
              labelText="Countable"
              checked={formData.countable || false}
              onChange={handleInputChange}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
