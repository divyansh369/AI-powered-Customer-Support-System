import React, { useState } from "react";
import { Send } from "lucide-react";

const ChatInput = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <form className="chat-input-container" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        disabled={isLoading}
        className="chat-input"
      />
      <button
        type="submit"
        size="icon"
        className="send-btn"
        disabled={isLoading || !message.trim()}
      >
        <Send className="h-6 w-6 text-white" strokeWidth={2.5} />
      </button>
    </form>
  );
};

export default ChatInput;
