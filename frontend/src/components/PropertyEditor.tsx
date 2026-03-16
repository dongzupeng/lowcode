import useAppStore from '../store/useAppStore';
import type { Breakpoint } from '../types';

const PropertyEditor = () => {
  const selectedComponentId = useAppStore((state) => state.selectedComponentId);
  const components = useAppStore((state) => state.components);
  const currentBreakpoint = useAppStore((state) => state.currentBreakpoint);
  const currentTheme = useAppStore((state) => state.currentTheme);
  const updateComponent = useAppStore((state) => state.updateComponent);
  const updateResponsiveProps = useAppStore((state) => state.updateResponsiveProps);
  const setCurrentBreakpoint = useAppStore((state) => state.setCurrentBreakpoint);
  const moveComponentUp = useAppStore((state) => state.moveComponentUp);
  const moveComponentDown = useAppStore((state) => state.moveComponentDown);
  const moveComponentToTop = useAppStore((state) => state.moveComponentToTop);
  const moveComponentToBottom = useAppStore((state) => state.moveComponentToBottom);

  const selectedComponent = components.find((component) => component.id === selectedComponentId);

  if (!selectedComponent) {
    return (
      <div className="property-editor" style={{
        backgroundColor: currentTheme === 'dark' ? '#2d3748' : '#ffffff',
        color: currentTheme === 'dark' ? '#e2e8f0' : '#333333',
        border: `1px solid ${currentTheme === 'dark' ? '#4a5568' : '#e0e0e0'}`
      }}>
        <h3>属性编辑器</h3>
        <p style={{ color: currentTheme === 'dark' ? '#a0aec0' : '#666', marginTop: '1rem' }}>请选择一个组件来编辑其属性</p>
      </div>
    );
  }

  // 合并基础属性和响应式属性
  const getMergedProps = () => {
    const baseProps = selectedComponent.props;
    const responsiveProps = selectedComponent.responsive?.[currentBreakpoint] || {};
    return { ...baseProps, ...responsiveProps };
  };
  
  const mergedProps = getMergedProps();

  const handleInputChange = (property: string, value: any) => {
    if (selectedComponentId) {
      if (currentBreakpoint === 'desktop') {
        updateComponent(selectedComponentId, { [property]: value });
      } else {
        updateResponsiveProps(selectedComponentId, currentBreakpoint, { [property]: value });
      }
    }
  };

  return (
    <div className="property-editor" style={{
      backgroundColor: currentTheme === 'dark' ? '#2d3748' : '#ffffff',
      color: currentTheme === 'dark' ? '#e2e8f0' : '#333333',
      border: `1px solid ${currentTheme === 'dark' ? '#4a5568' : '#e0e0e0'}`
    }}>
      <h3>属性编辑器</h3>
      
      {/* 响应式布局断点选择器 */}
      <div className="property-group">
        <label className="property-label">响应式断点</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['desktop', 'tablet', 'mobile'] as Breakpoint[]).map((breakpoint) => (
            <button
              key={breakpoint}
              onClick={() => setCurrentBreakpoint(breakpoint)}
              style={{
                padding: '6px 12px',
                background: currentBreakpoint === breakpoint ? '#667eea' : (currentTheme === 'dark' ? '#4a5568' : '#f0f0f0'),
                color: currentBreakpoint === breakpoint ? 'white' : (currentTheme === 'dark' ? '#e2e8f0' : '#333'),
                border: `1px solid ${currentTheme === 'dark' ? '#718096' : '#ddd'}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {breakpoint === 'desktop' ? '桌面' : breakpoint === 'tablet' ? '平板' : '手机'}
            </button>
          ))}
        </div>
      </div>
      
      <div className="property-group">
        <label className="property-label" style={{ color: currentTheme === 'dark' ? '#e2e8f0' : '#333' }}>组件类型: {selectedComponent.type}</label>
      </div>
      <div className="property-group">
        <label className="property-label" style={{ color: currentTheme === 'dark' ? '#e2e8f0' : '#333' }}>X 坐标</label>
        <input
          type="number"
          value={mergedProps.x}
          onChange={(e) => handleInputChange('x', parseInt(e.target.value) || 0)}
          className="property-input"
          style={{
            backgroundColor: currentTheme === 'dark' ? '#4a5568' : '#ffffff',
            color: currentTheme === 'dark' ? '#e2e8f0' : '#333',
            border: `1px solid ${currentTheme === 'dark' ? '#718096' : '#ddd'}`
          }}
        />
      </div>
      <div className="property-group">
        <label className="property-label" style={{ color: currentTheme === 'dark' ? '#e2e8f0' : '#333' }}>Y 坐标</label>
        <input
          type="number"
          value={mergedProps.y}
          onChange={(e) => handleInputChange('y', parseInt(e.target.value) || 0)}
          className="property-input"
          style={{
            backgroundColor: currentTheme === 'dark' ? '#4a5568' : '#ffffff',
            color: currentTheme === 'dark' ? '#e2e8f0' : '#333',
            border: `1px solid ${currentTheme === 'dark' ? '#718096' : '#ddd'}`
          }}
        />
      </div>
      <div className="property-group">
        <label className="property-label" style={{ color: currentTheme === 'dark' ? '#e2e8f0' : '#333' }}>宽度</label>
        <input
          type="number"
          value={mergedProps.width}
          onChange={(e) => handleInputChange('width', parseInt(e.target.value) || 0)}
          className="property-input"
          style={{
            backgroundColor: currentTheme === 'dark' ? '#4a5568' : '#ffffff',
            color: currentTheme === 'dark' ? '#e2e8f0' : '#333',
            border: `1px solid ${currentTheme === 'dark' ? '#718096' : '#ddd'}`
          }}
        />
      </div>
      <div className="property-group">
        <label className="property-label" style={{ color: currentTheme === 'dark' ? '#e2e8f0' : '#333' }}>高度</label>
        <input
          type="number"
          value={mergedProps.height}
          onChange={(e) => handleInputChange('height', parseInt(e.target.value) || 0)}
          className="property-input"
          style={{
            backgroundColor: currentTheme === 'dark' ? '#4a5568' : '#ffffff',
            color: currentTheme === 'dark' ? '#e2e8f0' : '#333',
            border: `1px solid ${currentTheme === 'dark' ? '#718096' : '#ddd'}`
          }}
        />
      </div>
      {mergedProps.text !== undefined && (
        <div className="property-group">
          <label className="property-label" style={{ color: currentTheme === 'dark' ? '#e2e8f0' : '#333' }}>文本</label>
          <input
            type="text"
            value={mergedProps.text || ''}
            onChange={(e) => handleInputChange('text', e.target.value)}
            className="property-input"
            style={{
              backgroundColor: currentTheme === 'dark' ? '#4a5568' : '#ffffff',
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333',
              border: `1px solid ${currentTheme === 'dark' ? '#718096' : '#ddd'}`
            }}
          />
        </div>
      )}
      
      {/* 图片组件属性 */}
      {selectedComponent.type === 'image' && (
        <>
          <div className="property-group">
            <label className="property-label" style={{ color: currentTheme === 'dark' ? '#e2e8f0' : '#333' }}>图片地址</label>
            <input
              type="text"
              value={mergedProps.src || ''}
              onChange={(e) => handleInputChange('src', e.target.value)}
              className="property-input"
              placeholder="请输入图片URL"
              style={{
                backgroundColor: currentTheme === 'dark' ? '#4a5568' : '#ffffff',
                color: currentTheme === 'dark' ? '#e2e8f0' : '#333',
                border: `1px solid ${currentTheme === 'dark' ? '#718096' : '#ddd'}`
              }}
            />
          </div>
          <div className="property-group">
            <label className="property-label" style={{ color: currentTheme === 'dark' ? '#e2e8f0' : '#333' }}>图片描述</label>
            <input
              type="text"
              value={mergedProps.alt || ''}
              onChange={(e) => handleInputChange('alt', e.target.value)}
              className="property-input"
              placeholder="请输入图片描述"
              style={{
                backgroundColor: currentTheme === 'dark' ? '#4a5568' : '#ffffff',
                color: currentTheme === 'dark' ? '#e2e8f0' : '#333',
                border: `1px solid ${currentTheme === 'dark' ? '#718096' : '#ddd'}`
              }}
            />
          </div>
        </>
      )}
      
      {/* 复选框和单选按钮属性 */}
      {(selectedComponent.type === 'checkbox' || selectedComponent.type === 'radio') && (
        <div className="property-group">
          <label className="property-label" style={{ color: currentTheme === 'dark' ? '#e2e8f0' : '#333' }}>是否选中</label>
          <input
            type="checkbox"
            checked={mergedProps.checked || false}
            onChange={(e) => handleInputChange('checked', e.target.checked)}
          />
        </div>
      )}
      
      {/* 单选按钮属性 */}
      {selectedComponent.type === 'radio' && (
        <div className="property-group">
          <label className="property-label" style={{ color: currentTheme === 'dark' ? '#e2e8f0' : '#333' }}>分组名称</label>
          <input
            type="text"
            value={mergedProps.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="property-input"
            placeholder="请输入分组名称"
            style={{
              backgroundColor: currentTheme === 'dark' ? '#4a5568' : '#ffffff',
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333',
              border: `1px solid ${currentTheme === 'dark' ? '#718096' : '#ddd'}`
            }}
          />
        </div>
      )}
      
      {/* 下拉选择属性 */}
      {selectedComponent.type === 'select' && (
        <div className="property-group">
          <label className="property-label" style={{ color: currentTheme === 'dark' ? '#e2e8f0' : '#333' }}>选中值</label>
          <input
            type="text"
            value={mergedProps.value || ''}
            onChange={(e) => handleInputChange('value', e.target.value)}
            className="property-input"
            placeholder="请输入选中值"
            style={{
              backgroundColor: currentTheme === 'dark' ? '#4a5568' : '#ffffff',
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333',
              border: `1px solid ${currentTheme === 'dark' ? '#718096' : '#ddd'}`
            }}
          />
        </div>
      )}
      
      {/* 文本区域属性 */}
      {selectedComponent.type === 'textarea' && (
        <div className="property-group">
          <label className="property-label" style={{ color: currentTheme === 'dark' ? '#e2e8f0' : '#333' }}>占位文本</label>
          <input
            type="text"
            value={mergedProps.placeholder || ''}
            onChange={(e) => handleInputChange('placeholder', e.target.value)}
            className="property-input"
            placeholder="请输入占位文本"
            style={{
              backgroundColor: currentTheme === 'dark' ? '#4a5568' : '#ffffff',
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333',
              border: `1px solid ${currentTheme === 'dark' ? '#718096' : '#ddd'}`
            }}
          />
        </div>
      )}
      
      {/* 卡片属性 */}
      {selectedComponent.type === 'card' && (
        <div className="property-group">
          <label className="property-label" style={{ color: currentTheme === 'dark' ? '#e2e8f0' : '#333' }}>卡片标题</label>
          <input
            type="text"
            value={mergedProps.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="property-input"
            placeholder="请输入卡片标题"
            style={{
              backgroundColor: currentTheme === 'dark' ? '#4a5568' : '#ffffff',
              color: currentTheme === 'dark' ? '#e2e8f0' : '#333',
              border: `1px solid ${currentTheme === 'dark' ? '#718096' : '#ddd'}`
            }}
          />
        </div>
      )}
      
      {/* 组件层级管理 */}
      <div className="property-group">
        <label className="property-label" style={{ color: currentTheme === 'dark' ? '#e2e8f0' : '#333' }}>层级管理</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => moveComponentUp(selectedComponentId!)} 
            style={{ 
              padding: '6px 12px', 
              background: '#667eea', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            上移
          </button>
          <button 
            onClick={() => moveComponentDown(selectedComponentId!)} 
            style={{ 
              padding: '6px 12px', 
              background: '#667eea', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            下移
          </button>
          <button 
            onClick={() => moveComponentToTop(selectedComponentId!)} 
            style={{ 
              padding: '6px 12px', 
              background: '#764ba2', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            置顶
          </button>
          <button 
            onClick={() => moveComponentToBottom(selectedComponentId!)} 
            style={{ 
              padding: '6px 12px', 
              background: '#764ba2', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            置底
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyEditor;