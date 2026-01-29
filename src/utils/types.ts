export type Direction = 'up' | 'down' | 'left' | 'right';

export type FoodType = 'normal' | 'gold' | 'rainbow';

export type TrapType = 'blue' | 'purple';

export interface Position {
  x: number;
  y: number;
}

export interface Snake {
  body: Position[];
  direction: Direction;
  nextDirection: Direction;
  isLocked: boolean;
  lockEndTime: number;
  isInvincible: boolean;
  invincibleEndTime: number;
  isGrowing: boolean;
  initialLength: number;
}

export interface Food {
  position: Position;
  type: FoodType;
  spawnTime: number;
}

export interface Trap {
  position: Position;
  type: TrapType;
  spawnTime: number;
  expiryTime: number;
}

export interface Obstacle {
  position: Position;
  createTime: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
  size: number;
}

export interface GameState {
  isRunning: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  speed: number;
  snake: Snake;
  foods: Food[];
  traps: Trap[];
  obstacles: Obstacle[];
  particles: Particle[];
  scoreMultiplier: number;
  scoreMultiplierEndTime: number;
}

export interface GameConfig {
  CANVAS_SIZE: number;
  GRID_SIZE: number;
  CELL_SIZE: number;
  INITIAL_SPEED: number;
  FOOD_PROBABILITY: {
    normal: number;
    gold: number;
    rainbow: number;
  };
  TRAP_CONFIG: {
    blue: {
      duration: number;
      spawnRate: number;
      lockTime: number;
    };
    purple: {
      duration: number;
      spawnRate: number;
      tailBreak: number;
    };
  };
}
