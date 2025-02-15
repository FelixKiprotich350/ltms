import React, { createContext, useContext, useState } from "react";
import { ToastNotification } from "carbon-components-react";
import "./NotificationProvider.css"; // Add styles for positioning
import { Theme } from "@carbon/react";

type Notification = {
  id: number;
  kind: "info" | "success" | "warning" | "error";
  title: string;
  subtitle?: string;
  timeout?: number; // Optional auto-dismiss time
};

type NotificationContextType = {
  addNotification: (notification: Omit<Notification, "id">) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { ...notification, id }]);

    if (notification.timeout) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, notification.timeout);
    }
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="notification-container">
        {notifications.map(({ id, kind, title, subtitle }) => (
          <ToastNotification
            key={id}
            kind={kind}
            title={title}
            subtitle={subtitle}
            onCloseButtonClick={() =>
              setNotifications((prev) => prev.filter((n) => n.id !== id))
            }
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
