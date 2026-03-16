import { useDrag } from 'react-dnd';
import { useRef } from 'react';
import useAppStore from '../store/useAppStore';
import type { ComponentType } from '../types';

interface DraggableComponentProps {
  type: ComponentType;
  label: string;
}

const DraggableComponent = ({ type, label }: DraggableComponentProps) => {
  const currentTheme = useAppStore((state) => state.currentTheme);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  const dragRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={(node) => {
        dragRef.current = node;
        drag(node);
      }}
      className="draggable-component"
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: currentTheme === 'dark' ? '#2d3748' : '#f8f9fa',
        border: `1px solid ${currentTheme === 'dark' ? '#4a5568' : '#e2e8f0'}`,
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '10px',
        cursor: 'grab',
        boxShadow: currentTheme === 'dark' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : '0 2px 4px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s ease',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.cursor = 'grabbing';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.cursor = 'grab';
      }}
    >
      <span style={{ 
        color: currentTheme === 'dark' ? '#e2e8f0' : '#333',
        fontWeight: '500'
      }}>{label}</span>
      <span style={{ 
        fontSize: '12px', 
        color: currentTheme === 'dark' ? '#a0aec0' : '#666',
        backgroundColor: currentTheme === 'dark' ? '#4a5568' : '#e2e8f0',
        padding: '2px 8px',
        borderRadius: '10px'
      }}>{type}</span>
    </div>
  );
};

export default DraggableComponent;