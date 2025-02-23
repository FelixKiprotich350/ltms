"use client";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

let socket: Socket;

const Chat = () => {
  const [userId, setUserId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [recipientId, setRecipientId] = useState<string>("");

  useEffect(() => {
    socket = io(undefined, { path: "/api/socket" });

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    // Receive messages
    socket.on("message", (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const registerUser = () => {
    if (userId.trim()) {
      socket.emit("register", userId);
      console.log("Registered user:", userId);
    }
  };

  const sendPrivateMessage = () => {
    if (message.trim() && recipientId.trim()) {
      socket.emit("privateMessage", { toUserId: recipientId, message });
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Private Chat</h2>

      {/* Register User */}
      <input
        type="text"
        placeholder="Enter your User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={registerUser}>Register</button>

      {/* Send Message to Specific User */}
      <input
        type="text"
        placeholder="Recipient User ID"
        value={recipientId}
        onChange={(e) => setRecipientId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendPrivateMessage}>Send to User</button>

      {/* Display Messages */}
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
};

export default Chat;
