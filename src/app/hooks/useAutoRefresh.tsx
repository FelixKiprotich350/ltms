// import { useEffect, useState } from "react";
// import jwt_decode, { jwtDecode } from "jwt-decode";
// import { useRouter } from "next/router";

// const useAutoRefresh = () => {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true); // Ensures that this hook runs after the component is mounted
//   }, []);
//   const router = useRouter();

//   useEffect(() => {
//     if (!mounted) return;

//     const refreshToken = async () => {
//       const token = document.cookie
//         ?.split(";")
//         .find((cookie) => cookie.trim().startsWith("token="));

//       if (token) {
//         const decoded: any = jwtDecode(token.split("=")[1]);

//         const expiryTime = decoded.exp * 1000; // Convert to milliseconds
//         const currentTime = new Date().getTime();

//         if (expiryTime - currentTime < 60 * 1000) {
//           try {
//             const response = await fetch("/api/refresh-token", {
//               method: "POST",
//               credentials: "include",
//             });

//             if (response.ok) {
//               const data = await response.json();
//               document.cookie = `token=${data.token}; path=/;`;
//             } else {
//               console.error("Token refresh failed");
//               // Optionally redirect to login if refresh fails
//               if (router) {
//                 router.push("/login");
//               }
//             }
//           } catch (error) {
//             console.error("Error refreshing token:", error);
//             if (router) {
//               router.push("/login");
//             }
//           }
//         }
//       }
//     };

//     const intervalId = setInterval(refreshToken, 30 * 1000);
//     return () => clearInterval(intervalId);
//   }, [mounted, router]);
// };

// export default useAutoRefresh;
