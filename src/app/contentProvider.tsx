"use client";

import React, {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import {
  Switcher,
  UserAvatar,
  Notification,
  Logout,
} from "@carbon/icons-react";
import {
  Theme,
  Content,
  Header,
  SkipToContent,
  HeaderName,
  SideNav,
  SideNavItems,
  SideNavMenu,
  SideNavMenuItem,
  SideNavLink,
  HeaderMenuButton,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderMenuItem,
  OverflowMenuItem,
} from "@carbon/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NotificationProvider } from "./layoutComponents/notificationProvider";
import { Role, TrtUser } from "@prisma/client";

interface ProvidersProps {
  children: ReactNode; // Defines that the `children` prop can accept any valid React node
}
interface ExtendedUser extends TrtUser {
  Role?: Role;
}
const ContentProviders: React.FC<ProvidersProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const router = useRouter();
  const toggleSideNav = () => {
    setIsSideNavExpanded((prev) => !prev);
  };
  // Fetch user details if the user is authenticated
  const fetchUserDetails = async () => {
    try {
      const response = await fetch("/api/auth/me"); // API endpoint to get user details
      if (response.ok) {
        const data = await response.json();
        setUser(data?.user); // Store user details in state
      } else {
        setUser(null); // Reset user state if not authenticated
      }
    } catch (error) {
      setError("Failed to fetch user details");
    }
  };

  //logout function
  const logOutUser = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "/"; // Refresh the page to ensure every state is reset
      } else {
        setError(data.error || "Logout Failed.");
      }
    } catch (error) {
      // In case of network or unexpected errors
      setError("An error occurred during logout.");
    }
  };

  //login function
  const logInPage = () => {
    window.location.href = "/signing";
  };

  // Fetch user details when the component mounts (or when logged-in state changes)
  useEffect(() => {
    fetchUserDetails(); // Fetch user details
  }, [router]);
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <NotificationProvider>
        <Theme theme="g100">
          <Header aria-label="Letter Trail System">
            <SkipToContent />
            {user && (
              <HeaderMenuButton
                isActive={isSideNavExpanded}
                aria-expanded={isSideNavExpanded}
                aria-label={isSideNavExpanded ? "Close menu" : "Open menu"}
                onClick={toggleSideNav}
                isCollapsible={true}
              />
            )}
            <HeaderName href="/" prefix="" size="lg">
              Letter Trail System 
            </HeaderName>

            {user != null && (
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

            {user == null && (
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
                <Link href="/dashboard" passHref legacyBehavior>
                  <SideNavLink>Dashboard </SideNavLink>
                </Link>
                {user.Role?.name == "Cashier" ||
                  (user.Role?.name == "Admin" && (
                    <SideNavMenu title="Point of Sale">
                      <Link href="/pos/newsale" passHref legacyBehavior>
                        <SideNavMenuItem>New Sale</SideNavMenuItem>
                      </Link>
                      <Link href="/pos/tickets" passHref legacyBehavior>
                        <SideNavMenuItem>Tickets on Hold</SideNavMenuItem>
                      </Link>
                      <Link href="/pos/today" passHref legacyBehavior>
                        <SideNavMenuItem>Today's Sales</SideNavMenuItem>
                      </Link>
                    </SideNavMenu>
                  ))}
                {user.Role?.name == "StockManager" ||
                  (user.Role?.name == "Admin" && (
                    <SideNavMenu title="Inventory">
                      <Link
                        href="/inventory/allproducts"
                        passHref
                        legacyBehavior
                      >
                        <SideNavMenuItem>Products List</SideNavMenuItem>
                      </Link>
                      <Link href="/inventory/receive" passHref legacyBehavior>
                        <SideNavMenuItem>Receive Stock</SideNavMenuItem>
                      </Link>
                      <Link href="/inventory/packunits" passHref legacyBehavior>
                        <SideNavMenuItem>Packaging Units</SideNavMenuItem>
                      </Link>
                      <Link
                        href="/inventory/categories"
                        passHref
                        legacyBehavior
                      >
                        <SideNavMenuItem>Categories</SideNavMenuItem>
                      </Link>
                    </SideNavMenu>
                  ))}

                {user.Role?.name == "Admin" && (
                  <SideNavMenu title="User Management">
                    <Link href="/users" passHref legacyBehavior>
                      <SideNavMenuItem>Users List</SideNavMenuItem>
                    </Link>
                    <Link href="/users/roles" passHref legacyBehavior>
                      <SideNavMenuItem>User Roles</SideNavMenuItem>
                    </Link>
                  </SideNavMenu>
                )}
                {user.Role?.name == "Admin" && (
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
                )}
                {/* <SideNavLink href="/datafetch"></SideNavLink> */}
              </SideNavItems>
            </SideNav>
          )}
          <Content>
            <Theme theme="white">{children}</Theme>
          </Content>
        </Theme>
      </NotificationProvider>
    </div>
  );
};

export default ContentProviders;
