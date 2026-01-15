import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar.jsx';
import ChatWindow from './components/ChatWindow';
import { chatAPI } from './services/api';
import './App.css';

function App() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingStage, setTypingStage] = useState('routing');

  useEffect(() => {
    async function loadConversations() {
      try {
        const data = await chatAPI.getConversations();
        setConversations(data || []);
      } catch (err) {
        if (err.code !== 'ERR_NETWORK') {
          console.error('Failed to load conversations', err);
        }
        setConversations([]);
      }
    }
  
    loadConversations();
  }, []);
  

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    async function loadMessages() {
      try {
        const convo = await chatAPI.getConversation(selectedConversationId);
        setMessages(convo?.messages || []);
      } catch (err) {
        console.error('Failed to load messages', err);
        setMessages([]);
      }
    }

    loadMessages();
  }, [selectedConversationId]);

  const handleNewChat = () => {
    setSelectedConversationId(null);
    setMessages([]);
  };

  const handleSelectConversation = (convId) => {
    setSelectedConversationId(convId);
  };

  const handleSendMessage = async (message) => {
    setIsLoading(true);
    setTypingStage('routing');
  
    const userMessage = {
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
    };
  
    setMessages((prev) => [...prev, userMessage]);
  
    try {
      // Start API call immediately 
      const apiPromise = chatAPI.sendMessage(message, selectedConversationId);
  
      // Update stages while waiting 
      setTimeout(() => setTypingStage('thinking'), 300);
  
      if (
        message.toLowerCase().includes('order') ||
        message.toLowerCase().includes('invoice') ||
        message.toLowerCase().includes('tracking')
      ) {
        setTimeout(() => setTypingStage('fetching'), 700);
      }
  
      setTimeout(() => setTypingStage('generating'), 1100);
  
      const response = await apiPromise;
  
      if (!selectedConversationId) {
        setSelectedConversationId(response.conversationId);
      }
  
      const conversationId = selectedConversationId || response.conversationId;
  
      try {
        const updatedConvo = await chatAPI.getConversation(conversationId);
        setMessages(updatedConvo?.messages || []);
      } catch (err) {
        console.warn('Failed to reload conversation, using response data', err);
  
        const agentMessage = {
          role: 'agent',
          content: response.response,
          agentType: response.intent || 'support',
          createdAt: new Date().toISOString(),
        };
  
        setMessages((prev) => [...prev, agentMessage]);
      }
  
      // Refresh sidebar list
      chatAPI
        .getConversations()
        .then((updated) => setConversations(updated))
        .catch((err) => console.warn('Failed to refresh conversations list', err));
  
    } catch (err) {
      console.error('Send message failed', err);
  
      let errorMessage =
        'The system is temporarily unavailable. Please try again later.';
  
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        errorMessage =
          'Unable to connect to the server. Please make sure the backend is running.';
      } else if (err.response) {
        const apiError = err.response.data;
        const status = err.response.status;
  
        if (status === 429) {
          errorMessage =
            apiError?.message ||
            'AI quota exceeded (free tier limit). Please try again later.';
        } else if (status === 500) {
          errorMessage =
            apiError?.message ||
            apiError?.details ||
            apiError?.error ||
            'Server error occurred. Please try again later.';
        } else if (status >= 400 && status < 500) {
          errorMessage =
            apiError?.message ||
            apiError?.error ||
            'Invalid request. Please check your message and try again.';
        } else {
          errorMessage = apiError?.message || apiError?.error || errorMessage;
        }
      }
  
      setMessages((prev) => [
        ...prev,
        {
          role: 'system',
          content: errorMessage,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTypingStage('routing');
    }
  };

  const handleDeleteConversation = async (convId) => {
    try {
      await chatAPI.deleteConversation(convId);
      
      // Refresh conversation list 
      try {
        const updated = await chatAPI.getConversations();
        setConversations(updated);
      } catch (err) {
        console.warn('Failed to refresh conversations after delete', err);
        // Remove from local state if refresh fails
        setConversations((prev) => prev.filter((c) => c.id !== convId));
      }

      if (selectedConversationId === convId) {
        handleNewChat();
      }
    } catch (err) {
      console.error('Delete failed', err);
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (selectedConversationId === convId) {
        handleNewChat();
      }
    }
  };

  return (
    <div className="app">
      <Sidebar
        conversations={conversations}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        selectedId={selectedConversationId}
        onDeleteConversation={handleDeleteConversation}
      />

      <ChatWindow
        conversationId={selectedConversationId}
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        typingStage={typingStage}
      />
    </div>
  );
}

export default App;