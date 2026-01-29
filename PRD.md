# 贪吃蛇游戏产品需求文档 (PRD)

## 1. 项目概述

### 1.1 项目名称
Greedy Snake (贪吃蛇)

### 1.2 项目类型
Web 网页游戏

### 1.3 技术栈
- **前端框架**: React 18.3.1
- **开发语言**: TypeScript
- **构建工具**: Vite 5.2.0
- **样式框架**: Tailwind CSS 3.4.17
- **动画库**: Framer Motion 11.0.0
- **图标库**: Lucide React 0.344.0

### 1.4 项目目标
开发一个功能丰富、体验流畅的贪吃蛇网页游戏，包含多种食物类型、陷阱机制、特效和音效，提供经典玩法的同时增加游戏趣味性和挑战性。

---

## 2. 功能需求

### 2.1 核心玩法

#### 2.1.1 蛇的移动
- 蛇在网格中移动，初始长度为 3 节
- 蛇头初始位置在画布中央
- 初始方向：向上
- 移动控制：
  - 键盘方向键（↑↓←→）
  - WASD 键
  - 屏幕方向控制按钮（移动端）
  - 触摸滑动（移动端）

#### 2.1.2 速度机制
- 初始速度：200ms/格
- 速度递增：每增长 3 节身体，速度加快 10ms
- 最小间隔：50ms（最快速度）
- 速度计算公式：
  ```
  速度 = max(50, 200 - floor((蛇身长度 - 3) / 3) * 10)
  ```

### 2.2 食物系统

#### 2.2.1 食物类型
1. **普通食物**（绿色）
   - 分数：10 分
   - 粒子效果：绿色 (#00ff88)，12 个粒子
   - 出现频率：高
   - 视觉：绿色圆形，带发光效果

2. **金色食物**（金色）
   - 分数：30 分
   - 特殊效果：6 秒内分数倍增（2 倍）
   - 粒子效果：金色 (#ffd700)，12 个粒子
   - 出现频率：低
   - 视觉：金色圆形，带强烈发光效果

3. **彩虹食物**（粉色）
   - 分数：20 分
   - 特殊效果：6 秒无敌状态 + 1.5 倍加速
   - 粒子效果：粉色 (#ff6b9d)，12 个粒子
   - 出现频率：中
   - 视觉：粉色圆形，带发光效果
   - 特殊视觉：蛇身整体发出金色光晕（持续 6 秒）

#### 2.2.2 食物生成规则
- 场上**始终存在 2 个食物**（初始 2 个，吃掉后立即补充）
- 食物不能生成在蛇身、障碍物或其他食物的位置
- 被吃掉的食物立即移除并补充新食物，确保始终保持 2 个
- 食物类型随机生成，基于概率分布：
  - 普通食物：70% 概率
  - 金色食物：15% 概率
  - 彩虹食物：15% 概率

### 2.3 陷阱系统

#### 2.3.1 陷阱类型
1. **蓝色陷阱**
   - 效果：锁定方向 1 秒
   - 触发条件：蛇头接触
   - 视觉：蓝色方块，带 🔒 图标
   - 音效：trap-blue
   - 无敌状态下可安全通过
   - 持续时间：永久存在（直到被触发）

2. **紫色陷阱**
   - 效果：断裂蛇尾 3 节，断裂部分变成障碍物
   - 触发条件：蛇头接触
   - 视觉：紫色方块，带 ⚠️ 图标
   - 音效：trap-purple
   - 无敌状态下可安全通过
   - 障碍物生成：断裂的蛇尾位置变为永久障碍物
   - 持续时间：永久存在（直到被触发）

#### 2.3.2 陷阱生成规则
- 生成时机：基于蛇身长度增量触发
  - 每增长 3 节身体，有 80% 概率批量生成陷阱
  - 避免重复触发：生成后更新初始长度标记

- 陷阱数量：
  - 最大数量 = ⌊蛇身长度 ÷ 3⌋（向下取整）
  - 例如：蛇长 30 节 → 最多 10 个陷阱
  - 例如：蛇长 60 节 → 最多 20 个陷阱
  - 无硬上限，完全基于蛇身长度动态调整

- 生成位置：
  - 不能生成在蛇身、障碍物、食物或其他陷阱的位置
  - 优先在蛇头附近生成（增加挑战性）
  - 随机分布在空闲网格中

- 陷阱类型：
  - 蓝色陷阱和紫色陷阱各 50% 概率

- 触发规则：
  - 蛇头接触陷阱立即触发效果
  - 触发后陷阱消失
  - 无敌状态下安全通过，陷阱不消失

### 2.4 碰撞检测

#### 2.4.1 碰撞类型
1. **墙壁碰撞**
   - 蛇头超出网格边界
   - 无效碰撞：无敌状态

2. **自身碰撞**
   - 蛇头接触蛇身（从第 2 节开始）
   - 无效碰撞：无敌状态

3. **障碍物碰撞**
   - 蛇头接触障碍物
   - 无效碰撞：无敌状态
   - 障碍物来源：紫色陷阱产生的断裂蛇尾

#### 2.4.2 游戏结束
- 任何有效碰撞都会导致游戏结束
- 播放爆炸粒子效果（红色 #ff4444，20 个粒子）
- 播放 gameover 音效
- 停止背景音乐
- 显示游戏结束界面和分数
- 更新最高分（保存在 localStorage）

### 2.5 特殊状态

#### 2.5.1 无敌状态
- 触发：吃掉彩虹食物
- 持续时间：6 秒
- 效果：
  - 所有碰撞无效（墙壁、自身、障碍物、陷阱）
  - 蛇身颜色变为金色渐变
  - 蛇身整体发出金色光晕（shadowBlur 效果）
  - 播放 invincible 音效
  - 速度提升 1.5 倍
- 视觉细节：
  - 蛇头：金色圆形，带金色光晕
  - 蛇身：金色渐变，每节都有光晕
  - 光晕参数：shadowBlur = cellSize * 0.25，shadowColor = #ffd700
- 结束：时间到达后自动恢复正常颜色和速度

#### 2.5.2 分数倍增
- 触发：吃掉金色食物
- 持续时间：6 秒
- 效果：吃食物得分 × 2
- 视觉：分数显示倍增状态（可以显示 ×2 标记）
- 结束：时间到达后恢复 ×1

### 2.6 游戏状态

#### 2.6.1 状态机
1. **未开始**（isRunning = false, isPaused = false, isGameOver = false）
   - 显示开始菜单
   - 点击"开始游戏"进入运行状态

2. **运行中**（isRunning = true, isPaused = false, isGameOver = false）
   - 游戏正常进行
   - 蛇自动移动
   - 可以暂停

3. **暂停中**（isRunning = true, isPaused = true, isGameOver = false）
   - 蛇停止移动
   - 显示暂停状态
   - 可以继续或重新开始

4. **游戏结束**（isRunning = false, isPaused = false, isGameOver = true）
   - 显示游戏结束界面
   - 显示本次分数和最高分
   - 点击"重新开始"重置游戏

#### 2.6.2 分数系统
- 当前分数：实时显示
- 最高分：保存在 localStorage，游戏结束或重新开始时更新
- 分数计算：
  - 普通食物：10 分
  - 金色食物：30 分 × 倍增（1 或 2）
  - 彩虹食物：20 分 × 倍增（1 或 2）

### 2.7 粒子系统

#### 2.7.1 粒子效果类型
1. **吃食物效果**
   - 食物位置生成 12 个粒子
   - 颜色：根据食物类型
     - 普通食物：绿色 (#00ff88)
     - 金色食物：金色 (#ffd700)
     - 彩虹食物：粉色 (#ff6b9d)
   - 逐渐扩散和消失
   - 粒子生命周期：
     - 初始生命：1.0
     - 每帧减少：0.06（平滑消失）
     - 自动移除：life <= 0

2. **游戏结束爆炸**
   - 蛇头位置生成 10 个粒子
   - 颜色：红色 (#ff4444)
   - 向四周扩散
   - 播放爆炸动画

3. **粒子物理参数**
   - 速度：vx * 2.5, vy * 2.5（适中的扩散速度）
   - 重力：vy += 0.03（轻微下坠效果）
   - 尺寸：根据单元格大小动态调整
   - 透明度：life / maxLife（渐变消失）
   - 位置缩放：响应式适配画布大小

### 2.8 音效系统

#### 2.8.1 音效类型
1. **背景音乐**（BGM）
   - 路径：/assets/audio/bgm.mp3
   - 游戏开始时播放
   - 暂停时停止
   - 游戏结束时停止

2. **吃食物音效**
   - 普通食物：eat-normal
   - 金色食物：eat-gold
   - 彩虹食物：eat-rainbow

3. **特殊效果音效**
   - 无敌状态：invincible
   - 游戏结束：gameover
   - 蓝色陷阱：trap-blue
   - 紫色陷阱：trap-purple

#### 2.8.2 音量控制
- 音量调节：0-100%
- 静音开关
- 界面显示音量图标和静音状态

---

## 2.9 游戏机制详细说明

### 2.9.1 陷阱生成算法
```typescript
// 陷阱生成伪代码
function shouldSpawnTraps(snake: Snake, currentTraps: Trap[]): boolean {
  const lengthIncrement = snake.body.length - snake.initialLength;

  // 每增长 3 节检查一次
  if (lengthIncrement > 0 && lengthIncrement % 3 === 0) {
    // 75% 概率触发陷阱生成
    if (Math.random() < 0.75) {
      return true;
    }
  }
  return false;
}

function calculateTrapCount(snake: Snake, currentTraps: Trap[]): number {
  // 最大陷阱数 = 蛇身长度 / 3
  const maxTraps = Math.floor(snake.body.length / 3);
  // 本次生成数量 = 最大值 - 当前已有数量
  const spawnCount = Math.max(1, maxTraps - currentTraps.length);
  return spawnCount;
}

// 示例：
// 蛇长 30 节 → maxTraps = 10 → 已有 5 个陷阱 → 生成 5 个
// 蛇长 60 节 → maxTraps = 20 → 已有 12 个陷阱 → 生成 8 个
```

### 2.9.2 食物补充逻辑
```typescript
// 食物补充伪代码
function handleFoodEaten(eatenFood: Food, allFoods: Food[]): void {
  // 移除被吃的食物
  removeFood(eatenFood);

  // 计算已占用位置（蛇身 + 障碍物 + 剩余食物）
  const occupiedPositions = [
    ...snake.body,
    ...obstacles,
    ...allFoods.filter(f => f !== eatenFood)
  ];

  // 补充新食物（确保始终有 2 个）
  if (allFoods.length <= 2) {
    spawnFood(occupiedPositions);
  }
}

// 关键点：
// 使用 <= 而不是 <，因为状态更新是异步的
// 确保在更新前已经判断需要补充
```

### 2.9.3 无敌状态实现
```typescript
// 无敌状态伪代码
function applyRainbowFoodEffect(snake: Snake): void {
  snake.isInvincible = true;
  snake.invincibleEndTime = Date.now() + 6000; // 6 秒

  // 视觉效果：
  // 1. 蛇身颜色变为金色
  // 2. 每个蛇身节添加金色光晕
  // 3. shadowBlur = cellSize * 0.25
  // 4. shadowColor = #ffd700

  // 碰撞检测跳过：
  // if (snake.isInvincible) {
  //   // 忽略所有碰撞
  //   return;
  // }
}

// 自动恢复
function checkInvincibleStatus(snake: Snake): void {
  if (snake.isInvincible && Date.now() > snake.invincibleEndTime) {
    snake.isInvincible = false; // 恢复正常
  }
}
```

### 2.9.4 粒子系统实现细节
```typescript
// 粒子更新伪代码
function updateParticles(particles: Particle[]): Particle[] {
  return particles.map(particle => ({
    ...particle,
    // 位置更新
    x: particle.x + particle.vx * 2.5,  // 横向扩散
    y: particle.y + particle.vy * 2.5,  // 纵向扩散
    // 速度更新（重力）
    vy: particle.vy + 0.03,             // 轻微下坠
    // 生命衰减
    life: particle.life - 0.06           // 平滑消失
  })).filter(particle => particle.life > 0); // 移除死亡粒子
}

// 粒子创建
function createParticles(x, y, color, count = 12): Particle[] {
  return Array.from({ length: count }, () => ({
    x,
    y,
    vx: (Math.random() - 0.5) * 4,      // 随机横向速度
    vy: (Math.random() - 0.5) * 4 - 2, // 随机纵向速度（向上偏）
    life: 1.0,
    maxLife: 1.0,
    color,
    size: 3 + Math.random() * 2         // 随机大小
  }));
}
```

### 2.9.5 速度计算公式
```typescript
// 速度计算伪代码
function calculateSpeed(snakeLength: number): number {
  const INITIAL_SPEED = 200;
  const MIN_SPEED = 50;
  const SPEED_INCREMENT = 10;
  const LENGTH_INCREMENT = 3;

  // 每增长 3 节，速度加快 10ms
  const speedReduction = Math.floor((snakeLength - 3) / LENGTH_INCREMENT) * SPEED_INCREMENT;

  // 示例计算：
  // 蛇长 3  节 → floor(0/3)*10 = 0  → 200ms
  // 蛇长 6  节 → floor(3/3)*10 = 10 → 190ms
  // 蛇长 9  节 → floor(6/3)*10 = 20 → 180ms
  // 蛇长 30 节 → floor(27/3)*10 = 90 → 110ms
  // 蛇长 60 节 → floor(57/3)*10 = 190 → 50ms（达到最小值）

  return Math.max(MIN_SPEED, INITIAL_SPEED - speedReduction);
}
```

---

## 3. 用户界面

### 3.1 页面布局

```
┌─────────────────────────────┐
│  分数板                      │
│  - 当前分数                  │
│  - 最高分                    │
│  - 音量控制                  │
│  - 暂停/继续按钮            │
│  - 重新开始按钮              │
├─────────────────────────────┤
│                             │
│         游戏画布             │
│    (20×20 网格)             │
│                             │
├─────────────────────────────┤
│        陷阱指示器           │
├─────────────────────────────┤
│        方向控制按钮         │
├─────────────────────────────┤
│     开始/游戏结束菜单       │
└─────────────────────────────┘
```

### 3.2 视觉设计

#### 3.2.1 颜色方案
- 背景：深色 (#1a1a2e)
- 蛇身：绿色渐变（#22c55e，从头到尾逐渐变暗）
- 蛇头：略亮的绿色（#4ade80）
- 蛇眼：白色 (#ffffff)，圆形，大小为 cellSize * 0.08
- 普通食物：绿色 (#00ff88)，带发光效果
- 金色食物：金色 (#ffd700)，带强烈发光效果
- 彩虹食物：粉色 (#ff6b9d)，带发光效果
- 蓝色陷阱：蓝色 (#4488ff)，带 🔒 图标
- 紫色陷阱：紫色 (#9944ff)，带 ⚠️ 图标
- 障碍物：灰色 (#666666)
- 粒子：根据触发类型动态颜色
- 网格线：半透明白色 (rgba(255, 255, 255, 0.05))

#### 3.2.2 光晕效果
- 食物光晕：shadowBlur = cellSize * 0.3
- 蛇头无敌光晕：shadowBlur = cellSize * 0.4，颜色为金色
- 蛇身无敌光晕：shadowBlur = cellSize * 0.25，颜色为金色

#### 3.2.2 响应式设计
- 支持桌面端（键盘 + 鼠标）
- 支持移动端（触摸 + 屏幕按钮）
- 游戏画布自适应屏幕大小
- 触摸滑动灵敏度优化

### 3.3 组件结构

#### 3.3.1 主要组件
1. **App** - 主应用组件，管理游戏状态
2. **GameCanvas** - 游戏画布，渲染游戏元素
3. **ScoreBoard** - 分数板，显示分数和控制按钮
4. **ControlPanel** - 方向控制面板
5. **TrapIndicator** - 陷阱指示器，显示场上陷阱
6. **StartMenu** - 开始/游戏结束菜单

#### 3.3.2 自定义 Hooks
1. **useGameLoop** - 游戏循环控制
2. **useSnake** - 蛇的状态和逻辑
3. **useFood** - 食物生成和管理
4. **useTraps** - 陷阱生成和管理
5. **useAudio** - 音效和音量控制

---

## 4. 技术实现

### 4.1 配置常量

#### 4.1.1 游戏配置
```typescript
GAME_CONFIG = {
  GRID_SIZE: 20,              // 网格大小 20×20
  CELL_SIZE: 20,              // 每格像素大小（计算用，实际画布会自适应）
  INITIAL_SPEED: 200,         // 初始速度（ms）
  PARTICLE_COUNT: 12,         // 吃食物粒子数
  EXPLOSION_PARTICLE_COUNT: 10, // 游戏结束爆炸粒子数
  TRAP_CONFIG: {
    blue: { lockTime: 1000 },      // 蓝色陷阱锁定时间（1 秒）
    purple: { tailBreak: 3 }       // 紫色陷阱断裂节数（3 节）
  },
  SPECIAL_EFFECT_DURATION: {
    gold: 6000,                   // 金色食物效果持续时间（6 秒）
    rainbow: 6000                 // 彩虹食物效果持续时间（6 秒）
  }
}
```

#### 4.1.2 食物分数
```typescript
FOOD_SCORES = {
  normal: 10,   // 普通食物
  gold: 30,     // 金色食物
  rainbow: 20   // 彩虹食物
}
```

### 4.2 类型定义

```typescript
// 方向
type Direction = 'up' | 'down' | 'left' | 'right';

// 位置
interface Position {
  x: number;
  y: number;
}

// 蛇
interface Snake {
  body: Position[];
  direction: Direction;
  nextDirection: Direction;
  isLocked: boolean;
  lockEndTime: number;
  isInvincible: boolean;
  invincibleEndTime: number;
}

// 食物
interface Food {
  id: string;
  type: 'normal' | 'gold' | 'rainbow';
  position: Position;
}

// 陷阱
interface Trap {
  type: 'blue' | 'purple';
  position: Position;
}

// 粒子
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}
```

### 4.3 核心算法

#### 4.3.1 蛇移动
```typescript
function moveSnake(snake: Snake): Position {
  const head = snake.body[0];
  const dir = DIRECTIONS[snake.direction];
  return {
    x: head.x + dir.x,
    y: head.y + dir.y
  };
}
```

#### 4.3.2 碰撞检测
```typescript
function checkSelfCollision(snake: Snake): boolean {
  const head = snake.body[0];
  return snake.body.slice(1).some(
    segment => segment.x === head.x && segment.y === head.y
  );
}

function isOutOfBounds(position: Position): boolean {
  return position.x < 0 || position.x >= GAME_CONFIG.GRID_SIZE ||
         position.y < 0 || position.y >= GAME_CONFIG.GRID_SIZE;
}
```

#### 4.3.3 速度计算
```typescript
function calculateSpeed(snakeLength: number): number {
  const speedReduction = Math.floor((snakeLength - 3) / 3) * 10;
  return Math.max(50, 200 - speedReduction);
}
```

---

## 5. 部署要求

### 5.1 开发环境
```bash
npm install      # 安装依赖
npm run dev      # 启动开发服务器（http://localhost:5173）
```

### 5.2 生产构建
```bash
npm run build    # 构建生产版本
npm run preview  # 预览生产版本
```

### 5.3 代码检查
```bash
npm run lint     # 运行 ESLint 检查
```

---

## 6. 未来扩展

### 6.1 可选功能
- 多关卡模式
- 皮肤系统
- 成就系统
- 排行榜（后端）
- 多人对战模式
- 更多食物和陷阱类型
- 自定义网格大小
- AI 对手

### 6.2 性能优化
- 粒子系统优化
- 音效预加载
- 代码分割
- 离线缓存（PWA）

---

## 7. 版本历史

### v1.2.0（当前版本）
- **食物系统升级**：
  - 场上始终存在 2 个食物（初始 2 个，吃掉后立即补充）
  - 吃食物粒子数量从 10 个增加到 12 个，特效更平滑

- **陷阱系统优化**：
  - 从"每帧 2% 生成"改为"基于长度增量批量生成"
  - 每增长 3 节，75% 概率生成陷阱
  - 陷阱数量基于蛇身长度的三分之一，无硬上限
  - 实现真正的"实力与运气并存"机制

- **视觉效果增强**：
  - 吃到彩虹食物后，蛇身整体发出金色光晕
  - 蛇眼颜色从深色改为白色，更加醒目
  - 所有食物添加发光效果

- **特效优化**：
  - 粒子系统参数优化，运动更平滑自然
  - 无敌状态持续时间从 3 秒延长到 6 秒
  - 金色食物倍增持续时间从 5 秒延长到 6 秒

### v1.1.0
- 实现双食物系统
- 优化粒子效果
- 改进响应式布局

### v1.0.0
- 完成核心贪吃蛇玩法
- 实现多种食物类型
- 实现陷阱系统
- 添加粒子特效
- 实现音效系统
- 响应式设计
- 移动端支持

---

## 8. 文件结构

```
greedy_snake/
├── src/
│   ├── App.tsx                    # 主应用组件
│   ├── main.tsx                   # 应用入口
│   ├── game/
│   │   ├── Snake.ts              # 蛇的逻辑
│   │   ├── Food.ts               # 食物逻辑
│   │   ├── Trap.ts               # 陷阱逻辑
│   │   ├── Obstacle.ts           # 障碍物逻辑
│   │   ├── ParticleSystem.ts     # 粒子系统
│   │   └── InputHandler.ts       # 输入处理
│   ├── components/
│   │   ├── GameCanvas.tsx        # 游戏画布
│   │   ├── ScoreBoard.tsx        # 分数板
│   │   ├── ControlPanel.tsx      # 控制面板
│   │   ├── TrapIndicator.tsx    # 陷阱指示器
│   │   └── StartMenu.tsx         # 开始菜单
│   ├── hooks/
│   │   ├── useGameLoop.ts        # 游戏循环 hook
│   │   ├── useSnake.ts           # 蛇状态 hook
│   │   ├── useFood.ts            # 食物 hook
│   │   ├── useTraps.ts           # 陷阱 hook
│   │   └── useAudio.ts           # 音效 hook
│   └── utils/
│       ├── types.ts              # 类型定义
│       └── constants.ts          # 常量配置
├── public/
│   └── assets/
│       └── audio/                # 音效文件
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

**文档版本**: 1.2.0
**最后更新**: 2026-01-29
**维护者**: 开发团队
