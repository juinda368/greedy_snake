---
name: game-ui-optimization-plan
overview: 优化游戏界面布局：增大游戏画布、调整颜色提示框为宽矮布局、使各组件紧密连接、加快粒子扩散速度、添加空格键暂停功能
todos:
  - id: increase-canvas-size
    content: 增大画布尺寸至750px，修改constants.ts配置
    status: completed
  - id: adjust-legend-layout
    content: 调整GameLegend为宽矮横向布局，改为单行显示
    status: completed
  - id: tighten-component-spacing
    content: 调整组件间距，实现紧密连接布局
    status: completed
    dependencies:
      - increase-canvas-size
      - adjust-legend-layout
  - id: speedup-particles
    content: 加快粒子扩散速度，增强视觉反馈效果
    status: completed
  - id: add-space-pause
    content: 添加空格键暂停/继续功能到InputHandler
    status: completed
---

## Product Overview

优化贪吃蛇游戏界面布局和交互体验，提升视觉可玩性和操作便捷性

## Core Features

- 增大游戏画布尺寸，提升游戏视觉体验
- 调整颜色提示框为宽矮的横向布局
- 游戏界面、分数面板、颜色提示框紧密连接布局
- 加快粒子扩散动画效果，增强视觉反馈
- 添加空格键暂停/继续游戏功能

## Tech Stack

- Frontend: React + TypeScript
- Styling: Tailwind CSS
- 游戏渲染: HTML5 Canvas

## Tech Architecture

### System Architecture

基于现有项目的组件化架构，采用单向数据流模式：

```
App (状态管理) → 组件渲染 (ScoreBoard/GameCanvas/GameLegend) → 用户交互 → 状态更新
```

### Module Division

- **UI Components**: GameCanvas (游戏画布)、ScoreBoard (分数面板)、GameLegend (颜色提示框)
- **Game Logic**: ParticleSystem (粒子效果系统)、InputHandler (输入处理)
- **State Management**: App (游戏主状态)

### Data Flow

用户操作 (空格键/方向键) → InputHandler → 状态更新 → 组件重渲染 → Canvas绘制更新

## Implementation Details

### Core Directory Structure

仅显示需要修改的文件：

```
e:/game/Impromptu_Project/greedy_snake/
├── src/
│   ├── components/
│   │   ├── GameCanvas.tsx      # 修改: 增大画布尺寸
│   │   ├── GameLegend.tsx      # 修改: 调整布局为宽矮横向
│   │   └── ScoreBoard.tsx      # 保持不变
│   ├── game/
│   │   ├── ParticleSystem.ts   # 修改: 加快粒子扩散速度
│   │   └── InputHandler.ts     # 修改: 添加空格键暂停
│   ├── utils/
│   │   └── constants.ts        # 修改: 更新画布尺寸常量
│   └── App.tsx                 # 修改: 调整组件间距
```

### Key Code Structures

**画布尺寸配置** (utils/constants.ts):

```typescript
// 修改前
CANVAS_SIZE: 600,
// 修改后
CANVAS_SIZE: 750, // 增大25%
```

**粒子速度更新** (game/ParticleSystem.ts):

```typescript
// 修改前
vy: particle.vy + 0.1,
life: particle.life - 0.05,
// 修改后
vy: particle.vy + 0.15, // 增加重力50%
life: particle.life - 0.08, // 加快消散60%
```

**空格键暂停处理** (game/InputHandler.ts):

```typescript
// 新增暂停回调
onPauseChange(callback: () => void): () => void {
  this.pauseCallback = callback;
  return () => { this.pauseCallback = null; };
}

// 在handleKeyDown中添加
case ' ':
  if (this.pauseCallback) {
    this.pauseCallback();
  }
  break;
```

**GameLegend布局调整** (components/GameLegend.tsx):

```typescript
// 修改前
<div className="flex flex-wrap gap-4 justify-center">
// 修改后 - 单行横向布局，减少高度
<div className="flex items-center gap-6 justify-center px-8">
```

**组件间距调整** (App.tsx):

```typescript
// 修改前 - ScoreBoard: fixed top-0, GameCanvas: mt-20, GameLegend: fixed bottom-4
// 修改后 - 移除多余间距，组件紧密连接
<div className="mt-16"> {/* 减小从顶部间距 */}
  <GameCanvas ... />
</div>
<div className="mt-4"> {/* 添加与GameLegend的连接间距 */}
  <GameLegend /> {/* 改为非fixed布局 */}
</div>
```

### Technical Implementation Plan

#### 1. 增大画布尺寸

- **问题**: 当前600px画布在较大屏幕上显示偏小
- **方案**: 将CANVAS_SIZE常量从600增至750px
- **关键步骤**: 修改constants.ts → GameCanvas.tsx响应式计算自动适配
- **验证**: 测试不同屏幕尺寸下的显示效果

#### 2. 调整GameLegend布局

- **问题**: 当前flex-wrap布局导致高度不稳定且偏高
- **方案**: 改为单行横向flex布局，固定高度，增大宽度
- **关键步骤**: 修改flex-wrap为flex，调整padding和gap
- **验证**: 确保所有图例在一行显示且不拥挤

#### 3. 组件紧密连接

- **问题**: 组件间间距过大，视觉不连贯
- **方案**: 移除GameCanvas的mt-20，GameLegend改为非fixed布局，添加紧凑的margin
- **关键步骤**: 修改App.tsx的容器结构和间距类
- **验证**: 确保ScoreBoard、GameCanvas、GameLegend视觉上"刚好接吻"

#### 4. 加快粒子扩散

- **问题**: 粒子效果速度偏慢，视觉反馈不足
- **方案**: 增加粒子速度向量和生命衰减速度
- **关键步骤**: 修改ParticleSystem.ts的updateParticles函数
- **验证**: 观察吃食物时的粒子动画更快速活泼

#### 5. 空格键暂停

- **问题**: 缺少快捷键暂停功能，操作不便
- **方案**: 在InputHandler中监听空格键，触发暂停回调
- **关键步骤**: 添加onPauseChange回调注册，在App.tsx中连接togglePause
- **验证**: 按空格键能正常暂停/继续游戏

### Integration Points

- **组件通信**: App.tsx作为状态中心，通过props传递数据和回调
- **事件系统**: InputHandler通过回调机制通知方向变化和暂停操作
- **渲染系统**: Canvas根据state自动重绘，粒子效果集成在游戏主循环中

## Technical Considerations

### Performance Optimization

- 画布尺寸增大会增加渲染负载，但750px仍在合理范围
- 粒子数量保持不变，仅调整速度参数，无性能影响
- 响应式计算已做优化，使用Math.min限制最大尺寸

### Security Measures

- 无安全相关风险，纯前端优化
- 键盘事件使用preventDefault避免页面滚动

### Scalability

- 画布尺寸使用常量配置，便于后续调整
- 组件间距使用Tailwind类，易于维护
- 输入处理采用回调模式，便于扩展新快捷键