import { useDrop } from 'react-dnd';
import { useRef, useState } from 'react';
import useAppStore from '../store/useAppStore';
import type { Component } from '../types';

interface CanvasComponentProps {
  component: Component;
  canvasWidth?: number;
  canvasHeight?: number;
}

const CanvasComponent = ({ component, canvasWidth = 1000, canvasHeight = 600 }: CanvasComponentProps) => {
  const selectedComponentId = useAppStore((state) => state.selectedComponentId);
  const currentBreakpoint = useAppStore((state) => state.currentBreakpoint);
  const currentTheme = useAppStore((state) => state.currentTheme);
  const gridEnabled = useAppStore((state) => state.gridEnabled);
  const gridSize = useAppStore((state) => state.gridSize);
  const updateComponent = useAppStore((state) => state.updateComponent);
  const updateResponsiveProps = useAppStore((state) => state.updateResponsiveProps);
  const selectComponent = useAppStore((state) => state.selectComponent);
  const deleteComponent = useAppStore((state) => state.deleteComponent);
  const componentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(component.props.text || '');
  const [alignmentLines, setAlignmentLines] = useState<Array<{type: string, position: number, color: string}>>([]);
  
  // 网格吸附函数
  const snapToGrid = (value: number) => {
    if (gridEnabled) {
      return Math.round(value / gridSize) * gridSize;
    }
    return value;
  };

  const isSelected = selectedComponentId === component.id;
  
  // 合并基础属性和响应式属性
  const getMergedProps = () => {
    const baseProps = component.props;
    const responsiveProps = component.responsive?.[currentBreakpoint] || {};
    return { ...baseProps, ...responsiveProps };
  };
  
  const mergedProps = getMergedProps();

  const [, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item: { id: string }) => {
      if (item.id !== component.id) {
        // 可以实现组件嵌套逻辑
      }
    },
  }));



  const handleMouseDown = (e: React.MouseEvent) => {
    // 检查是否点击了删除按钮，如果是则不执行拖拽逻辑
    if (e.target instanceof HTMLElement && e.target.classList.contains('delete-button')) {
      return;
    }
    
    e.stopPropagation();
    selectComponent(component.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const startComponentX = mergedProps.x;
    const startComponentY = mergedProps.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      moveEvent.stopPropagation();
      setIsDragging(true);
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      // 边界控制 - 确保组件在画布内
      
      let newX = startComponentX + deltaX;
      let newY = startComponentY + deltaY;
      
      // 应用网格吸附
      newX = snapToGrid(newX);
      newY = snapToGrid(newY);
      
      // 确保组件的宽度和高度是正数
      const componentWidth = Math.max(0, mergedProps.width || 0);
      const componentHeight = Math.max(0, mergedProps.height || 0);
      
      // 确保画布宽度和高度是正数
      const validCanvasWidth = Math.max(0, canvasWidth || 0);
      const validCanvasHeight = Math.max(0, canvasHeight || 0);
      
      // 确保组件不会超出画布左边界
      newX = Math.max(0, newX);
      // 确保组件不会超出画布右边界
      newX = Math.min(validCanvasWidth - componentWidth, newX);
      // 确保组件不会超出画布上边界
      newY = Math.max(0, newY);
      // 确保组件不会超出画布下边界
      newY = Math.min(validCanvasHeight - componentHeight, newY);
      
      // 计算对齐辅助线
      const lines = calculateAlignmentLines(newX, newY, componentWidth, componentHeight);
      setAlignmentLines(lines);
      
      // 根据当前断点决定更新基础属性还是响应式属性
      if (currentBreakpoint === 'desktop') {
        updateComponent(component.id, {
          x: newX,
          y: newY,
        });
      } else {
        updateResponsiveProps(component.id, currentBreakpoint, {
          x: newX,
          y: newY,
        });
      }
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      upEvent.stopPropagation();
      document.removeEventListener('mousemove', handleMouseMove, { capture: true });
      document.removeEventListener('mouseup', handleMouseUp, { capture: true });
      // 确保释放鼠标时组件仍然被选中
      selectComponent(component.id);
      setIsDragging(false);
      // 清除对齐辅助线
      setAlignmentLines([]);
    };

    // 使用capture模式添加事件监听器，确保事件能够被正确捕获
    document.addEventListener('mousemove', handleMouseMove, { capture: true });
    document.addEventListener('mouseup', handleMouseUp, { capture: true });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectComponent(component.id); // 确保组件被选中，显示右侧属性编辑器
    // 单击进入编辑模式，允许在控件上直接编辑文本
    setIsEditing(true);
    setEditValue(mergedProps.text || '');
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleEditSubmit = () => {
    // 根据当前断点决定更新基础属性还是响应式属性
    if (currentBreakpoint === 'desktop') {
      updateComponent(component.id, { text: editValue });
    } else {
      updateResponsiveProps(component.id, currentBreakpoint, { text: editValue });
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditValue(mergedProps.text || '');
  };

  // 计算对齐辅助线
  const calculateAlignmentLines = (x: number, y: number, width: number, height: number) => {
    const lines: Array<{type: string, position: number, color: string}> = [];
    const components = useAppStore.getState().components;
    const tolerance = 5; // 对齐容差
    
    // 计算当前组件的中心、边缘位置
    const currentCenterX = x + width / 2;
    const currentCenterY = y + height / 2;
    const currentLeft = x;
    const currentRight = x + width;
    const currentTop = y;
    const currentBottom = y + height;
    
    // 检查与其他组件的对齐关系
    for (const otherComponent of components) {
      if (otherComponent.id === component.id) continue;
      
      const otherWidth = otherComponent.props.width || 0;
      const otherHeight = otherComponent.props.height || 0;
      const otherX = otherComponent.props.x || 0;
      const otherY = otherComponent.props.y || 0;
      
      // 计算其他组件的中心、边缘位置
      const otherCenterX = otherX + otherWidth / 2;
      const otherCenterY = otherY + otherHeight / 2;
      const otherLeft = otherX;
      const otherRight = otherX + otherWidth;
      const otherTop = otherY;
      const otherBottom = otherY + otherHeight;
      
      // 检查水平对齐
      if (Math.abs(currentLeft - otherLeft) < tolerance) {
        lines.push({ type: 'vertical', position: currentLeft, color: '#667eea' });
      }
      if (Math.abs(currentRight - otherRight) < tolerance) {
        lines.push({ type: 'vertical', position: currentRight, color: '#667eea' });
      }
      if (Math.abs(currentCenterX - otherCenterX) < tolerance) {
        lines.push({ type: 'vertical', position: currentCenterX, color: '#667eea' });
      }
      
      // 检查垂直对齐
      if (Math.abs(currentTop - otherTop) < tolerance) {
        lines.push({ type: 'horizontal', position: currentTop, color: '#667eea' });
      }
      if (Math.abs(currentBottom - otherBottom) < tolerance) {
        lines.push({ type: 'horizontal', position: currentBottom, color: '#667eea' });
      }
      if (Math.abs(currentCenterY - otherCenterY) < tolerance) {
        lines.push({ type: 'horizontal', position: currentCenterY, color: '#667eea' });
      }
    }
    
    return lines;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteComponent(component.id);
  };

  const renderComponent = () => {
    if (isEditing) {
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '8px', backgroundColor: currentTheme === 'dark' ? '#2d3748' : 'white' }}>
          <input
            type="text"
            value={editValue}
            onChange={handleEditChange}
            onBlur={handleEditSubmit}
            onKeyPress={(e) => e.key === 'Enter' && handleEditSubmit()}
            style={{ 
              width: '80%', 
              padding: '4px', 
              border: '1px solid #667eea',
              backgroundColor: currentTheme === 'dark' ? '#4a5568' : 'white',
              color: currentTheme === 'dark' ? 'white' : 'black'
            }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleEditSubmit} style={{ padding: '2px 8px', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px' }}>保存</button>
            <button onClick={handleEditCancel} style={{ padding: '2px 8px', background: currentTheme === 'dark' ? '#718096' : '#ccc', color: currentTheme === 'dark' ? 'white' : 'black', border: 'none', borderRadius: '4px' }}>取消</button>
          </div>
        </div>
      );
    }

    const handlePropertyChange = (property: string, value: any) => {
      if (currentBreakpoint === 'desktop') {
        updateComponent(component.id, { [property]: value });
      } else {
        updateResponsiveProps(component.id, currentBreakpoint, { [property]: value });
      }
    };

    switch (component.type) {
      case 'button':
        return (
          <button 
            className="canvas-button" 
            onClick={handleClick}
            style={{
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              width: '100%',
              height: '100%'
            }}
          >
            {mergedProps.text}
          </button>
        );
      case 'text':
        return (
          <div 
            className="canvas-text" 
            onClick={handleClick}
            style={{
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333',
              fontSize: '14px',
              padding: '8px',
              width: '100%',
              height: '100%',
              boxSizing: 'border-box'
            }}
          >
            {mergedProps.text}
          </div>
        );
      case 'input':
        return (
          <input
            className="canvas-input"
            placeholder={mergedProps.text}
            onClick={handleClick}
            style={{
              width: '100%',
              height: '100%',
              padding: '8px',
              border: `1px solid ${currentTheme === 'dark' ? '#718096' : '#ddd'}`,
              borderRadius: '4px',
              backgroundColor: currentTheme === 'dark' ? '#4a5568' : 'white',
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333',
              boxSizing: 'border-box'
            }}
          />
        );
      case 'div':
        return (
          <div 
            className="canvas-div" 
            onClick={handleClick}
            style={{
              width: '100%',
              height: '100%',
              border: `1px solid ${currentTheme === 'dark' ? '#718096' : '#ddd'}`,
              padding: '16px',
              backgroundColor: currentTheme === 'dark' ? '#2d3748' : 'white',
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333',
              boxSizing: 'border-box'
            }}
          >
            {mergedProps.text}
          </div>
        );
      case 'image':
        return (
          <div className="canvas-image" onClick={handleClick}>
            <img 
              src={mergedProps.src || 'https://via.placeholder.com/100x100'} 
              alt={mergedProps.alt || 'Image'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        );
      case 'checkbox':
        return (
          <div 
            className="canvas-checkbox" 
            onClick={handleClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333'
            }}
          >
            <input 
              type="checkbox" 
              checked={mergedProps.checked || false}
              onChange={(e) => handlePropertyChange('checked', e.target.checked)}
            />
            <span>{mergedProps.text || 'Checkbox'}</span>
          </div>
        );
      case 'radio':
        return (
          <div 
            className="canvas-radio" 
            onClick={handleClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333'
            }}
          >
            <input 
              type="radio" 
              name={mergedProps.name || 'radio'}
              checked={mergedProps.checked || false}
              onChange={(e) => handlePropertyChange('checked', e.target.checked)}
            />
            <span>{mergedProps.text || 'Radio'}</span>
          </div>
        );
      case 'select':
        return (
          <select 
            className="canvas-select" 
            onClick={handleClick}
            value={mergedProps.value || ''}
            onChange={(e) => handlePropertyChange('value', e.target.value)}
            style={{
              width: '100%',
              height: '100%',
              padding: '8px',
              border: `1px solid ${currentTheme === 'dark' ? '#718096' : '#ddd'}`,
              borderRadius: '4px',
              backgroundColor: currentTheme === 'dark' ? '#4a5568' : 'white',
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333',
              boxSizing: 'border-box'
            }}
          >
            <option value="">请选择</option>
            <option value="option1">选项1</option>
            <option value="option2">选项2</option>
            <option value="option3">选项3</option>
          </select>
        );
      case 'textarea':
        return (
          <textarea 
            className="canvas-textarea" 
            onClick={handleClick}
            placeholder={mergedProps.placeholder || '请输入文本'}
            value={mergedProps.text || ''}
            onChange={(e) => handlePropertyChange('text', e.target.value)}
            style={{
              width: '100%',
              height: '100%',
              padding: '8px',
              border: `1px solid ${currentTheme === 'dark' ? '#718096' : '#ddd'}`,
              borderRadius: '4px',
              backgroundColor: currentTheme === 'dark' ? '#4a5568' : 'white',
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333',
              resize: 'none',
              boxSizing: 'border-box'
            }}
          />
        );
      case 'heading':
        return (
          <h3 
            className="canvas-heading" 
            onClick={handleClick}
            style={{
              margin: 0,
              fontSize: '18px',
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333'
            }}
          >
            {mergedProps.text || '标题'}
          </h3>
        );
      case 'divider':
        return (
          <div className="canvas-divider" onClick={handleClick}>
            <hr style={{ borderColor: currentTheme === 'dark' ? '#4a5568' : '#ddd' }} />
          </div>
        );
      case 'card':
        return (
          <div 
            className="canvas-card" 
            onClick={handleClick}
            style={{
              width: '100%',
              height: '100%',
              border: `1px solid ${currentTheme === 'dark' ? '#718096' : '#ddd'}`,
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: currentTheme === 'dark' ? '#2d3748' : 'white',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ 
              padding: '12px', 
              borderBottom: `1px solid ${currentTheme === 'dark' ? '#4a5568' : '#eee'}`,
              backgroundColor: currentTheme === 'dark' ? '#2d3748' : '#f8f9fa',
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333'
            }}>
              {mergedProps.title || '卡片标题'}
            </div>
            <div style={{ 
              padding: '12px',
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333'
            }}>
              {mergedProps.text || '卡片内容'}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* 渲染对齐辅助线 */}
      {isDragging && alignmentLines.map((line, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            ...(line.type === 'vertical' 
              ? {
                  left: line.position,
                  top: 0,
                  width: '1px',
                  height: '100%',
                }
              : {
                  top: line.position,
                  left: 0,
                  width: '100%',
                  height: '1px',
                }),
            backgroundColor: line.color,
            zIndex: 1000,
            pointerEvents: 'none',
          }}
        />
      ))}
      <div
        ref={(node) => {
          componentRef.current = node;
          drop(node);
        }}
        className="canvas-component"
        style={{
          position: 'absolute',
          left: mergedProps.x,
          top: mergedProps.y,
          width: mergedProps.width,
          height: mergedProps.height,
          opacity: isDragging ? 0.5 : 1,
          zIndex: isSelected ? 10 : 1,
          border: isSelected ? '2px solid #667eea' : 'none',
          backgroundColor: currentTheme === 'dark' ? 'transparent' : 'transparent',
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          {renderComponent()}
          {isSelected && (
            <div
              className="delete-button"
              onClick={handleDelete}
              style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#ff4757',
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                fontSize: '16px',
                zIndex: 100,
                userSelect: 'none'
              }}
            >
              ×
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CanvasComponent;