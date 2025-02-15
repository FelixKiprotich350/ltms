// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import Cookies from "js-cookie"; // Import js-cookie
// import {jwtDecode} from "jwt-decode"; // Use jwt-decode for decoding JWT
// import { USER_TOKEN } from "lib/constants";

// const useAuth = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [isClient, setIsClient] = useState(false); // Add state to track client-side rendering
//   const router = useRouter();

//   useEffect(() => {
//     // Ensure we are on the client side before running the logic
//     setIsClient(true);
//   }, []);

//   useEffect(() => {
//     // If not on the client, do not run authentication logic
//     if (!isClient) return;

//     const token = Cookies.get(USER_TOKEN); // Get the token cookie

//     if (token) {
//       try {
//         const decodedToken: any = jwtDecode(token); // Decode JWT
//         const expiration = decodedToken.exp * 1000; // Convert to milliseconds

//         if (Date.now() < expiration) {
//           setIsAuthenticated(true);
//         } else {
//           setIsAuthenticated(false);
//           Cookies.remove(USER_TOKEN); // Remove expired token
//           router.push("/signing"); // Redirect to sign-in page
//         }
//       } catch (error) {
//         console.error("Token decoding failed:", error);
//         setIsAuthenticated(false);
//         router.push("/signing"); // Redirect to sign-in page
//       }
//     } else {
//       setIsAuthenticated(false);
//       router.push("/signing"); // Redirect to sign-in page
//     }
//   }, [isClient, router]); // Only run when client is mounted

//   return isAuthenticated;
// };

// export default useAuth;
