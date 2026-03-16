import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ComponentsService } from './components.service';
import { Component, PageConfig } from './components.interface';

@Controller('components')
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) { }

  @Get()
  getAllComponents(): Component[] {
    return this.componentsService.getAllComponents();
  }

  @Get(':id')
  getComponent(@Param('id') id: string): Component {
    return this.componentsService.getComponentById(id);
  }

  @Post()
  createComponent(@Body() component: Component): Component {
    return this.componentsService.createComponent(component);
  }

  @Put(':id')
  updateComponent(@Param('id') id: string, @Body() component: Partial<Component>): Component {
    return this.componentsService.updateComponent(id, component);
  }

  @Delete(':id')
  deleteComponent(@Param('id') id: string): void {
    this.componentsService.deleteComponent(id);
  }

  // 保存页面配置
  @Post('page')
  savePageConfig(@Body() config: PageConfig): PageConfig {
    return this.componentsService.savePageConfig(config);
  }

  // 加载页面配置
  @Get('page')
  loadPageConfig(): PageConfig {
    return this.componentsService.loadPageConfig();
  }
}