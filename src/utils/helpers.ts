import { Position } from './types';
import { GAME_CONFIG } from './constants';

export function getRandomPosition(occupiedPositions: Position[] = []): Position {
  let position: Position;
  let attempts = 0;
  const maxAttempts = 1000;

  do {
    position = {
      x: Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE),
      y: Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE),
    };
    attempts++;
  } while (
    isPositionOccupied(position, occupiedPositions) &&
    attempts < maxAttempts
  );

  return position;
}

export function isPositionOccupied(
  position: Position,
  positions: Position[]
): boolean {
  return positions.some(
    (p) => p.x === position.x && p.y === position.y
  );
}

export function getRandomFoodType(): 'normal' | 'gold' | 'rainbow' {
  const rand = Math.random();
  const { gold, rainbow } = GAME_CONFIG.FOOD_PROBABILITY;

  if (rand < rainbow) {
    return 'rainbow';
  } else if (rand < rainbow + gold) {
    return 'gold';
  } else {
    return 'normal';
  }
}

export function getRandomTrapType(): 'blue' | 'purple' | null {
  const rand = Math.random();
  const { blue, purple } = GAME_CONFIG.TRAP_CONFIG;

  if (rand < purple.spawnRate) {
    return 'purple';
  } else if (rand < purple.spawnRate + blue.spawnRate) {
    return 'blue';
  } else {
    return null;
  }
}

export function createParticle(
  x: number,
  y: number,
  color: string,
  count: number = 5
) {
  return Array.from({ length: count }, () => ({
    x,
    y,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    color,
    life: 1.0,
    maxLife: 1.0,
    size: Math.random() * 2 + 2,
  }));
}
