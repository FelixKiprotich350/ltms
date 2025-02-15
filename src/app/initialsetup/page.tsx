"use client";

import React, { FC, useState } from "react";
import { Button, NumberInput, TextInput } from "@carbon/react";

export default function InitialSetup() {
  const [clientname, setClientName] = useState<string>("");
  const [salestax, setSalesTax] = useState<Number>(1);

  const handletaxchange = (newtax: string) => {
    try {
      const tax = Number(newtax);
      setSalesTax(tax);
    } catch {}
  };
  const handleclientnamechange = (newname: string) => {
    try {
      if (newname == "") {
        return;
      }
      setClientName(newname);
    } catch {}
  };
  return (
    <div>
      <h3>Initial Setup Configuration</h3>

      <TextInput
        id="clientname"
        labelText="Receipt Header Name"
        value={clientname}
        onChange={(e: any) => handleclientnamechange(e?.target?.value)}
        style={{ marginBottom: "1rem" }}
      />
      <NumberInput
        id="salestax"
        label="Sales Tax"
        value={salestax}
        onChange={(e: any) => handletaxchange(e?.target?.value)}
        style={{ marginBottom: "1rem" }}
        min="1"
      />
      <Button kind="primary" onClick={() => {}}>
        Save Configuration
      </Button>
    </div>
  );
}
