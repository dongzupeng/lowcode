import React, { createContext, useContext, useState } from 'react';
import type {ReactNode} from 'react';

type MessageType = 'success' | 'info' | 'warning' | 'error';

interface MessageOptions {
  type?: MessageType;
  duration?: number;
}

interface MessageContextType {
  showMessage: (message: string, options?: MessageOptions) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};

interface MessageProviderProps {
  children: ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Array<{ id: string; message: string; type: MessageType; duration: number }>>([]);

  const showMessage = (message: string, options: MessageOptions = {}) => {
    const id = Date.now().toString();
    const { type = 'info', duration = 2000 } = options;
    
    setMessages(prev => [...prev, { id, message, type, duration }]);
    
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== id));
    }, duration);
  };

  // 根据消息类型设置样式
  const getMessageStyle = (type: MessageType) => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#d4edda',
          color: '#155724'
        };
      case 'info':
        return {
          backgroundColor: '#d1ecf1',
          color: '#0c5460'
        };
      case 'warning':
        return {
          backgroundColor: '#fff3cd',
          color: '#856404'
        };
      case 'error':
        return {
          backgroundColor: '#f8d7da',
          color: '#721c24'
        };
      default:
        return {
          backgroundColor: '#d1ecf1',
          color: '#0c5460'
        };
    }
  };

  return (
    <MessageContext.Provider value={{ showMessage }}>
      {children}
      {messages.map(msg => {
        const messageStyle = getMessageStyle(msg.type);
        return (
          <div
            key={msg.id}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              padding: '12px 20px',
              backgroundColor: messageStyle.backgroundColor,
              color: messageStyle.color,
              borderRadius: '4px',
              fontSize: '14px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              zIndex: 10000,
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            {msg.message}
          </div>
        );
      })}
    </MessageContext.Provider>
  );
};

// 导出消息工具函数 (使用useMessage hook在组件中调用)