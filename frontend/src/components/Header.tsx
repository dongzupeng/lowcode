import React from 'react';
import useAppStore from '../store/useAppStore';

interface HeaderProps {
  message: string;
  isPreviewMode: boolean;
  onSave: () => void;
  onLoad: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onToggleTheme: () => void;
  onToggleGrid: () => void;
  onSetGridSize: (size: number) => void;
  onTogglePreview: () => void;
}

const Header: React.FC<HeaderProps> = ({
  message,
  isPreviewMode,
  onSave,
  onLoad,
  onCopy,
  onPaste,
  onUndo,
  onRedo,
  onToggleTheme,
  onToggleGrid,
  onSetGridSize,
  onTogglePreview
}) => {
  const currentTheme = useAppStore((state) => state.currentTheme);
  const gridEnabled = useAppStore((state) => state.gridEnabled);
  const gridSize = useAppStore((state) => state.gridSize);

  return (
    <header className="app-header" style={{
      backgroundColor: currentTheme === 'dark' ? '#1e1e1e' : '#ffffff',
      padding: '20px 30px',
      boxShadow: currentTheme === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      borderRadius: '0 0 12px 12px',
      marginBottom: '20px',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <h1 style={{ 
          color: currentTheme === 'dark' ? '#e2e8f0' : '#333',
          fontSize: '24px',
          fontWeight: '700',
          margin: 0
        }}>低代码平台</h1>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button 
            onClick={onToggleTheme} 
            style={{ 
              padding: '10px 20px', 
              background: currentTheme === 'dark' ? '#4a5568' : '#e2e8f0', 
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              boxShadow: currentTheme === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
          >
            {currentTheme === 'light' ? '切换到深色主题' : '切换到浅色主题'}
          </button>
          <button 
            onClick={onToggleGrid} 
            style={{ 
              padding: '10px 20px', 
              background: currentTheme === 'dark' ? '#4a5568' : '#e2e8f0', 
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              boxShadow: currentTheme === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
          >
            {gridEnabled ? '禁用网格' : '启用网格'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ color: currentTheme === 'dark' ? '#e2e8f0' : '#333', fontWeight: '500' }}>网格大小:</label>
            <input
              type="number"
              min="5"
              max="50"
              value={gridSize}
              onChange={(e) => onSetGridSize(parseInt(e.target.value) || 20)}
              style={{
                width: '70px',
                padding: '8px 12px',
                border: `1px solid ${currentTheme === 'dark' ? '#4a5568' : '#e2e8f0'}`,
                borderRadius: '8px',
                backgroundColor: currentTheme === 'dark' ? '#2d3748' : 'white',
                color: currentTheme === 'dark' ? '#e2e8f0' : '#333',
                boxShadow: currentTheme === 'dark' ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease'
              }}
            />
          </div>
          <button 
            onClick={onUndo} 
            style={{ 
              padding: '10px 20px', 
              background: currentTheme === 'dark' ? '#4a5568' : '#e2e8f0', 
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              boxShadow: currentTheme === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
          >
            撤销 (Ctrl+Z)
          </button>
          <button 
            onClick={onRedo} 
            style={{ 
              padding: '10px 20px', 
              background: currentTheme === 'dark' ? '#4a5568' : '#e2e8f0', 
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              boxShadow: currentTheme === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
          >
            重做 (Ctrl+Y)
          </button>
          <button 
            onClick={onCopy} 
            style={{ 
              padding: '10px 20px', 
              background: currentTheme === 'dark' ? '#4a5568' : '#e2e8f0', 
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              boxShadow: currentTheme === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
          >
            复制组件 (Ctrl+C)
          </button>
          <button 
            onClick={onPaste} 
            style={{ 
              padding: '10px 20px', 
              background: currentTheme === 'dark' ? '#4a5568' : '#e2e8f0', 
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              boxShadow: currentTheme === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
          >
            粘贴组件 (Ctrl+V)
          </button>
          <button 
            onClick={onSave} 
            style={{ 
              padding: '10px 20px', 
              background: currentTheme === 'dark' ? '#4a5568' : '#e2e8f0', 
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              boxShadow: currentTheme === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
          >
            保存页面
          </button>
          <button 
            onClick={onLoad} 
            style={{ 
              padding: '10px 20px', 
              background: currentTheme === 'dark' ? '#4a5568' : '#e2e8f0', 
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              boxShadow: currentTheme === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
          >
            加载页面
          </button>
          <button 
            onClick={onTogglePreview} 
            style={{ 
              padding: '10px 20px', 
              background: currentTheme === 'dark' ? '#4a5568' : '#e2e8f0', 
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              boxShadow: currentTheme === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
          >
            {isPreviewMode ? '退出预览' : '预览页面'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;