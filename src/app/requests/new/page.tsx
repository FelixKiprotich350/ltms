"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  TextInput,
  SelectItem,
  Select,
  TextArea,
  MultiSelect,
} from "@carbon/react";

export interface Department {
  uuid: string;
  name: string;
}
export interface Catergory {
  uuid: string;
  name: string;
}
type FormData = {
  requestTitle: string;
  description: string;
  categoryUuid: string;
  recipientDepartments: string[]; // Or another appropriate type
  recipientPerson: string;
  attachments: File[];
  error: string;
  priority: string;
};
export default function InitialSetup() {
  const [formData, setFormData] = useState<FormData>({
    requestTitle: "",
    description: "",
    categoryUuid: "",
    recipientDepartments: [], // Store multiple selected departments
    recipientPerson: "",
    attachments: [],
    error: "",
    priority: "",
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<Catergory[]>([]);

  useEffect(() => {
    // Fetch Categories
    fetch("/api/requests/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));

    // Fetch Departments
    fetch("/api/recipients/departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch((err) => console.error("Error fetching departments:", err));
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

  const handleSubmit = () => {
    console.log("Form Submitted:", formData);
    alert("Request sent successfully!");
  };

  return (
    <div>
      <h3>Add New Request</h3>
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <div style={styles.leftColumn}>
            <TextInput
              id="requestTitle"
              name="requestTitle"
              labelText="Request Title"
              value={formData.requestTitle}
              onChange={handleInputChange}
              style={{ marginBottom: "1rem" }}
            />
            <TextInput
              id="requestExternalReference"
              name="requestExternalReference"
              labelText="External Reference"
              value={formData.requestTitle}
              onChange={handleInputChange}
              style={{ marginBottom: "1rem" }}
            />
            <TextArea
              id="description"
              name="description"
              labelText="Subject/Body/Description"
              value={formData.description}
              onChange={handleInputChange}
              style={styles.textArea}
            />
          </div>

          <div style={styles.rightColumn}>
            <Select
              id="priority"
              name="priority"
              labelText="Letter Priority"
              value={formData.priority}
              onChange={handleInputChange}
              style={{ marginBottom: "1rem" }}
            >
              <SelectItem text="Select a Priority" value="" key="default" />
              <SelectItem text="Low" value="Low" key="low" />
              <SelectItem text="Medium" value="Medium" key="medium" />
              <SelectItem text="High" value="High" key="high" />
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

            <MultiSelect
              id="recipientDepartments"
              label="Recipient Departments"
              titleText="Recipient Departments"
              items={departments.map((dept) => ({
                id: dept.uuid,
                label: dept.name,
              }))}
              itemToString={(item: any) => item.label}
              selectedItems={departments
                .filter((dept) =>
                  formData.recipientDepartments.includes(dept.uuid)
                )
                .map((dept) => ({ id: dept.uuid, label: dept.name }))}
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
                Attach Files (PDF or DOCX)
              </label>
              <input
                type="file"
                id="fileUpload"
                accept=".pdf, .docx"
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

const styles = {
  container: {
    display: "flex",
    FlexDirection: "column",
    maxWidth: "98%",
    margin: "4px",
  },
  formContainer: {
    display: "flex",
    gap: "2rem",
    FlexWrap: "wrap",
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
    maxHeight: "300px",
    minHeight: "200px",
    overflow: "auto",
    resize: "vertical",
    marginBottom: "1rem",
  },
  fileListContainer: {
    maxHeight: "150px",
    OverflowY: "auto",
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
