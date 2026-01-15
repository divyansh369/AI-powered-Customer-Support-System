import React from 'react';
import { MessageCircle, Package, CreditCard, HelpCircle } from 'lucide-react';

const WelcomeScreen = ({ onQuickAction }) => {
  const quickActions = [
    {
      icon: <HelpCircle size={32} />,
      title: 'General Support',
      subtitle: 'I need help with my account',
      message: 'I need help with my account'
    },
    {
      icon: <Package size={32} />,
      title: 'Order Status',
      subtitle: 'Where is my order?',
      message: 'Where is my order?'
    },
    {
      icon: <CreditCard size={32} />,
      title: 'Billing Help',
      subtitle: 'Check my invoice',
      message: 'I need help with billing'
    }
  ];

  return (
    <div className="welcome-screen">
      <div className="welcome-header">
        <div className="welcome-icon">
          <MessageCircle size={48} />
        </div>
        <h1>AI Customer Support</h1>
        <p>Hello! I'm your AI assistant. I can help you with general support, order tracking, and billing inquiries.</p>
      </div>

      <div className="quick-actions">
        {quickActions.map((action, idx) => (
          <div
            key={idx}
            className="quick-action-card"
            onClick={() => onQuickAction(action.message)}
          >
            <div className="quick-action-icon">{action.icon}</div>
            <div className="quick-action-content">
              <h3>{action.title}</h3>
              <p>{action.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;