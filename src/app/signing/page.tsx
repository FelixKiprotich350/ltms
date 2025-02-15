"use client";

import React, { useEffect, useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  InlineNotification,
  Loading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@carbon/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginComponent() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0); // Track active tab (login or signup)

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("reload") === "true") {
      window.location.replace("/signing"); // Forces a full reload
    }
  }, [searchParams]);


  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Both email and password are required.");
      return;
    }

    setError(null); // Clear errors
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        // Redirect after login success
        window.location.href = "/dashboard";

      } else {
        const errorData = await response.json();
        setError(errorData.error || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    setError(null); // Clear previous error
    setIsLoading(true);

    const url = `${API_URL}/signup`;
    const method = "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          firstname: firstname,
          lastname: lastname,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem("user", JSON.stringify(data));

        // Check if there's a redirect URL
        const redirectUrl = new URL(window.location.href);
        const targetUrl = redirectUrl.searchParams.get("redirect") || "/"; // Default to home page
        window.location.href = targetUrl; // Redirect to the target URL
      } else {
        setError(data.error || "Request failed.");
      }
    } catch (err) {
      setError((err as Error).message || "Request failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f4f4f4",
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      {/* Tabs for Login and Signup */}

      <div style={{ marginTop: "20px", border: "1px solid #e0e0e0" }}>
        <Tabs
          onTabCloseRequest={() => {}}
          selected={activeTab}
          onChange={(selected: any) => {
            setActiveTab(selected);
          }} //
          aria-label="Login or Signup"
        >
          <TabList
            aria-label="Login or SignUp"
            scrollDebounceWait={200}
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Tab
              id="login"
              label="Login"
              style={{
                flex: 1,
                textAlign: "center",
                padding: "10px 0",
                fontWeight: activeTab === 0 ? "bold" : "normal",
              }}
            >
              Login
            </Tab>
            <Tab
              id="signup"
              label="Sign Up"
              style={{
                flex: 1,
                textAlign: "right",
                padding: "10px 0",
                fontWeight: activeTab === 0 ? "bold" : "normal",
              }}
            >
              <div style={{ textAlign: "center" }}>Signup</div>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <form onSubmit={handleLoginSubmit}>
                <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
                  Login
                </h2>

                {/* Email Input */}
                <TextInput
                  id="email"
                  labelText="Email"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  required
                  aria-describedby="username-error"
                />

                {/* Password Input */}
                <PasswordInput
                  id="password"
                  labelText="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  required
                  aria-describedby="password-error"
                />

                {/* Error Notification */}
                {error && (
                  <InlineNotification
                    kind="error"
                    title="Error"
                    subtitle={error}
                    onClose={() => {
                      setError(null);
                      return true;
                    }} // Allow users to dismiss error
                    style={{ marginTop: "10px" }}
                    aria-live="assertive"
                  />
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  renderIcon={isLoading ? Loading : undefined} // Show a loading spinner when isLoading
                  style={{ marginTop: "20px", width: "100%" }}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabPanel>
            <TabPanel>
              <form onSubmit={handleSignUpSubmit}>
                <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
                  Sign Up
                </h2>

                {/* Email Input */}
                <TextInput
                  id="email"
                  labelText="Email"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  required
                  aria-describedby="email-error"
                />
                <TextInput
                  id="firstname"
                  labelText="First Name"
                  placeholder="Enter your First Name"
                  value={firstname}
                  onChange={(e: any) => {
                    setFirstname(e.target.value);
                  }}
                  required
                  aria-describedby="firstname-error"
                />
                <TextInput
                  id="lastname"
                  labelText="Last Name"
                  placeholder="Enter your Last Name"
                  value={lastname}
                  onChange={(e: any) => setLastname(e.target.value)}
                  required
                  aria-describedby="lastname-error"
                />

                {/* Password Input */}
                <PasswordInput
                  id="password"
                  labelText="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  required
                  aria-describedby="password-error"
                />
                <PasswordInput
                  id="passwordconfirm"
                  labelText="Password Confirm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  required
                  aria-describedby="passwordconfirm-error"
                />

                {/* Error Notification */}
                {error && (
                  <InlineNotification
                    kind="error"
                    title="Error"
                    subtitle={error}
                    onClose={() => {
                      setError(null);
                      return true;
                    }} // Allow users to dismiss error
                    style={{ marginTop: "10px" }}
                    aria-live="assertive"
                  />
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  renderIcon={isLoading ? Loading : undefined} // Show a loading spinner when isLoading
                  style={{ marginTop: "20px", width: "100%" }}
                >
                  {isLoading ? "Signing up..." : "Sign Up"}
                </Button>
              </form>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
}
