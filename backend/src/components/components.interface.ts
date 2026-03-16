export type ComponentType = 'button' | 'text' | 'input' | 'div' | 'image' | 'checkbox' | 'radio' | 'select' | 'textarea' | 'heading' | 'divider' | 'card';

export interface ComponentProps {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  width: number;
  height: number;
  [key: string]: any;
}

export interface Component {
  id: string;
  type: ComponentType;
  props: ComponentProps;
}

export interface PageConfig {
  components: Component[];
  canvasSize: {
    width: number;
    height: number;
  };
}