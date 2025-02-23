"use client";

import React, { useState, useEffect, CSSProperties } from "react";
import {
  Button,
  TextInput,
  SelectItem,
  Select,
  TextArea,
  MultiSelect,
  FilterableMultiSelect,
} from "@carbon/react";
import { OrganisationDepartment, RecipientsMaster } from "@prisma/client";
import { LetterSenderRecipientType } from "lib/constants";

//65535
export interface RecipientDepartmentModel {
  uuid: string;
  recipientType: string;
  isActive: Boolean;
  departmentUuid: string;
  DepartmentRecipient: OrganisationDepartment;
}
export interface LetterCategory {
  uuid: string;
  name: string;
  isretired: boolean;
}
type FormData = {
  subject: string;
  letterbody: string;
  categoryUuid: string;
  senderType: string;
  recipientDepartments: string[]; // Or another appropriate type
  attachments: File[];
  externalReference: string;
  confidentiality: string;
  error: string;
};
export default function InitialSetup() {
  const [formData, setFormData] = useState<FormData>({
    subject: "",
    letterbody: "",
    categoryUuid: "",
    senderType: "",
    recipientDepartments: [], // Store multiple selected departments
    attachments: [],
    externalReference: "",
    confidentiality: "",
    error: "",
  });

  const [departments, setDepartments] = useState<RecipientDepartmentModel[]>(
    []
  );
  const [categories, setCategories] = useState<LetterCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [textCount, setTextCount] = useState(0);

  const fetchRecipients = async () => {
    setIsLoading(true);
    try {
      const url = new URL("/api/recipients/master", window.location.origin);
      url.searchParams.append("withrelations", "true");

      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        setDepartments(
          (data as Array<RecipientDepartmentModel>).filter(
            (item) =>
              item.recipientType == LetterSenderRecipientType.DEPARTMENT &&
              item.isActive == true
          )
        );
      } else {
        console.error("Failed to fetch recipients");
      }
    } catch (error) {
      console.error("Error fetching recipients:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    // Fetch Categories
    fetch("/api/admin/lettercategories")
      .then((res) => res.json())
      .then((data) =>
        setCategories(
          (data as Array<LetterCategory>).filter(
            (category) => category.isretired == false
          )
        )
      )
      .catch((err) => console.error("Error fetching categories:", err));

    fetchRecipients();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setTextCount(value.length);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const validFiles = Array.from(files).filter((file) =>
        allowedTypes.includes(file.type)
      );

      if (validFiles.length !== files.length) {
        setFormData((prev) => ({
          ...prev,
          error: "Only PDF and DOCX files are allowed.",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...validFiles],
        error: "",
      }));
    }
  };

  const handleRemoveFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handlePreviewFile = (file: File) => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
  };

  const handleSaveDraft = () => {
    console.log("Saved as Draft:", formData);
    alert("Request saved as draft.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("subject", formData.subject);
    formDataToSend.append("letterbody", formData.letterbody);
    formDataToSend.append("categoryUuid", formData.categoryUuid);
    formDataToSend.append("senderType", formData.senderType);
    formDataToSend.append("confidentiality", formData.confidentiality);
    formDataToSend.append("externalReference", formData.externalReference);
    // Append multiple selected departments
    formData.recipientDepartments.forEach((dept) => {
      formDataToSend.append("recipientDepartments", dept);
    });

    // Append attachments
    formData.attachments.forEach((file) => {
      formDataToSend.append("attachments[]", file);
    });

    try {
      const response = await fetch("/api/letterrequests/new", {
        method: "POST",
        body: formDataToSend,
        headers: {
          // 'Content-Type': 'multipart/form-data' is NOT needed; the browser sets it automatically
          Authorization: `Bearer YOUR_ACCESS_TOKEN`, // If authentication is required
        },
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <h3>Add New Request</h3>
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <div style={styles.leftColumn}>
            <TextInput
              id="subject"
              name="subject"
              labelText="Request Subject"
              value={formData.subject}
              onChange={handleInputChange}
              style={{ marginBottom: "1rem" }}
            />
            <TextInput
              id="externalReference"
              name="externalReference"
              labelText="External Reference"
              value={formData.externalReference}
              onChange={handleInputChange}
              style={{ marginBottom: "1rem" }}
            />
            <Select
              id="senderType"
              name="senderType"
              labelText="Sender Type"
              value={formData.senderType}
              onChange={handleInputChange}
              style={{ marginBottom: "1rem" }}
            >
              <SelectItem text="Select Sender Type" value="" key="default" />
              <SelectItem
                text="Department"
                value="DEPARTMENT"
                key="Department"
              />
              <SelectItem text="Person" value="PERSON" key="Person" />
            </Select>
            <TextArea
              id="letterbody"
              name="letterbody"
              labelText="Body/Description"
              value={formData.letterbody}
              onChange={handleInputChange}
              style={styles.textArea}
            />
            <label>{`(${textCount}/5000)`}</label>
          </div>

          <div style={styles.rightColumn}>
            <Select
              id="confidentiality"
              name="confidentiality"
              labelText="Letter Confidentiality"
              value={formData.confidentiality}
              onChange={handleInputChange}
              style={{ marginBottom: "1rem" }}
            >
              <SelectItem
                text="Select a Confidentiality"
                value=""
                key="default"
              />
              <SelectItem text="Standard" value="standard" key="standard" />
              <SelectItem
                text="Confidential"
                value="confidential"
                key="confidential"
              />
            </Select>
            <Select
              id="categoryUuid"
              name="categoryUuid"
              labelText="Recipient Category"
              value={formData.categoryUuid}
              onChange={handleInputChange}
              style={{ marginBottom: "1rem" }}
            >
              <SelectItem text="Select a Category" value="" key="default" />
              {categories.map((category) => (
                <SelectItem
                  key={category.uuid}
                  text={category.name}
                  value={category.uuid}
                />
              ))}
            </Select>

            <FilterableMultiSelect
              id="recipientDepartments"
              label="Recipient Departments"
              titleText="Recipient Departments"
              items={departments.map((dept) => ({
                id: dept.uuid,
                label: dept.DepartmentRecipient?.name,
              }))}
              itemToString={(item: any) => item.label}
              selectedItems={departments
                .filter((dept) =>
                  formData.recipientDepartments.includes(dept.uuid)
                )
                .map((dept) => ({
                  id: dept.uuid,
                  label: dept.DepartmentRecipient?.name,
                }))}
              onChange={(event: any) =>
                setFormData((prev) => ({
                  ...prev,
                  recipientDepartments: event.selectedItems.map(
                    (item: any) => item.id
                  ),
                }))
              }
            />

            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="fileUpload"
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                Add File Attachments
              </label>
              <input
                type="file"
                id="fileUpload"
                accept=".pdf" //".pdf, .docx"
                multiple
                onChange={handleFileUpload}
              />
              {formData.error && (
                <p style={{ color: "red", marginTop: "0.5rem" }}>
                  {formData.error}
                </p>
              )}

              {formData.attachments.length > 0 && (
                <div style={styles.fileListContainer}>
                  <ul style={styles.fileList}>
                    {formData.attachments.map((file, index) => (
                      <li key={index} style={styles.fileItem}>
                        {file.name}
                        <div>
                          <Button
                            kind="ghost"
                            size="sm"
                            onClick={() => handlePreviewFile(file)}
                          >
                            Preview
                          </Button>
                          <Button
                            kind="danger--tertiary"
                            size="sm"
                            onClick={() => handleRemoveFile(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div style={styles.buttonContainer}>
              <Button kind="danger--primary" onClick={handleSaveDraft}>
                Save as Draft
              </Button>
              <Button kind="success" onClick={handleSubmit}>
                Send Request
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "98%",
    margin: "4px",
  },
  formContainer: {
    display: "flex",
    gap: "2rem",
    flexWrap: "wrap",
    width: "100%", // Added width 100%
  },
  leftColumn: {
    flex: 1,
    minWidth: "300px",
  },
  rightColumn: {
    flex: 1,
    minWidth: "300px",
  },
  textArea: {
    maxHeight: "230px",
    minHeight: "200px",
    overflow: "auto",
    resize: "vertical",
    marginBottom: "1rem",
  },
  fileListContainer: {
    maxHeight: "150px",
    overflowY: "auto",
    border: "1px solid #ddd",
    padding: "0.5rem",
    borderRadius: "5px",
    marginTop: "0.5rem",
  },
  fileList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  fileItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  buttonContainer: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
  },
};
