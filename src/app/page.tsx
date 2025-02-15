"use client";

import Image from "next/image";
import { Button } from "@carbon/react";
import Link from "next/link";

export default function Home() {
  return (
    <div
      className="bg-gray-100 text-gray-900"
      style={{
        display: "block",
        height: "92vh",
        textAlign: "left",
        backgroundImage: "url('/pos-1.jpeg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: 0.5 }}
      ></div>
      {/* Adjust opacity here */}
      {/* Content Section */}
      <div
        className="relative z-10 text-center p-10 bg-white shadow-lg rounded-xl max-w-lg flex flex-col items-center justify-center"
        style={{ marginLeft: "32px" }}
      >
        <br />
        <br />
        <br /> 
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Button kind="primary" size="lg" >
          <b style={{ fontWeight: "bold" }}>Get Started</b>
        </Button> 
      </div>
    </div>
  );
}
