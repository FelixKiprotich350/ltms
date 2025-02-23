"use client";

import React, { ReactNode } from "react";
import { NotificationProvider } from "./layoutComponents/notificationProvider";
import { SessionProvider } from "next-auth/react";
import ContentProviders from "./contentProvider";

interface ProvidersProps {
  children: ReactNode; // Defines that the `children` prop can accept any valid React node
}
const LtmsApp: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <div>
      <SessionProvider>
        <NotificationProvider>
          <ContentProviders>{children}</ContentProviders>
        </NotificationProvider>
      </SessionProvider>
    </div>
  );
};

export default LtmsApp;
