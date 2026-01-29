---
name: snake-game-improvements-plan
overview: 修复蛇的增长逻辑（从尾部增长）和重构陷阱生成系统（基于长度增量批量生成陷阱）
todos:
  - id: update-snake-type
    content: 在types.ts中为Snake接口添加isGrowing字段
    status: pending
  - id: update-snake-initialization
    content: 在Snake.ts中更新createInitialSnake添加isGrowing默认值
    status: pending
    dependencies:
      - update-snake-type
  - id: add-grow-move-function
    content: 在Snake.ts中添加moveSnakeWithGrowing函数实现增长移动
    status: pending
    dependencies:
      - update-snake-initialization
  - id: refactor-grow-method
    content: 重构useSnake.ts中grow方法仅设置isGrowing标志
    status: pending
    dependencies:
      - add-grow-move-function
  - id: refactor-move-method
    content: 重构useSnake.ts中move方法根据isGrowing选择不同移动逻辑
    status: pending
    dependencies:
      - add-grow-move-function
  - id: implement-trap-batch-spawn
    content: 在App.tsx实现基于长度增量的批量陷阱生成逻辑
    status: pending
    dependencies:
      - refactor-move-method
  - id: test-and-verify
    content: 测试蛇增长和陷阱生成功能是否正常工作
    status: pending
    dependencies:
      - implement-trap-batch-spawn
---

## 产品概述

修复贪吃蛇游戏的核心增长逻辑，并重构陷阱生成系统以提升游戏难度平衡性

## 核心功能

- **修复蛇增长逻辑**：吃食物后蛇身从尾部增加而非头部，确保增长效果正确
- **重构陷阱生成系统**：
- 陷阱生成与食物无关
- 每当身体增加3节时，有概率批量生成陷阱
- 陷阱数量随蛇的长度增加而递增
- 保持方形陷阱显示效果

## 技术栈

- Frontend: React + TypeScript
- 状态管理: React Hooks (useState, useCallback)
- 样式: Tailwind CSS

## 系统架构

### 增长逻辑修复

使用增长标记标志位控制增长行为。当吃食物时设置`isGrowing=true`，下一次移动时不删除尾部并重置标志位。

### 陷阱批量生成系统

基于长度增量触发批量生成。记录初始长度，每次移动检查长度增量是否达到3的倍数，若满足且有概率触发，则根据当前长度计算陷阱数量并批量生成。

## 实现细节

### 核心文件修改

**types.ts** - 扩展Snake类型：

```typescript
export interface Snake {
  body: Position[];
  direction: Direction;
  nextDirection: Direction;
  isLocked: boolean;
  lockEndTime: number;
  isInvincible: boolean;
  invincibleEndTime: number;
  isGrowing: boolean;  // 新增：增长标志位
}
```

**Snake.ts** - 更新初始蛇和移动逻辑：

- `createInitialSnake()`: 添加`isGrowing: false`
- `moveSnakeWithGrowing()`: 新函数，添加头部但不删除尾部

**useSnake.ts** - 重构增长和移动：

- `grow()`: 仅设置`isGrowing=true`
- `move()`: 根据`isGrowing`选择调用`moveSnakeWithGrowing`或`moveSnakeWithoutGrowing`

**App.tsx** - 陷阱批量生成逻辑：

```typescript
// 记录初始长度
const [initialSnakeLength, setInitialSnakeLength] = useState(snake.body.length);

// 检查长度增量
const lengthIncrement = snake.body.length - initialSnakeLength;

// 每增加3节，有概率批量生成陷阱
if (lengthIncrement >= 3 && lengthIncrement % 3 === 0 && Math.random() < 0.5) {
  const trapCount = Math.floor(snake.body.length / 5) + 1;  // 基于长度计算陷阱数量
  for (let i = 0; i < trapCount; i++) {
    spawnTrap(allOccupied);
  }
  setInitialSnakeLength(snake.body.length);
}
```

### 数据流程

增长流程：

```
吃食物 → grow()设置isGrowing=true 
  → move()检测isGrowing 
  → moveSnakeWithGrowing(不删尾部)
  → 重置isGrowing=false
```

陷阱生成流程：

```
移动时检查长度增量 
  → 增量>=3且为3的倍数 
  → 概率判定(50%) 
  → 计算陷阱数量(floor(长度/5)+1) 
  → 批量生成陷阱
```

# Agent Extensions

无需要使用的Agent Extensions