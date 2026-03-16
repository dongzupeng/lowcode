import { Injectable } from '@nestjs/common';
import { Component, PageConfig } from './components.interface';

@Injectable()
export class ComponentsService {
  private components: Component[] = [];
  private pageConfig: PageConfig = {
    components: [],
    canvasSize: { width: 1000, height: 600 },
  };

  getAllComponents(): Component[] {
    return this.components;
  }

  getComponentById(id: string): Component {
    const component = this.components.find((c) => c.id === id);
    if (!component) {
      throw new Error(`Component with id ${id} not found`);
    }
    return component;
  }

  createComponent(component: Component): Component {
    this.components.push(component);
    return component;
  }

  updateComponent(id: string, component: Partial<Component>): Component {
    const index = this.components.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Component with id ${id} not found`);
    }
    this.components[index] = {
      ...this.components[index],
      ...component,
      props: {
        ...this.components[index].props,
        ...component.props,
      },
    };
    return this.components[index];
  }

  deleteComponent(id: string): void {
    const index = this.components.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Component with id ${id} not found`);
    }
    this.components.splice(index, 1);
  }

  // 保存页面配置
  savePageConfig(config: PageConfig): PageConfig {
    this.pageConfig = config;
    this.components = config.components;
    return this.pageConfig;
  }

  // 加载页面配置
  loadPageConfig(): PageConfig {
    return this.pageConfig;
  }
}