"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Theme, Content } from "@carbon/react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

import LayoutHeaderComponent from "./layoutComponents/layouHeader";
import LeftPanelMenu from "./layoutComponents/leftPanelMenu";
import {
  LtmsUser,
  OrganisationDepartment,
  Person,
  UserRole,
} from "@prisma/client";

interface ProvidersProps {
  children: ReactNode;
}
interface ExtendedLtmsUser extends LtmsUser {
  UserRole: UserRole;
  OrganisationDepartment: OrganisationDepartment;
  Person: Person;
}
const ContentProviders: React.FC<ProvidersProps> = ({ children }) => {
  const { data: session, status, update } = useSession();
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("------------Unauthenticated");
      const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
      console.log("------------Unauthenticated", callbackUrl);

      // const callbackUrl = encodeURIComponent(window.location.pathname);
      router.replace(`/signing?callbackUrl=${callbackUrl}`);
    }
  }, [status]);
  useEffect(() => {
    const storedState = localStorage.getItem("sideNavExpanded");
    if (storedState !== null) {
      setIsSideNavExpanded(storedState === "true");
    }
  }, []);

  const toggleSideNav = () => {
    setIsSideNavExpanded((prev) => {
      const newState = !prev;
      localStorage.setItem("sideNavExpanded", newState.toString());
      return newState;
    });
  };

  const logInPage = () => router.push("/signing");

  const logOutUser = () => {
    signOut({ callbackUrl: "/signing" });
  };

  const handleProfileClick = () => {};

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
      }}
    >
      <LayoutHeaderComponent
        currentUser={session?.user as ExtendedLtmsUser}
        isSideNavExpanded={isSideNavExpanded}
        toggleSideNav={toggleSideNav}
        logInPage={logInPage}
        logOutUser={logOutUser}
        handleProfileClick={handleProfileClick}
      />
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "auto",
          // width: "100%",
        }}
      >
        <Theme theme="g10">
          {session?.user && (
            <LeftPanelMenu
              isSideNavExpanded={isSideNavExpanded}
              currentUser={session?.user}
            />
          )}

          <Content
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "5px",
              height: "calc(100vh - 48px)",
              width: "100%",
            }}
          >
            <Theme theme="white">{children}</Theme>
          </Content>
        </Theme>
      </div>
    </div>
  );
};

export default ContentProviders;
