import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import socket from "../socket";
import axios from "axios";
import { Logo } from "../components/Logo";
import RequestModal from "../components/findWorkers/RequestModal";

const Messages = () => {

  const location = useLocation();
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(
    location.state?.user || null
  );
  const [search, setSearch] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const [showModal, setShowModal] = useState(false);

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  /*
  =====================
  AUTO SCROLL
  =====================
  */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
  RECEIVE MESSAGE
  =====================
  */
  useEffect(() => {

    const handleReceive = (msg) => {

      if (msg.senderId === user._id) return;

      if (selectedUser && msg.senderId === selectedUser._id) {

        setMessages((prev) => [...prev, msg]);

        socket.emit("messageSeen", {
          senderId: msg.senderId,
          receiverId: user._id
        });

      } else {

        setUnreadCounts((prev) => ({
          ...prev,
          [msg.senderId]: (prev[msg.senderId] || 0) + 1
        }));

      }
    };

    socket.on("receiveMessage", handleReceive);
    return () => socket.off("receiveMessage", handleReceive);

  }, [user?._id, selectedUser]);

  /*
  =====================
  FETCH USERS
  =====================
  */
  useEffect(() => {

    if (!user?._id) return;

    axios
      .get("http://localhost:5000/api/messages/conversations", {
        params: { userId: user._id },
      })
      .then((res) => setUsers(res.data || []))
      .catch((err) => console.log(err));

  }, [user]);

  /*
  =====================
  LOAD MESSAGES
  =====================
  */
  useEffect(() => {

    if (!selectedUser || !user?._id) return;

    axios
      .get("http://localhost:5000/api/messages", {
        params: {
          userId: user._id,
          receiverId: selectedUser._id,
        },
      })
      .then((res) => setMessages(res.data || []))
      .catch((err) => console.log(err));

    inputRef.current?.focus();

  }, [selectedUser, user?._id]);

  /*
  =====================
  SELECT USER
  =====================
  */
  const handleSelectUser = (u) => {

    setSelectedUser(u);

    setUnreadCounts((prev) => ({
      ...prev,
      [u._id]: 0
    }));

  };

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
      seen: false
    };

    setMessages((prev) => [...prev, msg]);
    socket.emit("sendMessage", msg);
    setText("");

  };

  /*
  =====================
  FILTER USERS
  =====================
  */
  const filteredUsers = users.filter((u) =>
    (u.name || "")
      .toLowerCase()
      .includes((search || "").toLowerCase())
  );

  /*
  =====================
  FORMAT TIME
  =====================
  */
  const formatTime = (time) => {
    if (!time) return "";
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  /*
  =====================
  SAFE WORKER FOR MODAL (🔥 FIX)
  =====================
  */
  const modalWorker = selectedUser
    ? {
        _id: selectedUser.workerId || selectedUser._id, // ✅ fallback fix
        firstName: selectedUser.name
      }
    : null;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100 overflow-hidden">

      {/* SIDEBAR */}
      <div className="w-[320px] bg-white border-r overflow-y-auto">

        <div className="p-4 border-b flex items-center gap-2">
          <Logo />
          <h2 className="text-lg font-bold">Messages</h2>
        </div>

        <div className="p-3 border-b">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full border px-3 py-2 rounded text-sm"
          />
        </div>

        {filteredUsers.map((u) => (
          <div
            key={u._id}
            onClick={() => handleSelectUser(u)}
            className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${
              selectedUser?._id === u._id ? "bg-gray-100" : ""
            }`}
          >
            <div className="flex justify-between items-center">

              <div className="flex items-center gap-2">

                <p className="font-medium">{u.name}</p>
              </div>

              {unreadCounts[u._id] > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCounts[u._id]}
                </span>
              )}

            </div>
          </div>
        ))}

      </div>

      {/* CHAT */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {!selectedUser ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a chat
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="p-4 border-b bg-white flex justify-between items-center">

              <h3 className="font-semibold">
                {selectedUser.name}
              </h3>

              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1 rounded"
              >
                Send Request
              </button>

            </div>

            {/* MESSAGES */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2">

              {messages.map((m, i) => {

                const isMine = m.senderId === user._id;

                return (
                  <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>

                    <div className="max-w-xs">

                      <div className={`px-3 py-2 rounded-lg text-sm ${
                        isMine ? "bg-blue-600 text-white" : "bg-white border"
                      }`}>
                        {m.text}
                      </div>

                      <div className="text-xs text-gray-400 mt-1 flex justify-end gap-1">
                        {formatTime(m.createdAt)}
                        {isMine && (
                          <span>{m.seen ? "✔✔" : "✔"}</span>
                        )}
                      </div>

                    </div>

                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
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

      {/* 🔥 REQUEST MODAL */}
      {showModal && modalWorker && (
        <RequestModal
          worker={modalWorker}
          onClose={() => setShowModal(false)}
        />
      )}

    </div>
  );
};

export default Messages;