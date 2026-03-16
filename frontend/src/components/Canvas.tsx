import { useDrop } from 'react-dnd';
import { useRef, useState, useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import type { ComponentType } from '../types';
import CanvasComponent from './CanvasComponent';

const Canvas = () => {
  const components = useAppStore((state) => state.components);
  const addComponent = useAppStore((state) => state.addComponent);
  const selectComponent = useAppStore((state) => state.selectComponent);
  const updateCanvasSize = useAppStore((state) => state.updateCanvasSize);
  const canvasSize = useAppStore((state) => state.canvasSize);
  const gridEnabled = useAppStore((state) => state.gridEnabled);
  const gridSize = useAppStore((state) => state.gridSize);
  const currentTheme = useAppStore((state) => state.currentTheme);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // 渲染网格
  const renderGrid = () => {
    if (!gridEnabled) return null;
    
    const gridLines = [];
    const { width, height } = canvasSize;
    
    // 绘制垂直线
    for (let x = 0; x <= width; x += gridSize) {
      gridLines.push(
        <div
          key={`v-${x}`}
          style={{
            position: 'absolute',
            left: `${x}px`,
            top: 0,
            width: '1px',
            height: '100%',
            backgroundColor: currentTheme === 'dark' ? '#4a5568' : '#e0e0e0',
            pointerEvents: 'none',
          }}
        />
      );
    }
    
    // 绘制水平线
    for (let y = 0; y <= height; y += gridSize) {
      gridLines.push(
        <div
          key={`h-${y}`}
          style={{
            position: 'absolute',
            top: `${y}px`,
            left: 0,
            width: '100%',
            height: '1px',
            backgroundColor: currentTheme === 'dark' ? '#4a5568' : '#e0e0e0',
            pointerEvents: 'none',
          }}
        />
      );
    }
    
    return gridLines;
  };

  // 获取画布实际尺寸
  const handleUpdateCanvasSize = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      updateCanvasSize({ width: rect.width, height: rect.height });
    }
  };

  // 组件挂载和窗口大小变化时更新画布尺寸
  useEffect(() => {
    handleUpdateCanvasSize();
    window.addEventListener('resize', handleUpdateCanvasSize);
    return () => window.removeEventListener('resize', handleUpdateCanvasSize);
  }, []);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item: { type: ComponentType }, monitor) => {
      const offset = monitor.getSourceClientOffset();
      if (offset && canvasRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const x = offset.x - canvasRect.left;
        const y = offset.y - canvasRect.top;

        // 确保组件初始位置在画布内
        const componentWidth = 100;
        const componentHeight = 40;
        const centerX = x - componentWidth / 2;
        const centerY = y - componentHeight / 2;
        
        // 边界控制
        const boundedX = Math.max(0, Math.min(canvasRect.width - componentWidth, centerX));
        const boundedY = Math.max(0, Math.min(canvasRect.height - componentHeight, centerY));

        const newComponent = {
          id: `component-${Date.now()}`,
          type: item.type,
          props: {
            id: `component-${Date.now()}`,
            type: item.type,
            x: boundedX,
            y: boundedY,
            width: componentWidth,
            height: componentHeight,
            text: item.type === 'button' ? 'Button' : 
                  item.type === 'text' ? 'Text' : 
                  item.type === 'input' ? 'Input' : 'Div',
          },
        };

        addComponent(newComponent);
        setIsDragging(false);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleCanvasClick = () => {
    // 只有当不是拖动状态时才取消选中
    if (!isDragging) {
      selectComponent(null);
    }
  };

  return (
    <div
      ref={(node) => {
        canvasRef.current = node;
        drop(node);
      }}
      className="canvas-container"
      style={{
        backgroundColor: isOver ? (currentTheme === 'dark' ? '#2d3748' : '#f0f8ff') : (currentTheme === 'dark' ? '#2d3748' : 'white'),
        borderColor: isOver ? '#667eea' : (currentTheme === 'dark' ? '#4a5568' : '#ccc'),
      }}
      onClick={handleCanvasClick}
    >
      {/* 渲染网格 */}
      {renderGrid()}
      
      {components.map((component) => (
        <CanvasComponent 
          key={component.id} 
          component={component} 
          canvasWidth={canvasSize.width} 
          canvasHeight={canvasSize.height} 
        />
      ))}
    </div>
  );
};

export default Canvas;