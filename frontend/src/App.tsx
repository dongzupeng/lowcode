import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState, useEffect } from 'react';
import DraggableComponent from './components/DraggableComponent';
import Canvas from './components/Canvas';
import PropertyEditor from './components/PropertyEditor';
import { MessageProvider, useMessage } from './components/Message';
import Header from './components/Header';
import PreviewCanvas from './components/PreviewCanvas';
import useAppStore from './store/useAppStore';
import './App.css';

function AppContent() {
  const { showMessage } = useMessage();
  const savePage = useAppStore((state) => state.savePage);
  const loadPage = useAppStore((state) => state.loadPage);
  const copyComponent = useAppStore((state) => state.copyComponent);
  const pasteComponent = useAppStore((state) => state.pasteComponent);
  const undo = useAppStore((state) => state.undo);
  const redo = useAppStore((state) => state.redo);
  const currentTheme = useAppStore((state) => state.currentTheme);
  const setCurrentTheme = useAppStore((state) => state.setCurrentTheme);
  const gridEnabled = useAppStore((state) => state.gridEnabled);
  const gridSize = useAppStore((state) => state.gridSize);
  const toggleGrid = useAppStore((state) => state.toggleGrid);
  const setGridSize = useAppStore((state) => state.setGridSize);
  const selectedComponentId = useAppStore((state) => state.selectedComponentId);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleSave = async () => {
    try {
      const result = await savePage();
      if (result) {
        showMessage('页面保存成功！', { type: 'success' });
      } else {
        showMessage('页面保存失败！', { type: 'error' });
      }
    } catch (error) {
      showMessage('页面保存失败！', { type: 'error' });
    }
  };

  const handleLoad = async () => {
    try {
      const result = await loadPage();
      if (result) {
        showMessage('页面加载成功！', { type: 'success' });
      } else {
        showMessage('页面加载失败！', { type: 'error' });
      }
    } catch (error) {
      showMessage('页面加载失败！', { type: 'error' });
    }
  };

  // 处理复制组件
  const handleCopy = () => {
    if (selectedComponentId) {
      copyComponent(selectedComponentId);
      showMessage('组件复制成功！', { type: 'success' });
    } else {
      showMessage('请先选择一个组件！', { type: 'warning' });
    }
  };

  // 处理粘贴组件
  const handlePaste = () => {
    pasteComponent();
    showMessage('组件粘贴成功！', { type: 'success' });
  };

  // 处理预览模式切换
  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  // 处理撤销
  const handleUndo = () => {
    undo();
    showMessage('撤销操作成功！', { type: 'success' });
  };

  // 处理重做
  const handleRedo = () => {
    redo();
    showMessage('重做操作成功！', { type: 'success' });
  };

  // 处理主题切换
  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    showMessage(`已切换到${newTheme === 'light' ? '浅色' : '深色'}主题！`, { type: 'success' });
  };

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 检查事件目标是否是输入字段
      const target = e.target as HTMLElement;
      const isInputElement = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      
      // 只有当不是输入字段时才执行全局快捷键
      if (!isInputElement) {
        // 复制: Ctrl+C
        if (e.ctrlKey && e.key === 'c') {
          e.preventDefault();
          handleCopy();
        }
        // 粘贴: Ctrl+V
        if (e.ctrlKey && e.key === 'v') {
          e.preventDefault();
          handlePaste();
        }
        // 撤销: Ctrl+Z
        if (e.ctrlKey && e.key === 'z') {
          e.preventDefault();
          handleUndo();
        }
        // 重做: Ctrl+Y 或 Ctrl+Shift+Z
        if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
          e.preventDefault();
          handleRedo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponentId, copyComponent, pasteComponent, undo, redo]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`app ${currentTheme}`} style={{
        backgroundColor: currentTheme === 'dark' ? '#121212' : '#f8f9fa',
        color: currentTheme === 'dark' ? '#e2e8f0' : '#333333',
        minHeight: '100vh',
        transition: 'all 0.3s ease'
      }}>
        <Header
          isPreviewMode={isPreviewMode}
          onSave={handleSave}
          onLoad={handleLoad}
          onCopy={handleCopy}
          onPaste={handlePaste}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onToggleTheme={toggleTheme}
          onToggleGrid={toggleGrid}
          onSetGridSize={setGridSize}
          onTogglePreview={togglePreview}
        />
        {isPreviewMode ? (
          <PreviewCanvas onExitPreview={togglePreview} />
        ) : (
          <div className="app-content" style={{
            display: 'flex',
            flex: 1,
            gap: '20px',
            padding: '20px',
            transition: 'all 0.3s ease'
          }}>
            <div className="left-panel" style={{
              flex: 0.2,
              backgroundColor: currentTheme === 'dark' ? '#1e1e1e' : '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: currentTheme === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.3s ease'
            }}>
              <h2 style={{ 
                color: currentTheme === 'dark' ? '#e2e8f0' : '#333',
                marginBottom: '20px',
                fontSize: '18px',
                fontWeight: '600'
              }}>组件库</h2>
              <DraggableComponent type="button" label="按钮" />
              <DraggableComponent type="text" label="文本" />
              <DraggableComponent type="input" label="输入框" />
              <DraggableComponent type="div" label="容器" />
              <DraggableComponent type="image" label="图片" />
              <DraggableComponent type="checkbox" label="复选框" />
              <DraggableComponent type="radio" label="单选按钮" />
              <DraggableComponent type="select" label="下拉选择" />
              <DraggableComponent type="textarea" label="文本区域" />
              <DraggableComponent type="heading" label="标题" />
              <DraggableComponent type="divider" label="分隔线" />
              <DraggableComponent type="card" label="卡片" />
            </div>
            <div className="center-panel" style={{
              flex: 0.5,
              backgroundColor: currentTheme === 'dark' ? '#1e1e1e' : '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: currentTheme === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.3s ease'
            }}>
              <h2 style={{ 
                color: currentTheme === 'dark' ? '#e2e8f0' : '#333',
                marginBottom: '20px',
                fontSize: '18px',
                fontWeight: '600'
              }}>画布</h2>
              <Canvas />
            </div>
            <div className="right-panel" style={{
              flex: 0.3,
              backgroundColor: currentTheme === 'dark' ? '#1e1e1e' : '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: currentTheme === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.3s ease'
            }}>
              <PropertyEditor />
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}

function App() {
  return (
    <MessageProvider>
      <AppContent />
    </MessageProvider>
  );
}

export default App;