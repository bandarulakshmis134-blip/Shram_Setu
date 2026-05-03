import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import socket from "../socket";
import axios from "axios";
import {Logo} from "../components/Logo"; // ✅ IMPORT YOUR LOGO COMPONENT

const Messages = () => {
  const location = useLocation();
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(
    location.state?.user || null
  );
  const [onlineUsers, setOnlineUsers] = useState({});
  const [search, setSearch] = useState("");

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  /*
  =====================
  AUTO SCROLL
  =====================
  */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /*
  =====================
  JOIN SOCKET
  =====================
  */
  useEffect(() => {
    if (!user?._id) return;
    socket.emit("join", user._id);
  }, [user?._id]);

  /*
  =====================
  SOCKET LISTENERS
  =====================
  */
  useEffect(() => {
    const handleReceive = (msg) => {
      if (msg.senderId === user._id) return;
      setMessages((prev) => [...prev, msg]);
    };

    const handleOnline = (id) => {
      setOnlineUsers((prev) => ({ ...prev, [id]: true }));
    };

    const handleOffline = (id) => {
      setOnlineUsers((prev) => ({ ...prev, [id]: false }));
    };

    socket.on("receiveMessage", handleReceive);
    socket.on("userOnline", handleOnline);
    socket.on("userOffline", handleOffline);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("userOnline", handleOnline);
      socket.off("userOffline", handleOffline);
    };
  }, [user?._id]);

  /*
  =====================
  FETCH USERS
  =====================
  */
  useEffect(() => {
    if (!user?._id) return;

    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/messages/conversations",
          { params: { userId: user._id } }
        );
        setUsers(res.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, [user]);

  /*
  =====================
  LOAD MESSAGES
  =====================
  */
  useEffect(() => {
    if (!selectedUser || !user?._id) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/messages",
          {
            params: {
              userId: user._id,
              receiverId: selectedUser._id,
            },
          }
        );
        setMessages(res.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMessages();
    inputRef.current?.focus();
  }, [selectedUser, user?._id]);

  /*
  =====================
  SEND MESSAGE
  =====================
  */
  const sendMessage = () => {
    if (!text.trim() || !selectedUser) return;

    const msg = {
      senderId: user._id,
      receiverId: selectedUser._id,
      text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, msg]);
    socket.emit("sendMessage", msg);
    setText("");
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const isOnline = selectedUser
    ? onlineUsers[selectedUser._id]
    : false;

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-[320px] bg-white border-r overflow-y-auto">

        {/* 🔥 HEADER WITH LOGO COMPONENT */}
        <div className="p-4 border-b flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center">
            <Logo />
          </div>
          <h2 className="text-lg font-bold">Messages</h2>
        </div>

        {/* SEARCH */}
        <div className="p-3 border-b">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border px-3 py-2 rounded text-sm"
          />
        </div>

        {filteredUsers.map((u) => (
          <div
            key={u._id}
            onClick={() => setSelectedUser(u)}
            className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${
              selectedUser?._id === u._id ? "bg-gray-100" : ""
            }`}
          >
            <p className="font-medium">{u.name}</p>
          </div>
        ))}
      </div>

      {/* CHAT */}
      <div className="flex-1 flex flex-col">

        {!selectedUser ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a chat
          </div>
        ) : (
          <>
            <div className="p-4 border-b bg-white">
              <h3 className="font-semibold">{selectedUser.name}</h3>
              <p className="text-xs text-gray-500">
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {messages.map((m, i) => {
                const isMine = m.senderId === user._id;

                return (
                  <div
                    key={i}
                    className={`flex ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-lg text-sm max-w-xs ${
                        isMine
                          ? "bg-blue-600 text-white"
                          : "bg-white border"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t bg-white flex gap-2">
              <input
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 border px-3 py-2 rounded"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 rounded"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;