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
  Checkbox,
  TextInput,
  InlineLoading,
} from "@carbon/react";
import { OrganisationDepartment, Person } from "@prisma/client";

interface UserModel {
  uuid: string;
  Person?: Person | null;
  Department?: OrganisationDepartment | null;
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

export default function DepartmentPersons() {
  const [recipients, setRecipients] = useState<RecipientModel[]>([]);
  const [allusers, setAllUsers] = useState<UserModel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/users/all");
        if (response.ok) {
          const data = await response.json();
          setAllUsers(data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipients();
    fetchUsers();
  }, []);

  const handleCheckBoxChange = async (
    userItem: UserModel,
    checked: boolean
  ) => {
    try {
      const isRecipient = recipients.some(
        (r) => r.userPersonUuid === userItem.uuid
      );
      const editingRecipient = recipients.find(
        (item) => item.userPersonUuid === userItem.uuid
      );
      const editurl = editingRecipient
        ? `/api/recipients/master/${editingRecipient.uuid}`
        : "/api/recipients/master";

      const response = await fetch(editurl, {
        method: isRecipient ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPersonUuid: userItem.uuid,
          departmentUuid: userItem.Department?.uuid,
          recipientType: "Person",
          isActive: checked,
        }),
      });

      if (response.ok) {
        const updatedRecipients = await fetch("/api/recipients/master");
        if (updatedRecipients.ok) {
          const data = await updatedRecipients.json();
          setRecipients(
            data.filter(
              (item: RecipientModel) => item.recipientType === "Person"
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = allusers.filter(
    (person) =>
      person.Person?.firstName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      person.Person?.lastName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      person.Person?.gender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.Department?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h3>Department Persons</h3>
      <TextInput
        id="search-persons"
        labelText="Search Persons"
        placeholder="Search by Name or Department"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: "1rem", width: "100%" }}
      />

      {isLoading ? (
        <InlineLoading description="Loading persons..." />
      ) : (
        <TableContainer title="Department Persons">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>First Name</TableHeader>
                <TableHeader>Last Name</TableHeader>
                <TableHeader>Department</TableHeader>
                <TableHeader>Recipient</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => {
                const Recipient = recipients.find(
                  (r) => r.userPersonUuid === user.uuid
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
                  <TableRow key={user.uuid}>
                    <TableCell>{user.Person?.firstName}</TableCell>
                    <TableCell>{user.Person?.lastName}</TableCell>
                    <TableCell>{user.Department?.name}</TableCell>
                    <TableCell>
                      <Checkbox
                        labelText=""
                        id={`checkbox-${user.uuid}`}
                        checked={isRecipient}
                        onChange={(e: any) =>
                          handleCheckBoxChange(user, e.target.checked)
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
