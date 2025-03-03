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
  Tag,
} from "@carbon/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LeftPanelMenuProps {
  isSideNavExpanded: boolean; // Defines that the `children` prop can accept any valid React node
  currentUser: any | null;
}

const LeftPanelMenu: React.FC<LeftPanelMenuProps> = ({
  isSideNavExpanded,
  currentUser,
}) => {
  return (
    <SideNav
      isFixedNav={true}
      // defaultExpanded={false}
      expanded={isSideNavExpanded}
      // isChildOfHeader={true}
      aria-label="Side navigation"
    >
      <SideNavItems>
        <Link href="/dashboard" passHref legacyBehavior>
          <SideNavLink>Dashboard</SideNavLink>
        </Link>
        <SideNavMenu title="Letters">
          <Link href="/requests/new" passHref legacyBehavior>
            <SideNavMenuItem>New Request</SideNavMenuItem>
          </Link>
          <Link href="/requests/incoming" passHref legacyBehavior>
            <SideNavMenuItem>
              Incoming Requests <Tag>11</Tag>
            </SideNavMenuItem>
          </Link>
          <Link href="/requests/outgoing" passHref legacyBehavior>
            <SideNavMenuItem>Outgoing Requests</SideNavMenuItem>
          </Link>
          <Link href="/requests/drafts" passHref legacyBehavior>
            <SideNavMenuItem>Draft Letters</SideNavMenuItem>
          </Link>
        </SideNavMenu>
        <SideNavMenu title="Tickets">
          <Link href="/tickets/active" passHref legacyBehavior>
            <SideNavMenuItem>Active Tickets</SideNavMenuItem>
          </Link>
          <Link href="/tickets/closed" passHref legacyBehavior>
            <SideNavMenuItem>Case Closed</SideNavMenuItem>
          </Link>
          <Link href="/tickets/others" passHref legacyBehavior>
            <SideNavMenuItem>others</SideNavMenuItem>
          </Link>
        </SideNavMenu>
        <SideNavMenu title="Recipients">
          <Link href="/recipients/master" passHref legacyBehavior>
            <SideNavMenuItem>Master Recipients</SideNavMenuItem>
          </Link>
          <Link href="/recipients/departments" passHref legacyBehavior>
            <SideNavMenuItem>Departments</SideNavMenuItem>
          </Link>
          <Link href="/recipients/departmentpersons" passHref legacyBehavior>
            <SideNavMenuItem>Department Persons</SideNavMenuItem>
          </Link>
        </SideNavMenu>
        <SideNavMenu title="Administration">
          <Link href="/admin/departments" passHref legacyBehavior>
            <SideNavMenuItem>Departments</SideNavMenuItem>
          </Link>
          <Link href="/admin/roles" passHref legacyBehavior>
            <SideNavMenuItem>Departments Roles</SideNavMenuItem>
          </Link>
          <Link href="/admin/lettercategory" passHref legacyBehavior>
            <SideNavMenuItem>Letter Category</SideNavMenuItem>
          </Link>
        </SideNavMenu>
        <SideNavMenu title="Notifications">
          <Link href="/notifications/master" passHref legacyBehavior>
            <SideNavMenuItem>Master</SideNavMenuItem>
          </Link>
          <Link href="/notifications/types" passHref legacyBehavior>
            <SideNavMenuItem>Notification Types</SideNavMenuItem>
          </Link>
          <Link href="/notifications/channels" passHref legacyBehavior>
            <SideNavMenuItem>Channels</SideNavMenuItem>
          </Link>
        </SideNavMenu>
        <SideNavMenu title="User Management">
          <Link href="/users" passHref legacyBehavior>
            <SideNavMenuItem>Users List</SideNavMenuItem>
          </Link>
          <Link href="/users/roles" passHref legacyBehavior>
            <SideNavMenuItem>User Roles</SideNavMenuItem>
          </Link>
        </SideNavMenu>
        <SideNavMenu title="Reports">
          {/* <Link href="/reports/summary" passHref legacyBehavior>
            <SideNavMenuItem>Summary Reports</SideNavMenuItem>
          </Link> */}
          <Link href="/reports/letters" passHref legacyBehavior>
            <SideNavMenuItem>All Letters</SideNavMenuItem>
          </Link>
          <Link href="/reports/tickets" passHref legacyBehavior>
            <SideNavMenuItem>Tickets</SideNavMenuItem>
          </Link>
          <Link href="/reports/departments" passHref legacyBehavior>
            <SideNavMenuItem>Departments</SideNavMenuItem>
          </Link>
        </SideNavMenu>
        <SideNavMenu title="My Account">
          <Link href="/myaccount/profile" passHref legacyBehavior>
            <SideNavLink>My Profile</SideNavLink>
          </Link>
          <Link href="/myaccount/prefferences" passHref legacyBehavior>
            <SideNavMenuItem>Prefferences</SideNavMenuItem>
          </Link>
        </SideNavMenu>
      </SideNavItems>
    </SideNav>
  );
};

export default LeftPanelMenu;
