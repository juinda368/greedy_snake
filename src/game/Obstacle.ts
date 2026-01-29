import { Obstacle } from '../utils/types';

export function createObstacle(position: { x: number; y: number }): Obstacle {
  return {
    position,
    createTime: Date.now(),
  };
}

export function mergeObstacles(existing: Obstacle[], newPositions: { x: number; y: number }[]): Obstacle[] {
  const newObstacles = newPositions.map(pos => createObstacle(pos));
  return [...existing, ...newObstacles];
}
