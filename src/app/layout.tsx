import "./globals.scss";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ContentProviders from "./contentProvider";
// import { AuthProvider } from "./AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Letter Trail System",
  description: "Robust Letter Trail System",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* <AuthProvider> */}
        <ContentProviders>{children}</ContentProviders>
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
