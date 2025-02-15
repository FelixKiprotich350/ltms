import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verifyAuth } from "lib/auth";

const SECRET_KEY = process.env.JWT_SECRET!; // Store in .env

// export function middleware1(request: NextRequest) {
//   const token = request.cookies.get("authToken")?.value;

//   console.log("==", token);
//   // If no token, redirect to sign-in page
//   if (token && token != "") {
//     try {
//       jwt.verify(token, SECRET_KEY);
//       console.log("---", request.nextUrl.pathname, token);
//       // Redirect logged-in users away from the login page
//       if (request.nextUrl.pathname === "/signing ") {
//         return NextResponse.redirect(new URL("/dashboard", request.url));
//       }
//       return NextResponse.next();
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   return NextResponse.redirect(
//     new URL("/signing?reload=true", request.url),
//     303
//   );
// }

export async function middleware(req: NextRequest) {
  // validate the user is authenticated
  const verifiedToken = await verifyAuth(req).catch((err) => {
    console.error("--",err.message);
  });

  if (!verifiedToken) {
    // if this an API request, respond with JSON
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return new NextResponse(
        JSON.stringify({ error: { message: "authentication required" } }),
        { status: 401 }
      );
    }
    // otherwise, redirect to the set token page
    else {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
}
export const config = {
  runtime: "nodejs", // This ensures Node.js runtime for this middleware
  matcher: [
    "/dashboard",
    "/pos/:path*",
    "/settings/:path*",
    "/reports/:path*",
    "/users/:path*",
    "/inventory/:path*",
  ], // Match all routes except static files
};
