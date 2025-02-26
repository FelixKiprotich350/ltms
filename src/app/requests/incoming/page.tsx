"use client";

import React, { useState, useEffect } from "react";
import {
  TextInput,
  FileUploader,
  InlineLoading,
  IconButton,
  SelectItem,
  Button,
  TextArea,
} from "@carbon/react";
import {
  LetterRequest,
  LtmsUser,
  OrganisationDepartment,
} from "@prisma/client";
import { useNotification } from "app/layoutComponents/notificationProvider";
import { LeterRecipientReceivedStatus } from "lib/constants";
import { CloseLarge, SendFilled } from "@carbon/icons-react";
import "@/styles/chatPageLayout.css";

interface LetterRequestModel extends LetterRequest {
  SenderDepartment: OrganisationDepartment;
  SenderUser: LtmsUser;
  recipientLetterReceivedstatus: string;
}

export default function IncomingLetterRequests() {
  const { showNotification } = useNotification();
  const [letters, setLetters] = useState<LetterRequestModel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] =
    useState<LetterRequestModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isReplyLetterMode, setIsReplyLetterMode] = useState(false);

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
  const handleReplyLetter = async () => {
    if (!selectedRequest) return;
    setIsReplyLetterMode(true);
  };
  const handleCancelReplyLetter = async () => {
    setIsReplyLetterMode(false);
    setAttachments([]);
    setReplyMessage("");
  };
  const handleReplyMessageInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { value } = e.target;
    setReplyMessage(value);
  };
  const handleSubmitReplyLetter = async () => {
    if (!selectedRequest) return;

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("replyMessage", replyMessage);
      // Append multiple attachments
      attachments.forEach((item) => {
        formDataToSend.append("attachments[]", item);
      });
      const response = await fetch(
        `/api/letterrequests/reply/${selectedRequest.uuid}`,
        {
          method: "POST",
          // headers: {
          //   "Content-Type": "application/json",
          // },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        showNotification({
          title: "Operation Completed",
          subtitle: "Letter Replied Successfully",
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
    <div className="letterPageContainer">
      {/* Left Column - List of Requests */}
      <div className="left40Column">
        <p className="pageTitleHeader">Incoming Letters</p>
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
                      color:
                        item.recipientLetterReceivedstatus === "PENDING"
                          ? "darkred"
                          : "green",
                      fontSize: "0.8rem",
                    }}
                  >
                    {item.recipientLetterReceivedstatus ===
                    LeterRecipientReceivedStatus.PENDING
                      ? "Pending"
                      : "Received"}
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
          <div className="letterContainer">
            <div className="letterHeader">
              <p className="letterSubjectHeading">{selectedRequest.subject}</p>
              <p>
                <strong>Sender:</strong>
                {selectedRequest.SenderDepartment?.name}(
                {selectedRequest.SenderUser?.email})
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedRequest.recipientLetterReceivedstatus}
              </p>
              <p>
                <strong>Created At:</strong>
                {new Date(selectedRequest.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="letterBodyContainer">
              <p className="bodyText">{selectedRequest.body}</p>
              <div>
                <hr />
                Attachments
              </div>
            </div>

            <div className="letterFooter">
              {selectedRequest.recipientLetterReceivedstatus ===
              LeterRecipientReceivedStatus.PENDING ? (
                <Button
                  kind="ghost"
                  size="sm"
                  onClick={handleReceiveLetter}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <InlineLoading description="Receiving..." />
                  ) : (
                    "Receive Letter"
                  )}
                </Button>
              ) : !isReplyLetterMode ? (
                <Button kind="tertiary" size="md" onClick={handleReplyLetter}>
                  Reply
                </Button>
              ) : null}

              {isReplyLetterMode && (
                <div className="replyContainer">
                  <TextArea
                    id="reply-message"
                    name="reply-message"
                    labelText="Body/Description"
                    maxLength={2000}
                    value={replyMessage}
                    onChange={handleReplyMessageInputChange}
                    className="replyTextArea"
                  />
                  <label>{`(${replyMessage.length}/2000)`}</label>
                  <FileUploader
                    // labelTitle="Attachments"
                    buttonLabel="Add files"
                    multiple={true}
                    size="sm"
                    filenameStatus="edit"
                    buttonKind="ghost"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setAttachments(Array.from(event.target.files || []))
                    }
                  />
                  <div className="replyActions">
                    <IconButton
                      label="Cancel"
                      kind="ghost"
                      size="md"
                      onClick={handleCancelReplyLetter}
                    >
                      <CloseLarge size={16} />
                    </IconButton>
                    <IconButton
                      label="Send"
                      kind="ghost"
                      size="md"
                      onClick={handleSubmitReplyLetter}
                    >
                      <SendFilled size={16} />
                    </IconButton>
                  </div>
                </div>
              )}
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
