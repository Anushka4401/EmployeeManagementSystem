import React, { useState, useEffect, useRef } from "react";
import MessageService from "../services/MessageService";
import moment from "moment";

const ChatBox = ({ user, senderId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const formatTimestamp = (isoTimestamp) => {
    return moment(isoTimestamp).format("MMM D, YYYY [at] h:mm A");
  };

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const data = await MessageService.getMessagesByUserId(senderId);

        let filteredMessages = data.filter(
          (msg) =>
            (msg.senderId === senderId && msg.receiverId === user.id) ||
            (msg.senderId === user.id && msg.receiverId === senderId)
        );
        filteredMessages.sort(
          (a, b) => new Date(a.sentAt) - new Date(b.sentAt)
        );

        setMessages(filteredMessages);
        console.log(filteredMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user, senderId]);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messageData = await MessageService.sendMessage(
        senderId,
        user.id,
        newMessage
      );

      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div
      className="d-flex flex-column border rounded shadow-sm p-3"
      style={{ height: "90vh", maxHeight: "90vh" }}
    >
      <h5 className="text-primary mb-3">Chat with {user?.name}</h5>

      {/* Chat Messages Container */}
      <div
        className="chat-box border rounded p-3 bg-light flex-grow-1 overflow-auto"
        style={{ display: "flex", flexDirection: "column" }}
      >
        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`d-flex flex-column mb-2 ${
                msg.senderId === senderId
                  ? "align-items-end"
                  : "align-items-start"
              }`}
            >
              <div
                className={`p-2 rounded ${
                  msg.senderId === senderId
                    ? "bg-primary text-white"
                    : "bg-white border"
                }`}
              >
                <small>{msg.message}</small>
                <br />
                <small className="text-muted">
                  {msg.sentAt ? formatTimestamp(msg.sentAt) : "N/A"}
                </small>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No messages yet.</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="input-group mt-3">
        <input
          type="text"
          className="form-control"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button className="btn btn-primary" onClick={handleSendMessage}>
          <i className="bi bi-send"></i> {/* Bootstrap Send Icon */}
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
