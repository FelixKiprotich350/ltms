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
  TextInput,
  InlineLoading,
} from "@carbon/react";
import {
  LetterRequest,
  LtmsUser,
  OrganisationDepartment,
} from "@prisma/client";
import "./page.css";
import { Button } from "@carbon/react";
import { useNotification } from "app/layoutComponents/notificationProvider";

interface LetterRequestModel extends LetterRequest {
  SenderDepartment: OrganisationDepartment;
  SenderUser: LtmsUser;
}

export default function IncomingLetterRequests() {
  const { showNotification } = useNotification();
  const [letters, setLetters] = useState<LetterRequestModel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] =
    useState<LetterRequestModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const url = new URL(
          "/api/letterrequests/incoming",
          window.location.origin
        );
        url.searchParams.append("withrelations", "true");

        const response = await fetch(url.toString());
        if (response.ok) {
          const data = await response.json();
          setLetters(data);
        } else {
          console.error("Failed to fetch recipients");
        }
      } catch (error) {
        console.error("Error fetching recipients:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredRequests = letters.filter(
    (request) =>
      request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.body.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleReceiveLetter = async () => {
    if (!selectedRequest) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/letterrequests/receive/${selectedRequest.uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        showNotification({
          title: "Operation Completed",
          subtitle: "Letter received Successfully",
          kind: "success",
          timeout: 5000,
        });
        // Update UI by changing the status of the received letter
        setLetters((prevLetters) =>
          prevLetters.map((letter) =>
            letter.uuid === selectedRequest.uuid
              ? { ...letter, status: "RECEIVED" }
              : letter
          )
        );
        setSelectedRequest((prev) =>
          prev ? { ...prev, status: "RECEIVED" } : null
        );
      } else {
        console.error("Failed to receive letter");
      }
    } catch (error) {
      console.error("Error receiving letter:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        height: "calc(100vh - 60px)",
        padding: "8px",
        overflow: "hidden",
        borderStyle: "solid",
        borderWidth: "1px",
        borderRadius: "4px",
        borderColor: "lightgray",
      }}
    >
      {/* Left Column - List of Requests */}
      <div
        style={{
          flex: "0 0 40%",
          borderRight: "1px solid #ddd",
          paddingRight: "1rem",
          overflow: "auto",
        }}
      >
        <p
          style={{
            textAlign: "left",
            fontWeight: "bold",
            fontSize: "1rem",
            marginBottom: "4px",
          }}
        >
          Incoming Letters
        </p>
        <TextInput
          id="search-letters"
          labelText=""
          placeholder="Search by Subject or Body"
          value={searchTerm}
          onChange={handleSearchChange}
          className="custom-text-input"
        />

        {isLoading ? (
          <InlineLoading description="Loading Requests..." />
        ) : (
          <div
            style={{
              maxHeight: "calc(100vh - 160px)",
              overflowY: "auto",
              marginTop: "8px",
            }}
          >
            {filteredRequests.map((item) => (
              <div
                key={item.uuid}
                onClick={() => setSelectedRequest(item)}
                style={{
                  border: "1px solid #ddd",
                  padding: "4px",
                  marginBottom: "0.5rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  backgroundColor:
                    selectedRequest?.uuid === item.uuid ? "#f3f3f3" : "white",
                  transition: "background 0.2s",
                }}
              >
                {/* First Line - Subject */}
                <h6 style={{ margin: "0 0 2px" }}>{item.subject}</h6>

                {/* Second Line - 3 Columns */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "5px",
                    color: "#555",
                  }}
                >
                  <p style={{ flex: 2, margin: "0", fontSize: "0.8rem" }}>
                    <strong>Sender:</strong> {item.SenderDepartment?.name}
                  </p>
                  <p
                    style={{
                      flex: 1,
                      margin: "0",
                      textAlign: "center",
                      fontSize: "0.8rem",
                    }}
                  >
                    <strong>Date:</strong>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                  <p
                    style={{
                      flex: 1,
                      margin: "0",
                      textAlign: "right",
                      fontWeight: "bold",
                      color: item.status === "PENDING" ? "darkred" : "green",
                      fontSize: "0.8rem",
                    }}
                  >
                    {item.status === "PENDING" ? "Pending" : "Received"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Column - Details Panel */}
      <div style={{ flex: "0 0 60%", paddingLeft: "1rem", overflow: "auto" }}>
        {selectedRequest ? (
          <div>
            <p style={{ fontSize: "1.5rem" }}>
              <strong>Subject: {selectedRequest.subject}</strong>
            </p>
            {/* 
            <p>
              <strong>Subject:</strong> {selectedRequest.subject}
            </p> */}
            <p>
              <strong>Sender:</strong> {selectedRequest.SenderDepartment?.name}
              ({selectedRequest.SenderUser?.email})
            </p>

            <p>
              <strong>Confidentiality:</strong>
              {selectedRequest.confidentiality.toUpperCase()}
            </p>
            <p>
              <strong>Status:</strong> {selectedRequest.status}
            </p>
            <p>
              <strong>Created At:</strong>
              {new Date(selectedRequest.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Body:</strong> {selectedRequest.body}
            </p>
            <div>
              <Button
                kind="primary"
                size="md"
                onClick={handleReceiveLetter}
                disabled={isLoading}
              >
                {isLoading ? (
                  <InlineLoading description="Receiving..." />
                ) : (
                  "Receive Letter"
                )}
              </Button>
              <Button
                kind="none"
                size="md"
                onClick={handleReceiveLetter}
                disabled={isLoading}
              >
                {isLoading ? (
                  <InlineLoading description="Receiving..." />
                ) : (
                  "Reply"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ textAlign: "center", opacity: "0.5" }}>
              Select a Letter to view more details
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "calc(100vh - 200px)",
              }}
            >
              <img
                src="/openletter.jpg"
                alt="Open Letter"
                style={{
                  width: "300px",
                  marginTop: "20px",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
