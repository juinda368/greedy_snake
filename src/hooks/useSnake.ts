import { useState, useCallback } from 'react';
import { Direction } from '../utils/types';
import {
  createInitialSnake,
  moveSnakeWithoutGrowing,
  moveSnakeWithGrowing,
  changeDirection,
  updateDirection,
  updateLockStatus,
  updateInvincibilityStatus,
} from '../game/Snake';

export function useSnake() {
  const [snake, setSnake] = useState(() => createInitialSnake());

  const move = useCallback(() => {
    setSnake((currentSnake) => {
      let newSnake = updateLockStatus(currentSnake);
      newSnake = updateInvincibilityStatus(newSnake);
      newSnake = updateDirection(newSnake);
      
      // 根据isGrowing标志选择不同的移动逻辑
      if (newSnake.isGrowing) {
        return moveSnakeWithGrowing(newSnake);
      } else {
        return moveSnakeWithoutGrowing(newSnake);
      }
    });
  }, []);

  const grow = useCallback(() => {
    setSnake((currentSnake) => ({
      ...currentSnake,
      isGrowing: true,
    }));
  }, []);

  const handleDirectionChange = useCallback((newDirection: Direction) => {
    setSnake((currentSnake) => changeDirection(currentSnake, newDirection));
  }, []);

  const reset = useCallback(() => {
    setSnake(createInitialSnake());
  }, []);

  const lockDirection = useCallback((duration: number) => {
    setSnake((currentSnake) => ({
      ...currentSnake,
      isLocked: true,
      lockEndTime: Date.now() + duration,
    }));
  }, []);

  const activateInvincibility = useCallback((duration: number) => {
    setSnake((currentSnake) => ({
      ...currentSnake,
      isInvincible: true,
      invincibleEndTime: Date.now() + duration,
    }));
  }, []);

  const breakTail = useCallback((count: number) => {
    setSnake((currentSnake) => {
      const newBody = currentSnake.body.slice(0, Math.max(1, currentSnake.body.length - count));
      const newObstacles = currentSnake.body.slice(-count);
      return {
        ...currentSnake,
        body: newBody,
      };
    });
  }, []);

  const updateInitialLength = useCallback((newLength: number) => {
    setSnake((currentSnake) => ({
      ...currentSnake,
      initialLength: newLength,
    }));
  }, []);

  return {
    snake,
    move,
    grow,
    handleDirectionChange,
    reset,
    lockDirection,
    activateInvincibility,
    breakTail,
    updateInitialLength,
    getTailSegments: (count: number) => snake.body.slice(-count),
  };
}
