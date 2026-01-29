import { GameConfig } from './types';

export const GAME_CONFIG: GameConfig = {
  CANVAS_SIZE: 600,
  GRID_SIZE: 30,
  CELL_SIZE: 600 / 30,
  INITIAL_SPEED: 200,
  FOOD_PROBABILITY: {
    normal: 0.65,
    gold: 0.2,
    rainbow: 0.15,
  },
  TRAP_CONFIG: {
    blue: {
      duration: 15000,
      spawnRate: 0.12,
      lockTime: 1000, 
    },
    purple: {
      duration: 20000,
      spawnRate: 0.08,
      tailBreak: 2,
    },
  },
};

export const COLORS = {
  background: '#1a1a2e',
  snakeHead: '#4ade80',
  snakeBody: '#22c55e',
  snakeInvincible: '#ffd700',
  foodNormal: '#00ff88',
  foodGold: '#ffd700',
  foodRainbow: '#ff6b9d',
  trapBlue: '#3b82f6',
  trapPurple: '#8b5cf6',
  obstacle: '#6b7280',
  particle: '#ffffff',
};

export const FOOD_SCORES = {
  normal: 10,
  gold: 20,
  rainbow: 30,
};

export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export const OPPOSITE_DIRECTION: Record<string, string> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};
