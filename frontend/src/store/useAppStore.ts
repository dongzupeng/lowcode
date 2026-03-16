import { create } from 'zustand';
import type { AppState, Breakpoint, Theme } from '../types';

const useAppStore = create<AppState>((set, get) => ({
  components: [],
  selectedComponentId: null,
  canvasSize: { width: 1000, height: 600 },
  copiedComponent: null,
  currentBreakpoint: 'desktop' as Breakpoint,
  currentTheme: 'light' as Theme,
  gridEnabled: true,
  gridSize: 20,
  history: [],
  historyIndex: -1,
  
  addComponent: (component) => set((state) => {
    const newComponents = [...state.components, component];
    const newState = {
      components: newComponents,
      selectedComponentId: component.id
    };
    // 添加到历史记录
    const newHistory = [...state.history.slice(0, state.historyIndex + 1), {
      components: JSON.parse(JSON.stringify(newComponents)),
      selectedComponentId: component.id
    }];
    return {
      ...newState,
      history: newHistory,
      historyIndex: newHistory.length - 1
    };
  }),
  
  updateComponent: (id, props) => set((state) => {
    const newComponents = state.components.map(component => {
      if (component.id === id) {
        const updatedProps = { ...component.props, ...props };
        
        // 边界控制 - 确保组件在画布内
        const { width: canvasWidth, height: canvasHeight } = state.canvasSize;
        const componentWidth = Math.max(0, updatedProps.width || 0);
        const componentHeight = Math.max(0, updatedProps.height || 0);
        
        // 确保组件不会超出画布左边界
        updatedProps.x = Math.max(0, updatedProps.x || 0);
        // 确保组件不会超出画布右边界
        updatedProps.x = Math.min(canvasWidth - componentWidth, updatedProps.x);
        // 确保组件不会超出画布上边界
        updatedProps.y = Math.max(0, updatedProps.y || 0);
        // 确保组件不会超出画布下边界
        updatedProps.y = Math.min(canvasHeight - componentHeight, updatedProps.y);
        
        return { ...component, props: updatedProps };
      }
      return component;
    });
    
    // 添加到历史记录
    const newHistory = [...state.history.slice(0, state.historyIndex + 1), {
      components: JSON.parse(JSON.stringify(newComponents)),
      selectedComponentId: state.selectedComponentId
    }];
    
    return {
      components: newComponents,
      history: newHistory,
      historyIndex: newHistory.length - 1
    };
  }),
  
  deleteComponent: (id) => set((state) => {
    const newComponents = state.components.filter(component => component.id !== id);
    const newSelectedComponentId = state.selectedComponentId === id ? null : state.selectedComponentId;
    
    // 添加到历史记录
    const newHistory = [...state.history.slice(0, state.historyIndex + 1), {
      components: JSON.parse(JSON.stringify(newComponents)),
      selectedComponentId: newSelectedComponentId
    }];
    
    return {
      components: newComponents,
      selectedComponentId: newSelectedComponentId,
      history: newHistory,
      historyIndex: newHistory.length - 1
    };
  }),
  
  selectComponent: (id) => set({ selectedComponentId: id }),
  
  updateCanvasSize: (size) => set({ canvasSize: size }),
  
  // 保存页面配置
  savePage: async () => {
    const state = get();
    try {
      const response = await fetch('http://localhost:3000/components/page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          components: state.components,
          canvasSize: state.canvasSize,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('保存页面失败:', error);
      return null;
    }
  },
  
  // 加载页面配置
  loadPage: async () => {
    try {
      const response = await fetch('http://localhost:3000/components/page');
      const data = await response.json();
      if (data) {
        set({
          components: data.components || [],
          canvasSize: data.canvasSize || { width: 1000, height: 600 },
        });
      }
      return data;
    } catch (error) {
      console.error('加载页面失败:', error);
      return null;
    }
  },
  
  // 复制组件
  copyComponent: (id) => set((state) => {
    const component = state.components.find((c) => c.id === id);
    if (component) {
      return { copiedComponent: component };
    }
    return {};
  }),
  
  // 粘贴组件
  pasteComponent: () => set((state) => {
    if (!state.copiedComponent) return {};
    
    // 创建组件的深拷贝
    const copiedComponent = JSON.parse(JSON.stringify(state.copiedComponent));
    
    // 生成新的ID
    copiedComponent.id = `component-${Date.now()}`;
    copiedComponent.props.id = `component-${Date.now()}`;
    
    // 偏移位置，避免重叠
    copiedComponent.props.x += 20;
    copiedComponent.props.y += 20;
    
    return {
      components: [...state.components, copiedComponent],
      selectedComponentId: copiedComponent.id
    };
  }),
  
  // 组件层级管理
  moveComponentUp: (id) => set((state) => {
    const components = [...state.components];
    const index = components.findIndex((c) => c.id === id);
    if (index > 0) {
      // 交换位置
      [components[index], components[index - 1]] = [components[index - 1], components[index]];
      return { components };
    }
    return {};
  }),
  
  moveComponentDown: (id) => set((state) => {
    const components = [...state.components];
    const index = components.findIndex((c) => c.id === id);
    if (index < components.length - 1) {
      // 交换位置
      [components[index], components[index + 1]] = [components[index + 1], components[index]];
      return { components };
    }
    return {};
  }),
  
  moveComponentToTop: (id) => set((state) => {
    const components = [...state.components];
    const index = components.findIndex((c) => c.id === id);
    if (index > -1) {
      // 移动到顶部
      const component = components.splice(index, 1)[0];
      components.push(component);
      return { components };
    }
    return {};
  }),
  
  moveComponentToBottom: (id) => set((state) => {
    const components = [...state.components];
    const index = components.findIndex((c) => c.id === id);
    if (index > -1) {
      // 移动到底部
      const component = components.splice(index, 1)[0];
      components.unshift(component);
      return { components };
    }
    return {};
  }),
  
  // 响应式布局设置
  updateResponsiveProps: (id, breakpoint, props) => set((state) => {
    const newComponents = state.components.map(component => {
      if (component.id === id) {
        const updatedResponsive = { ...component.responsive };
        if (!updatedResponsive[breakpoint]) {
          updatedResponsive[breakpoint] = {};
        }
        updatedResponsive[breakpoint] = { ...updatedResponsive[breakpoint], ...props };
        return { ...component, responsive: updatedResponsive };
      }
      return component;
    });
    
    // 添加到历史记录
    const newHistory = [...state.history.slice(0, state.historyIndex + 1), {
      components: JSON.parse(JSON.stringify(newComponents)),
      selectedComponentId: state.selectedComponentId
    }];
    
    return {
      components: newComponents,
      history: newHistory,
      historyIndex: newHistory.length - 1
    };
  }),
  
  setCurrentBreakpoint: (breakpoint) => set({ currentBreakpoint: breakpoint }),
  setCurrentTheme: (theme) => set({ currentTheme: theme }),
  toggleGrid: () => set((state) => ({ gridEnabled: !state.gridEnabled })),
  setGridSize: (size) => set({ gridSize: size }),
  
  // 撤销/重做功能
  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      const historyItem = state.history[newIndex];
      return {
        components: JSON.parse(JSON.stringify(historyItem.components)),
        selectedComponentId: historyItem.selectedComponentId,
        historyIndex: newIndex
      };
    }
    return {};
  }),
  
  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      const historyItem = state.history[newIndex];
      return {
        components: JSON.parse(JSON.stringify(historyItem.components)),
        selectedComponentId: historyItem.selectedComponentId,
        historyIndex: newIndex
      };
    }
    return {};
  }),
  
  addHistory: () => set((state) => {
    const newHistory = [...state.history.slice(0, state.historyIndex + 1), {
      components: JSON.parse(JSON.stringify(state.components)),
      selectedComponentId: state.selectedComponentId
    }];
    return {
      history: newHistory,
      historyIndex: newHistory.length - 1
    };
  })
}));

export default useAppStore;