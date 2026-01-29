import { Food, Position } from '../utils/types';
import { GAME_CONFIG, FOOD_SCORES } from '../utils/constants';
import { getRandomPosition, getRandomFoodType, isPositionOccupied } from '../utils/helpers';

export function createFood(occupiedPositions: Position[]): Food {
  const type = getRandomFoodType();
  const position = getRandomPosition(occupiedPositions);

  return {
    position,
    type,
    spawnTime: Date.now(),
  };
}

export function getFoodScore(food: Food, multiplier: number): number {
  const baseScore = FOOD_SCORES[food.type];
  return Math.floor(baseScore * multiplier);
}

export function calculateSpeed(snakeLength: number): number {
  const baseSpeed = GAME_CONFIG.INITIAL_SPEED;
  // 阶梯式加速：每增长5节，速度提升10ms
  const speedReduction = Math.floor(snakeLength / 5) * 10;
  return Math.max(80, baseSpeed - speedReduction); // 最快80ms
}
