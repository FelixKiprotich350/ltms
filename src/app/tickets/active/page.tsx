"use client";

import React, { FC, useState, useEffect } from "react";
import { TextInput, InlineLoading } from "@carbon/react";
import { LetterRequest, LetterTicket } from "@prisma/client";
import "@/styles/chatPageLayout.css";

interface LetterTicketModel extends LetterTicket {
  Letter: LetterRequest;
  Thread?: LetterRequest[];
}

export default function ActiveLetterTickets() {
  const [tickets, setTickets] = useState<LetterTicketModel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] =
    useState<LetterTicketModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchRequests = async () => {
    try {
      const url = new URL("/api/lettertickets/active", window.location.origin);
      url.searchParams.append("withrelations", "true"); // Add the parameter

      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      } else {
        console.error("Failed to fetch tickets");
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
    }
  };
  // Fetch departments from the backend
  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const handleDivClick = async (item: LetterTicketModel) => {
    try {
      const response = await fetch(`/api/lettertickets/thread/${item.uuid}`);
      if (!response.ok) {
        console.error("Failed to fetch ticket thread");
        return;
      }
      const data = await response.json();
      const ticket = item;
      ticket.Thread = data?.RootChildLetters as LetterRequest[];
      ticket.Thread.push(item.Letter);
      setSelectedRequest(item);

      console.log("Updated Request:", selectedRequest);
    } catch (error) {
      console.error("Error fetching ticket thread:", error);
    }
  };

  const filteredTickets = tickets.filter((item) =>
    item.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="letterPageContainer"
     >
      {/* Left Column - List of Requests */}
      <div
        className="left40Column"
      >
        <p
          style={{
            textAlign: "left",
            fontWeight: "bold",
            fontSize: "1rem",
            marginBottom: "4px",
          }}
        >
          Active Tickets
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
            {filteredTickets.map((item) => (
              <div
                key={item.uuid}
                onClick={(e) => handleDivClick(item)}
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
                <h6 style={{ margin: "0 0 2px" }}>{item.Letter?.subject}</h6>

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
                    <strong>T No:</strong> {item.ticketNumber}
                  </p>
                  <p style={{ flex: 2, margin: "0", fontSize: "0.8rem" }}>
                    <strong>Date Created:</strong>
                    {item.createdAt.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Column - Details Panel */}
      <div className="right60Column">
        {selectedRequest ? (
          <div>
            <p style={{ fontSize: "1.5rem" }}>
              <strong>Subject: {selectedRequest.Letter?.subject}</strong>
            </p>

            <p>
              <strong>Ticket No:</strong>
              {selectedRequest.ticketNumber?.toUpperCase()}
            </p>
            <p>
              <strong>Created At:</strong>
              {new Date(selectedRequest.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Conversation:</strong> 
            </p>
            <div className="threadContainer">
              {selectedRequest.Thread?.map((item: LetterRequest) => (
                <div className="threadListItemContainer">{item.subject}</div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p style={{ textAlign: "center", opacity: "0.5" }}>
              Select a Ticket to view more details
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
