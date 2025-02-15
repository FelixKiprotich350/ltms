// "use client";

// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// interface AuthContextType {
//   user: any;
//   loading: boolean;
//   error: string | null;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   // useEffect(() => {
//   //   const getUser = async () => {
//   //     try {
//   //       const response = await fetch("/api/token");
//   //       if (response.ok) {
//   //         const data = await response.json();
//   //         setUser(data);
//   //       } else {
//   //         setUser(null);
//   //       }
//   //     } catch (error) {
//   //       setError("Failed to fetch user details");
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
//   //   getUser();
//   // }, []);

//   const logout = async () => {
//     try {
//       const response = await fetch("/api/logout", { method: "POST" });
//       if (response.ok) {
//         setUser(null);
//         router.push("/"); // Redirect to home after logout
//       } else {
//         setError("Logout Failed.");
//       }
//     } catch (error) {
//       setError("An error occurred during logout.");
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, error, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
