import { Direction, Position, Snake } from '../utils/types';
import { DIRECTIONS, OPPOSITE_DIRECTION, GAME_CONFIG } from '../utils/constants';

export function createInitialSnake(): Snake {
  const centerX = Math.floor(GAME_CONFIG.GRID_SIZE / 2);
  const centerY = Math.floor(GAME_CONFIG.GRID_SIZE / 2);

  return {
    body: [
      { x: centerX, y: centerY },
      { x: centerX, y: centerY + 1 },
      { x: centerX, y: centerY + 2 },
    ],
    direction: 'up',
    nextDirection: 'up',
    isLocked: false,
    lockEndTime: 0,
    isInvincible: false,
    invincibleEndTime: 0,
    isGrowing: false,
    initialLength: 3,
  };
}

export function moveSnake(snake: Snake): Position {
  const { body, direction } = snake;
  const head = body[0];
  const dir = DIRECTIONS[direction];

  return {
    x: head.x + dir.x,
    y: head.y + dir.y,
  };
}

export function growSnake(snake: Snake): Snake {
  const newHead = moveSnake(snake);
  return {
    ...snake,
    body: [newHead, ...snake.body],
  };
}

export function moveSnakeWithoutGrowing(snake: Snake): Snake {
  const newHead = moveSnake(snake);
  const newBody = [newHead, ...snake.body.slice(0, -1)];
  return {
    ...snake,
    body: newBody,
    isGrowing: false,
  };
}

export function moveSnakeWithGrowing(snake: Snake): Snake {
  const newHead = moveSnake(snake);
  const newBody = [newHead, ...snake.body];
  return {
    ...snake,
    body: newBody,
    isGrowing: false,
  };
}

export function canChangeDirection(
  snake: Snake,
  newDirection: Direction
): boolean {
  if (snake.isLocked) {
    return false;
  }
  return OPPOSITE_DIRECTION[newDirection] !== snake.direction;
}

export function changeDirection(snake: Snake, newDirection: Direction): Snake {
  if (!canChangeDirection(snake, newDirection)) {
    return snake;
  }
  return {
    ...snake,
    nextDirection: newDirection,
  };
}

export function updateDirection(snake: Snake): Snake {
  if (snake.direction !== snake.nextDirection) {
    return {
      ...snake,
      direction: snake.nextDirection,
    };
  }
  return snake;
}

export function isOutOfBounds(position: Position): boolean {
  return (
    position.x < 0 ||
    position.x >= GAME_CONFIG.GRID_SIZE ||
    position.y < 0 ||
    position.y >= GAME_CONFIG.GRID_SIZE
  );
}

export function checkSelfCollision(snake: Snake): boolean {
  const head = snake.body[0];
  return snake.body.slice(1).some(
    (segment) => segment.x === head.x && segment.y === head.y
  );
}

export function checkObstacleCollision(
  snake: Snake,
  obstacles: { position: Position }[]
): boolean {
  const head = snake.body[0];
  return obstacles.some(
    (obstacle) => obstacle.position.x === head.x && obstacle.position.y === head.y
  );
}

export function lockDirection(snake: Snake, duration: number): Snake {
  return {
    ...snake,
    isLocked: true,
    lockEndTime: Date.now() + duration,
  };
}

export function updateLockStatus(snake: Snake): Snake {
  if (snake.isLocked && Date.now() >= snake.lockEndTime) {
    return {
      ...snake,
      isLocked: false,
      lockEndTime: 0,
    };
  }
  return snake;
}

export function activateInvincibility(snake: Snake, duration: number): Snake {
  return {
    ...snake,
    isInvincible: true,
    invincibleEndTime: Date.now() + duration,
  };
}

export function updateInvincibilityStatus(snake: Snake): Snake {
  if (snake.isInvincible && Date.now() >= snake.invincibleEndTime) {
    return {
      ...snake,
      isInvincible: false,
      invincibleEndTime: 0,
    };
  }
  return snake;
}

export function breakSnakeTail(snake: Snake, count: number): {
  snake: Snake;
  newObstacles: Position[];
} {
  const newBody = snake.body.slice(0, snake.body.length - count);
  const newObstacles = snake.body.slice(-count);

  return {
    snake: {
      ...snake,
      body: newBody,
    },
    newObstacles,
  };
}

export function calculateSpeed(snakeLength: number): number {
  const INITIAL_SPEED = GAME_CONFIG.INITIAL_SPEED;
  const MIN_SPEED = 50; // 最小间隔（最快速度）
  
  // 每3节身体减少10ms的间隔（加速）
  // 速度从初始的200ms递减到最低50ms
  const speedReduction = Math.floor((snakeLength - 3) / 3) * 10;
  const newSpeed = Math.max(MIN_SPEED, INITIAL_SPEED - speedReduction);
  
  return newSpeed;
}
