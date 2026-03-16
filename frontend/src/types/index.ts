export const ComponentType = ['button', 'text', 'input', 'div', 'image', 'checkbox', 'radio', 'select', 'textarea', 'heading', 'divider', 'card'] as const;
export type ComponentType = typeof ComponentType[number];

export const Breakpoint = ['desktop', 'tablet', 'mobile'] as const;
export type Breakpoint = typeof Breakpoint[number];

export const Theme = ['light', 'dark'] as const;
export type Theme = typeof Theme[number];

export type ComponentProps = {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  width: number;
  height: number;
  [key: string]: any;
};

export type ResponsiveProps = {
  [breakpoint in Breakpoint]?: Partial<ComponentProps>;
};

export type Component = {
  id: string;
  type: ComponentType;
  props: ComponentProps;
  responsive?: ResponsiveProps;
};

export type AppState = {
  components: Component[];
  selectedComponentId: string | null;
  canvasSize: { width: number; height: number };
  copiedComponent: Component | null;
  currentBreakpoint: Breakpoint;
  currentTheme: Theme;
  gridEnabled: boolean;
  gridSize: number;
  history: Array<{
    components: Component[];
    selectedComponentId: string | null;
  }>;
  historyIndex: number;
  addComponent: (component: Component) => void;
  updateComponent: (id: string, props: Partial<ComponentProps>) => void;
  updateResponsiveProps: (id: string, breakpoint: Breakpoint, props: Partial<ComponentProps>) => void;
  deleteComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  updateCanvasSize: (size: { width: number; height: number }) => void;
  setCurrentBreakpoint: (breakpoint: Breakpoint) => void;
  setCurrentTheme: (theme: Theme) => void;
  toggleGrid: () => void;
  setGridSize: (size: number) => void;
  savePage: () => Promise<any>;
  loadPage: () => Promise<any>;
  copyComponent: (id: string) => void;
  pasteComponent: () => void;
  moveComponentUp: (id: string) => void;
  moveComponentDown: (id: string) => void;
  moveComponentToTop: (id: string) => void;
  moveComponentToBottom: (id: string) => void;
  undo: () => void;
  redo: () => void;
  addHistory: () => void;
};