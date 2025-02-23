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
import {
  LtmsUser,
  OrganisationDepartment,
  Person,
  UserRole,
} from "@prisma/client";

interface ExtendedLtmsUser extends LtmsUser {
  UserRole: UserRole;
  OrganisationDepartment: OrganisationDepartment;
  Person: Person;
}
interface LeftPanelMenuProps {
  currentUser: ExtendedLtmsUser | null;
  isSideNavExpanded: boolean;
  toggleSideNav: () => void;
  logOutUser: () => void;
  logInPage: () => void;
  handleProfileClick: () => void;
}

const LayoutHeaderComponent: React.FC<LeftPanelMenuProps> = ({
  currentUser,
  isSideNavExpanded,
  toggleSideNav,
  handleProfileClick,
  logInPage,
  logOutUser,
}) => {
  const getInitials = (name: string) => {
    if (name === null || name == undefined || name.trim() === "") return "N/A";
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

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
        {currentUser ? (
          <>
            <HeaderGlobalBar>
              <HeaderGlobalAction
                aria-label={"Welcome " + currentUser.Person?.firstName}
                tooltipAlignment="center"
              >
                <label>{`${currentUser.Person?.firstName} (${
                  currentUser.OrganisationDepartment?.name?.split(" ")[0]
                })`}</label>
              </HeaderGlobalAction>
              <HeaderGlobalAction
                aria-label="Notifications"
                tooltipAlignment="center"
                className="action-icons"
              >
                <Notification size={20} />
              </HeaderGlobalAction>
              <HeaderGlobalAction
                aria-label="My Profile"
                tooltipAlignment="end"
                onClick={handleProfileClick}
              >
                <UserAvatar
                  size={20}
                  initials={getInitials(
                    currentUser?.Person?.firstName +
                      " " +
                      currentUser?.Person?.lastName
                  )}
                />
              </HeaderGlobalAction>
              <HeaderGlobalAction
                aria-label="Logout"
                tooltipAlignment="center"
                className="action-icons"
                onClick={logOutUser}
              >
                <Logout size={20} aria-label="Logout" />
              </HeaderGlobalAction>
            </HeaderGlobalBar>
          </>
        ) : (
          <HeaderGlobalBar>
            <HeaderGlobalAction
              aria-label="Login"
              tooltipAlignment="center"
              className="action-icons"
              onClick={logInPage}
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
