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
        {/* {user.Role?.name == "Cashier" ||
          (user.Role?.name == "Admin" && (
          
          ))} */}
        <SideNavMenu title="Letters">
          <Link href="/requests/new" passHref legacyBehavior>
            <SideNavMenuItem>New Request</SideNavMenuItem>
          </Link>
          <Link href="/requests/incoming" passHref legacyBehavior>
            <SideNavMenuItem>Incoming Requests</SideNavMenuItem>
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
          <Link href="/inventory/allproducts" passHref legacyBehavior>
            <SideNavMenuItem>Products List</SideNavMenuItem>
          </Link>
          <Link href="/inventory/receive" passHref legacyBehavior>
            <SideNavMenuItem>Receive Stock</SideNavMenuItem>
          </Link>
          <Link href="/inventory/packunits" passHref legacyBehavior>
            <SideNavMenuItem>Packaging Units</SideNavMenuItem>
          </Link>
          <Link href="/inventory/categories" passHref legacyBehavior>
            <SideNavMenuItem>Categories</SideNavMenuItem>
          </Link>
        </SideNavMenu>
        {/* {user.Role?.name == "Admin" && (
         
        )} */}
        <SideNavMenu title="User Management">
          <Link href="/users" passHref legacyBehavior>
            <SideNavMenuItem>Users List</SideNavMenuItem>
          </Link>
          <Link href="/users/roles" passHref legacyBehavior>
            <SideNavMenuItem>User Roles</SideNavMenuItem>
          </Link>
        </SideNavMenu>
        {/* {user.Role?.name == "Admin" && (
          
        )} */}
        <SideNavMenu title="Reports">
          <Link href="/reports/sales" legacyBehavior>
            <SideNavMenuItem>Sales Reports</SideNavMenuItem>
          </Link>
          <Link href="/reports/products" legacyBehavior>
            <SideNavMenuItem>Product Reports</SideNavMenuItem>
          </Link>
          <Link href="/reports/payments" legacyBehavior>
            <SideNavMenuItem>Payment Reports</SideNavMenuItem>
          </Link>
          {/* <Link href="/reports/users" legacyBehavior>
            <SideNavMenuItem>User Reports</SideNavMenuItem>
          </Link> */}
        </SideNavMenu>
        <SideNavMenu title="My Account">
          <Link href="/myaccount/profile" passHref legacyBehavior>
            <SideNavLink>My Profile</SideNavLink>
          </Link>
          <Link href="/myaccount/passwordchange" passHref legacyBehavior>
            <SideNavMenuItem>Change Password</SideNavMenuItem>
          </Link>
          {/* <Link href="/reports/payments" passHref legacyBehavior>
            <SideNavMenuItem>Payment Reports</SideNavMenuItem>
          </Link> */}
        </SideNavMenu>
      </SideNavItems>
    </SideNav>
  );
};

export default LeftPanelMenu;
