import React from 'react';

interface MessageProps {
  message: string;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      backgroundColor: message.includes('成功') ? '#d4edda' : '#f8d7da',
      color: message.includes('成功') ? '#155724' : '#721c24',
      borderRadius: '4px',
      fontSize: '14px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      zIndex: 10000,
      animation: 'slideIn 0.3s ease-out'
    }}>
      {message}
    </div>
  );
};

export default Message;