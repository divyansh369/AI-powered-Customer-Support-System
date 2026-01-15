import React from 'react';
import { MessageSquare, Plus, Search, Trash2 } from 'lucide-react';

const Sidebar = ({
  conversations,
  onNewChat,
  onSelectConversation,
  selectedId,
  onDeleteConversation
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const normalizedConversations = conversations.map((conv) => ({
    id: conv.id,
    title: `Conversation ${conv.id.slice(0, 6)}`,
    lastMessage: 'Click to view messages',
    updatedAt: conv.createdAt
  }));

  // Safe filtering
  const filteredConversations = normalizedConversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Conversations</h2>
        <button className="new-conversation-btn" onClick={onNewChat}>
          <Plus size={20} />
        </button>
      </div>

      <div className="search-box">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="conversations-list">
        {filteredConversations.length === 0 ? (
          <div className="empty-conversations">
            <MessageSquare size={32} />
            <p>No conversations yet</p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${
                selectedId === conv.id ? 'active' : ''
              }`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className="conversation-icon">
                <MessageSquare size={18} />
              </div>

              <div className="conversation-info">
                <div className="conversation-title">{conv.title}</div>
                <div className="conversation-preview">{conv.lastMessage}</div>
                <div className="conversation-time">
                  {formatTime(conv.updatedAt)}
                </div>
              </div>

              <button
                className="delete-conversation-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conv.id);
                }}
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
