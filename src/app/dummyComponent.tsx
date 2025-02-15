"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { Fade, Logout } from "@carbon/icons-react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { Button } from "@carbon/react";

interface TestProps {}
const DummyComponent: FC<any> = ({}) => {
  const router = useRouter();

  return (
    <div>
      <h1>This is a dummy Component</h1>
      <Button>Click Me!</Button>
        </div>
  );
};

export default DummyComponent;
