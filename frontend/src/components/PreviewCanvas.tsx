import React from 'react';
import useAppStore from '../store/useAppStore';
import type { Component } from '../types';

const PreviewCanvas: React.FC<{ onExitPreview: () => void }> = ({ onExitPreview }) => {
  const components = useAppStore((state) => state.components);
  const canvasSize = useAppStore((state) => state.canvasSize);
  const currentBreakpoint = useAppStore((state) => state.currentBreakpoint);
  const currentTheme = useAppStore((state) => state.currentTheme);

  const renderComponent = (component: Component) => {
    // 合并基础属性和响应式属性
    const baseProps = component.props;
    const responsiveProps = component.responsive?.[currentBreakpoint] || {};
    const mergedProps = { ...baseProps, ...responsiveProps };
    
    switch (component.type) {
      case 'button':
        return (
          <div
            key={component.id}
            style={{
              position: 'absolute',
              left: mergedProps.x,
              top: mergedProps.y,
              width: mergedProps.width,
              height: mergedProps.height
            }}
          >
            <button 
              style={{
                width: '100%',
                height: '100%',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {mergedProps.text}
            </button>
          </div>
        );
      case 'text':
        return (
          <div
            key={component.id}
            style={{
              position: 'absolute',
              left: mergedProps.x,
              top: mergedProps.y,
              width: mergedProps.width,
              height: mergedProps.height,
              padding: '8px',
              fontSize: '14px',
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333'
            }}
          >
            {mergedProps.text}
          </div>
        );
      case 'input':
        return (
          <div
            key={component.id}
            style={{
              position: 'absolute',
              left: mergedProps.x,
              top: mergedProps.y,
              width: mergedProps.width,
              height: mergedProps.height
            }}
          >
            <input
              style={{
                width: '100%',
                height: '100%',
                padding: '8px',
                border: `1px solid ${currentTheme === 'dark' ? '#718096' : '#ddd'}`,
                borderRadius: '4px',
                backgroundColor: currentTheme === 'dark' ? '#4a5568' : 'white',
                color: currentTheme === 'dark' ? '#e2e8f0' : '#333'
              }}
              placeholder={mergedProps.text}
            />
          </div>
        );
      case 'div':
        return (
          <div
            key={component.id}
            style={{
              position: 'absolute',
              left: mergedProps.x,
              top: mergedProps.y,
              width: mergedProps.width,
              height: mergedProps.height,
              border: `1px solid ${currentTheme === 'dark' ? '#718096' : '#ddd'}`,
              padding: '16px',
              backgroundColor: currentTheme === 'dark' ? '#2d3748' : '#ffffff',
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333'
            }}
          >
            {mergedProps.text}
          </div>
        );
      case 'image':
        return (
          <div
            key={component.id}
            style={{
              position: 'absolute',
              left: mergedProps.x,
              top: mergedProps.y,
              width: mergedProps.width,
              height: mergedProps.height
            }}
          >
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
            key={component.id}
            style={{
              position: 'absolute',
              left: mergedProps.x,
              top: mergedProps.y,
              width: mergedProps.width,
              height: mergedProps.height,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333'
            }}
          >
            <input 
              type="checkbox" 
              checked={mergedProps.checked || false}
            />
            <span>{mergedProps.text || 'Checkbox'}</span>
          </div>
        );
      case 'radio':
        return (
          <div
            key={component.id}
            style={{
              position: 'absolute',
              left: mergedProps.x,
              top: mergedProps.y,
              width: mergedProps.width,
              height: mergedProps.height,
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
            />
            <span>{mergedProps.text || 'Radio'}</span>
          </div>
        );
      case 'select':
        return (
          <div
            key={component.id}
            style={{
              position: 'absolute',
              left: mergedProps.x,
              top: mergedProps.y,
              width: mergedProps.width,
              height: mergedProps.height
            }}
          >
            <select 
              style={{
                width: '100%',
                height: '100%',
                padding: '8px',
                border: `1px solid ${currentTheme === 'dark' ? '#718096' : '#ddd'}`,
                borderRadius: '4px',
                backgroundColor: currentTheme === 'dark' ? '#4a5568' : 'white',
                color: currentTheme === 'dark' ? '#e2e8f0' : '#333'
              }}
              value={mergedProps.value || ''}
            >
              <option value="">请选择</option>
              <option value="option1">选项1</option>
              <option value="option2">选项2</option>
              <option value="option3">选项3</option>
            </select>
          </div>
        );
      case 'textarea':
        return (
          <div
            key={component.id}
            style={{
              position: 'absolute',
              left: mergedProps.x,
              top: mergedProps.y,
              width: mergedProps.width,
              height: mergedProps.height
            }}
          >
            <textarea 
              style={{
                width: '100%',
                height: '100%',
                padding: '8px',
                border: `1px solid ${currentTheme === 'dark' ? '#718096' : '#ddd'}`,
                borderRadius: '4px',
                backgroundColor: currentTheme === 'dark' ? '#4a5568' : 'white',
                color: currentTheme === 'dark' ? '#e2e8f0' : '#333',
                resize: 'none'
              }}
              placeholder={mergedProps.placeholder || '请输入文本'}
              value={mergedProps.text || ''}
            />
          </div>
        );
      case 'heading':
        return (
          <div
            key={component.id}
            style={{
              position: 'absolute',
              left: mergedProps.x,
              top: mergedProps.y,
              width: mergedProps.width,
              height: mergedProps.height
            }}
          >
            <h3 style={{ margin: 0, fontSize: '18px', color: currentTheme === 'dark' ? '#e2e8f0' : '#333' }}>
              {mergedProps.text || '标题'}
            </h3>
          </div>
        );
      case 'divider':
        return (
          <div
            key={component.id}
            style={{
              position: 'absolute',
              left: mergedProps.x,
              top: mergedProps.y,
              width: mergedProps.width,
              height: mergedProps.height,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <hr style={{ width: '100%', borderColor: currentTheme === 'dark' ? '#4a5568' : '#ddd' }} />
          </div>
        );
      case 'card':
        return (
          <div
            key={component.id}
            style={{
              position: 'absolute',
              left: mergedProps.x,
              top: mergedProps.y,
              width: mergedProps.width,
              height: mergedProps.height,
              border: 'none',
              borderRadius: '4px',
              overflow: 'hidden',
              backgroundColor: currentTheme === 'dark' ? '#2d3748' : 'white',
              boxSizing: 'border-box',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* 封面图片 */}
            <div style={{ 
              width: '100%', 
              height: '250px',
              overflow: 'hidden'
            }}>
              <img 
                src={mergedProps.coverImage || 'https://via.placeholder.com/400x300'} 
                alt="封面" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
            
            {/* 内容区域 */}
            <div style={{ 
              flex: 1, 
              padding: '14px', 
              display: 'flex', 
              flexDirection: 'column',
              backgroundColor: currentTheme === 'dark' ? '#2d3748' : 'white'
            }}>
              {/* 标题 */}
              <h3 style={{ 
                margin: '0 0 6px 0', 
                color: currentTheme === 'dark' ? '#e2e8f0' : '#333',
                fontSize: '16px',
                fontWeight: '500',
                lineHeight: '1.2'
              }}>
                {mergedProps.title || 'Europe Street beat'}
              </h3>
              
              {/* 描述信息 */}
              <p style={{ 
                margin: '0',
                color: currentTheme === 'dark' ? '#a0aec0' : '#666',
                fontSize: '14px',
                lineHeight: '1.4'
              }}>
                {mergedProps.description || mergedProps.text || 'www.instagram.com'}
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="preview-mode">
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button 
          onClick={onExitPreview} 
          style={{ 
            padding: '10px 20px', 
            background: '#ff6b6b', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          退出预览
        </button>
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: '20px',
        position: 'relative'
      }}>
        <div 
          style={{
            width: canvasSize.width,
            height: canvasSize.height,
            border: `1px solid ${currentTheme === 'dark' ? '#4a5568' : '#ddd'}`,
            backgroundColor: currentTheme === 'dark' ? '#2d3748' : '#f9f9f9',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {components.map((component) => renderComponent(component))}
        </div>
      </div>
    </div>
  );
};

export default PreviewCanvas;