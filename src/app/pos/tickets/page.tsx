"use client";
import { FC, useState, useEffect } from "react";
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
import { basketSale } from "@prisma/client";

// Pending Tickets Component
export default function PendingTickets() {
  const [tickets, setTickets] = useState<basketSale[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/pos/newsale/holdsale"); // Replace with your API endpoint
        if (!response.ok) throw new Error("Failed to fetch tickets");
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.description.includes(searchTerm) ||
      ticket.groupCode.includes(searchTerm)
  );

  return (
    <div>
      <TextInput
        id="search-tickets"
        labelText="Search Tickets"
        placeholder="Search by ID or Status"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: "1rem", width: "100%" }}
      />
      <TableContainer title="Tickets on Hold">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>ID</TableHeader>
              <TableHeader>Code</TableHeader>
              <TableHeader>Description</TableHeader>
              <TableHeader>Created At</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.groupCode}</TableCell>
                <TableCell>{ticket.description}</TableCell>
                <TableCell>
                  {new Date(ticket.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
