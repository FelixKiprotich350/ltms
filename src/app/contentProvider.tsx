"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Theme, Content } from "@carbon/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
  const { data: session, status } = useSession();
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname(); // Get current route

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/signing") {
      const callbackUrl =
        searchParams.get("callbackUrl") ?? encodeURIComponent(pathname);

      router.replace(`/signing?callbackUrl=${callbackUrl}`);
    }
    if (status === "authenticated" && pathname == "/signing") {
      const search = searchParams.get("callbackUrl") ?? "dashboard";
      const callbackUrl = search?.includes("/signing") ? "/dashboard" : search;
      router.push(callbackUrl);
    }
  }, [status, router, searchParams, pathname]);

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

  const handleProfileClick = () => {
    router.push("/myaccount/profile");
  };

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

      <Theme theme="g10">
        {session?.user && (
          <LeftPanelMenu
            isSideNavExpanded={isSideNavExpanded}
            currentUser={session?.user}
          />
        )}
        <Content>
          <Theme theme="white">
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "5px",
                maxHeight: "calc(100vh - 48px)",
                width: "100%",
              }}
            >
              {children}
            </div>
          </Theme>
        </Content>
      </Theme>
    </div>
  );
};

export default ContentProviders;
