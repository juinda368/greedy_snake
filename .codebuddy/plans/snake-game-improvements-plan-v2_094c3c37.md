---
name: snake-game-improvements-plan-v2
overview: 修复蛇的增长逻辑（从尾部增长）、重构陷阱生成系统（基于长度增量批量生成陷阱）、优化吃食物动画效果
todos:
  - id: modify-snake-types
    content: 修改Snake类型添加isGrowing和initialLength字段
    status: completed
  - id: rewrite-grow-logic
    content: 重写useSnake的grow()和move()逻辑实现尾部增长
    status: completed
    dependencies:
      - modify-snake-types
  - id: add-batch-spawn-traps
    content: 在useTraps hook中添加批量生成陷阱功能
    status: completed
  - id: update-trap-generation
    content: 修改App.tsx陷阱生成逻辑基于长度增量触发
    status: completed
    dependencies:
      - add-batch-spawn-traps
  - id: optimize-particle-animation
    content: 优化ParticleSystem粒子动画参数提升平滑度
    status: completed
---

## 产品概述

贪吃蛇游戏的改进计划，修复蛇的增长逻辑、重构陷阱生成系统和优化吃食物动画效果

## 核心功能

- 修复蛇的增长逻辑：吃掉食物后蛇的长度应从尾部增加而不是头部，确保蛇真正变长
- 重构陷阱生成系统：陷阱生成与食物无关，每当身体增加3节时场上有概率批量生成陷阱，每次产生的陷阱数量随长度增加而增加
- 优化吃食物动画效果：让粒子扩散动画更平滑流畅，增强视觉效果

## 技术栈

- 前端框架：React + TypeScript
- 样式：Tailwind CSS
- 状态管理：React Hooks（useState, useCallback）

## 技术架构

### 系统架构

基于现有的组件化架构，主要修改以下模块：

- Snake数据模型：添加isGrowing字段
- useSnake hook：重写grow()和move()逻辑
- useTraps hook：新增批量生成陷阱功能
- App.tsx：修改陷阱生成触发逻辑
- ParticleSystem：优化粒子动画参数

### 模块划分

- **Snake模块**（useSnake hook）：管理蛇的状态、移动和增长逻辑
- **Traps模块**（useTraps hook）：管理陷阱的批量生成和生命周期
- **粒子系统**（ParticleSystem）：控制粒子动画效果
- **游戏控制**（App.tsx）：协调各模块，触发陷阱生成

### 数据流

吃掉食物 → grow()设置isGrowing=true → move()检测isGrowing决定是否删除尾部 → isGrowing=false → 更新长度触发陷阱批量生成检查

## 实现细节

### 核心目录结构

修改现有文件：

```
src/
├── utils/
│   └── types.ts               # 修改：Snake接口添加isGrowing字段
├── hooks/
│   ├── useSnake.ts            # 修改：重写grow()和move()逻辑
│   └── useTraps.ts            # 修改：添加批量生成陷阱功能
├── game/
│   ├── Snake.ts               # 修改：调整moveSnakeWithoutGrowing逻辑
│   └── ParticleSystem.ts      # 修改：优化粒子动画参数
└── App.tsx                    # 修改：调整陷阱生成触发逻辑
```

### 关键代码结构

**Snake接口扩展**：

```typescript
export interface Snake {
  body: Position[];
  direction: Direction;
  nextDirection: Direction;
  isLocked: boolean;
  lockEndTime: number;
  isInvincible: boolean;
  invincibleEndTime: number;
  isGrowing: boolean;  // 新增：标记是否处于增长状态
  initialLength: number;  // 新增：记录初始长度用于计算增量
}
```

**增长逻辑改造**：

- grow()：设置isGrowing=true，不在头部添加节点
- move()：检测isGrowing，为true时保留尾部（不删除），为false时正常移动删除尾部

**陷阱批量生成逻辑**：

```typescript
// 检查长度增量是否达到3的倍数
const lengthIncrement = snake.body.length - snake.initialLength;
if (lengthIncrement > 0 && lengthIncrement % 3 === 0) {
  // 计算陷阱数量：基于长度的增量函数
  const trapCount = Math.min(5, Math.floor(lengthIncrement / 3) + 1);
  // 批量生成陷阱
  batchSpawnTraps(trapCount, allOccupied);
  // 更新初始长度避免重复触发
  setSnake(prev => ({ ...prev, initialLength: prev.body.length }));
}
```

**粒子动画优化**：

- 降低速度乘数：从3降至2.5
- 减缓生命衰减：从0.08降至0.06
- 减小重力影响：从0.05降至0.03
- 增加粒子初始大小：从1.5-3增至2-4

### 技术实现计划

#### 任务1：修复蛇的增长逻辑

1. 在Snake类型中添加isGrowing和initialLength字段
2. 修改useSnake.ts的grow()函数，设置isGrowing=true
3. 修改moveSnakeWithoutGrowing逻辑，当isGrowing=true时保留尾部
4. 在move函数中重置isGrowing=false

#### 任务2：重构陷阱生成系统

1. 在useTraps hook中新增batchSpawnTraps函数
2. 在App.tsx中移除原有的随机陷阱生成逻辑
3. 添加基于长度增量的陷阱生成检查
4. 实现陷阱数量随长度增加的算法

#### 任务3：优化粒子动画

1. 调整ParticleSystem.ts中的粒子速度参数
2. 优化粒子生命衰减速度
3. 调整重力影响参数
4. 增加粒子初始尺寸范围

### 集成点

- useSnake、useTraps、ParticleSystem通过React hooks集成
- 状态更新通过useState和useCallback实现
- App.tsx作为主控制器协调各模块

## 技术考虑

- 保持现有架构不变，避免引入新的复杂逻辑
- 使用现有React状态管理模式
- 确保修改向后兼容，不影响其他功能
- 粒子动画优化需平衡性能和视觉效果