"use client";

import React, { ReactNode, useEffect, useState } from "react";
import {
  Switcher,
  UserAvatar,
  Notification,
  Logout,
} from "@carbon/icons-react";
import {
  Theme,
  SideNav,
  SideNavItems,
  SideNavMenu,
  SideNavMenuItem,
  SideNavLink,
} from "@carbon/react";
import { useRouter } from "next/navigation";

interface LeftPanelMenuProps {
  children: ReactNode; // Defines that the `children` prop can accept any valid React node
}

const LeftPanelMenu: React.FC<LeftPanelMenuProps> = ({  }) => {
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const toggleSideNav = () => {
    setIsSideNavExpanded((prev) => !prev);
  };

  // Fetch user details if the user is authenticated
  const fetchUserDetails = async () => {
    try {
      const response = await fetch("/api/token"); // API endpoint to get user details
      if (response.ok) {
        const data = await response.json();
        setUser(data); // Store user details in state
      } else {
        setUser(null); // Reset user state if not authenticated
      }
    } catch (error) {
      setError("Failed to fetch user details");
    }
  };

  

  // Fetch user details when the component mounts (or when logged-in state changes)
  useEffect(() => {
    fetchUserDetails(); // Fetch user details
  }, []);
  

  return (
    <div>
      <Theme theme="g10">
        {user && (
          <SideNav
            isFixedNav={true}
            // defaultExpanded={false}
            expanded={isSideNavExpanded}
            // isChildOfHeader={true}
            aria-label="Side navigation"
          >
            <SideNavItems>
              <SideNavLink href="/dashboard">Dashboard</SideNavLink>
              <SideNavMenu title="Data Sources">
                <SideNavMenuItem href="/sources/dataentry">
                  Data Entry
                </SideNavMenuItem>
                <SideNavMenuItem href="/sources/csv">CSV</SideNavMenuItem>
                <SideNavMenuItem href="/sources/database">
                  Database
                </SideNavMenuItem>
                <SideNavMenuItem href="/sources/api">
                  API Endpoint
                </SideNavMenuItem>
              </SideNavMenu>{" "}
              <SideNavLink href="/datafetch">Data Fetch</SideNavLink>
              <SideNavLink href="/configurations">Configurations</SideNavLink>
              <SideNavLink href="/mappings">Mappings</SideNavLink>
              <SideNavLink href="/reports">Reports</SideNavLink>
              <SideNavLink href="/myprojects">My Projects</SideNavLink>
            </SideNavItems>
          </SideNav>
        )}
      </Theme>
    </div>
  );
};

export default LeftPanelMenu;
