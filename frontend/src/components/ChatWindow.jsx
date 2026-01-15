import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import WelcomeScreen from './WelcomeScreen';
import TypingIndicator from './TypingIndicator';
import { Headphones, Package, CreditCard } from 'lucide-react';

const ChatWindow = ({
  conversationId,
  messages,
  onSendMessage,
  isLoading,
  typingStage
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const availableAgents = [
    { icon: <Headphones size={16} />, name: 'Support', active: true },
    { icon: <Package size={16} />, name: 'Order', active: true },
    { icon: <CreditCard size={16} />, name: 'Billing', active: true },
  ];

  const isEmptyChat = messages.length === 0;

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-left">
          <span className="available-agents-label">Available Agents:</span>
          <div className="available-agents">
            {availableAgents.map((agent, idx) => (
              <div key={idx} className="agent-badge">
                {agent.icon}
                <span>{agent.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="chat-messages-area">
        {isEmptyChat ? (
          <>
            <WelcomeScreen onQuickAction={onSendMessage} />
            {isLoading && <TypingIndicator stage={typingStage} />}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))}
            {isLoading && <TypingIndicator stage={typingStage} />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <ChatInput onSend={onSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatWindow;