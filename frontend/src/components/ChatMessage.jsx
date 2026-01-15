import React from 'react';
import { Bot, User } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  
  const getAgentName = (agentType) => {
    const agentMap = {
      'order': 'Order Agent',
      'billing': 'Billing Agent',
      'support': 'Support Agent',
      'router': 'Router Agent',
      'general': 'Support Agent'
    };
    return agentMap[agentType?.toLowerCase()] || 'Support Agent';
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    });
  };
  
  // System messages (errors, notifications)
  if (isSystem) {
    return (
      <div className="chat-message system">
        <div className="message-bubble system">
          <div className="message-content">{message.content}</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`chat-message ${isUser ? 'user' : 'assistant'}`}>
      {!isUser && (
        <div className="message-avatar">
          <Bot size={18} />
        </div>
      )}
      <div className="message-bubble">
        {!isUser && (
          <div className="message-agent-name">{getAgentName(message.agentType)}</div>
        )}
        <div className="message-content">{message.content}</div>
        <div className="message-time">
          {formatTime(message.createdAt)}
        </div>
      </div>
      {isUser && (
        <div className="message-avatar">
          <User size={18} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;