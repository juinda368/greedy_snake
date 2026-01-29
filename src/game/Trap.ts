import { Trap, Position, Obstacle } from '../utils/types';
import { GAME_CONFIG } from '../utils/constants';
import { getRandomPosition, getRandomTrapType, isPositionOccupied } from '../utils/helpers';

export function createTrap(occupiedPositions: Position[]): Trap | null {
  const type = getRandomTrapType();
  if (!type) return null;

  const position = getRandomPosition(occupiedPositions);

  const config = GAME_CONFIG.TRAP_CONFIG[type];
  return {
    position,
    type,
    spawnTime: Date.now(),
    expiryTime: Date.now() + config.duration,
  };
}

export function isTrapExpired(trap: Trap): boolean {
  return Date.now() >= trap.expiryTime;
}

export function updateTraps(traps: Trap[]): Trap[] {
  return traps.filter((trap) => !isTrapExpired(trap));
}

export function getTrapRemainingTime(trap: Trap): number {
  return Math.max(0, trap.expiryTime - Date.now());
}
