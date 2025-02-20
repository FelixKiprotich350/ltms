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
  Header,
  SkipToContent,
  HeaderMenuButton,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderName,
} from "@carbon/react";
import { useRouter } from "next/navigation";
import exp from "constants";
import { LtmsUser } from "@prisma/client";

interface LeftPanelMenuProps {
  currentUser: any | null;
  isSideNavExpanded: boolean;
  toggleSideNav: () => void;
  logOutUser: () => void;
  logInPage: () => void;
  handleMenuToggle: () => void;
}

const LayoutHeaderComponent: React.FC<LeftPanelMenuProps> = ({
  currentUser,
  isSideNavExpanded,
  toggleSideNav,
  handleMenuToggle,
  logInPage,
  logOutUser,
}) => {
  return (
    <Theme theme="g100">
      <Header aria-label="Letter Trail System">
        <SkipToContent />
        {currentUser && (
          <HeaderMenuButton
            isActive={isSideNavExpanded}
            aria-expanded={isSideNavExpanded}
            aria-label={isSideNavExpanded ? "Close menu" : "Open menu"}
            onClick={toggleSideNav}
            isCollapsible={true}
          />
        )}
        <HeaderName href="/" prefix="" size="lg">
          Tagile Solutions
        </HeaderName>
        <h5 style={{ marginLeft: "60px" }}>
          The County Government of Uasingishu
        </h5>
        {currentUser != null && (
          <HeaderGlobalBar>
            <HeaderGlobalAction
              aria-label="Notifications"
              tooltipAlignment="center"
              className="action-icons"
            >
              <Notification size={20} />
            </HeaderGlobalAction>

            <HeaderGlobalAction
              aria-label="Logout"
              tooltipAlignment="center"
              className="action-icons"
              onClick={() => logOutUser()}
            >
              <Logout size={20} aria-label="Logout" />
            </HeaderGlobalAction>

            <HeaderGlobalAction
              aria-label="App Switcher"
              tooltipAlignment="end"
              onClick={handleMenuToggle}
            >
              <UserAvatar size={20} initials="JD" />
            </HeaderGlobalAction>
          </HeaderGlobalBar>
        )}

        {currentUser == null && (
          <HeaderGlobalBar>
            <HeaderGlobalAction
              aria-label="Login"
              tooltipAlignment="center"
              className="action-icons"
              onClick={() => logInPage()}
            >
              Login
            </HeaderGlobalAction>
          </HeaderGlobalBar>
        )}
      </Header>
    </Theme>
  );
};
export default LayoutHeaderComponent;
