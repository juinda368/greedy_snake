import { useState, useCallback, useEffect } from 'react';
import { Trap } from '../utils/types';
import { createTrap, isTrapExpired } from '../game/Trap';

export function useTraps() {
  const [traps, setTraps] = useState<Trap[]>([]);

  // 定期清理过期陷阱
  useEffect(() => {
    const interval = setInterval(() => {
      setTraps(currentTraps =>
        currentTraps.filter(trap => !isTrapExpired(trap))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const spawnTrap = useCallback((occupiedPositions: { x: number; y: number }[]) => {
    const trap = createTrap(occupiedPositions);
    if (trap) {
      setTraps(currentTraps => [...currentTraps, trap]);
      return trap;
    }
    return null;
  }, []);

  const batchSpawnTraps = useCallback((count: number, occupiedPositions: { x: number; y: number }[]) => {
    const newTraps: Trap[] = [];
    let currentOccupied = [...occupiedPositions];

    for (let i = 0; i < count; i++) {
      const trap = createTrap(currentOccupied);
      if (trap) {
        newTraps.push(trap);
        currentOccupied = [...currentOccupied, trap.position];
      }
    }

    if (newTraps.length > 0) {
      setTraps(currentTraps => [...currentTraps, ...newTraps]);
    }

    return newTraps;
  }, []);

  const getTrapAtPosition = useCallback((position: { x: number; y: number }) => {
    return traps.find(trap =>
      trap.position.x === position.x && trap.position.y === position.y
    );
  }, [traps]);

  const removeTrap = useCallback((position: { x: number; y: number }) => {
    setTraps(currentTraps =>
      currentTraps.filter(trap =>
        !(trap.position.x === position.x && trap.position.y === position.y)
      )
    );
  }, []);

  const reset = useCallback(() => {
    setTraps([]);
  }, []);

  return {
    traps,
    spawnTrap,
    batchSpawnTraps,
    getTrapAtPosition,
    removeTrap,
    reset,
  };
}
