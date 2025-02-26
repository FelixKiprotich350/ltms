"use client";

import React, { FC, useState, useEffect } from "react";
import { TextInput, InlineLoading } from "@carbon/react";
import { LtmsUser, OrganisationDepartment } from "@prisma/client";
import "@/styles/chatPageLayout.css";

interface LetterRequestModel {
  uuid: string;
  externalReference: string | null;
  subject: string;
  body: string;
  confidentiality: string;
  letterCategoryUuid: string;
  senderUserUuid: string;
  senderDepartmentUuid: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  SenderDepartment: OrganisationDepartment;
  SenderUser: LtmsUser;
}

export default function OutgoingLetterRequests() {
  const [letters, setLetters] = useState<LetterRequestModel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] =
    useState<LetterRequestModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchRequests = async () => {
    try {
      const url = new URL(
        "/api/letterrequests/outgoing",
        window.location.origin
      );
      url.searchParams.append("withrelations", "true"); // Add the parameter

      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        setLetters(data);
      } else {
        console.error("Failed to fetch recipients");
      }
    } catch (error) {
      console.error("Error fetching recipients:", error);
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

  const filteredRequests = letters.filter(
    (item) =>
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="letterPageContainer">
      {/* Left Column - List of Requests */}
      <div className="left40Column">
        <p className="pageTitleHeader">Outgoing Letters</p>
        <TextInput
          id="search-letters"
          labelText=""
          placeholder="Search by Subject or Body"
          value={searchTerm}
          onChange={handleSearchChange}
          className="customSearchTextInput"
        />

        {isLoading ? (
          <InlineLoading description="Loading Requests..." />
        ) : (
          <div className="letterListContainer">
            {filteredRequests.map((item) => (
              <div
                key={item.uuid}
                onClick={() => setSelectedRequest(item)}
                className={`letterListItemContainer ${
                  selectedRequest?.uuid == item.uuid ? "selected" : ""
                }`}
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
      <div className="right60Column">
        {selectedRequest ? (
          <div>
            <p className="letterSubjectHeading">{selectedRequest.subject}</p>
            {/* 
                <p>
                  <strong>Subject:</strong> {selectedRequest.subject}
                </p> */}
            <p>
              <strong>Sender:</strong> {selectedRequest.SenderDepartment?.name}(
              {selectedRequest.SenderUser?.email})
            </p>
            <p>
              <strong>Status:</strong> {selectedRequest.status}
            </p>
            <p>
              <strong>Created At:</strong>
              {new Date(selectedRequest.createdAt).toLocaleString()}
            </p>
            <div className="letterBodyContainer">
              <p className="botyText">{selectedRequest.body}</p>
              <div>
                <hr />
                Attachments
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ textAlign: "center", opacity: "0.5" }}>
              Select a Letter to view more details
            </p>

            <div className="noLetterContainer">
              <img
                src="/openletter.jpg"
                alt="Open Letter"
                className="imageIllustration"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
