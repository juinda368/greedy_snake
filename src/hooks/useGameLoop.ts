import { useEffect, useRef } from 'react';
import { GameState } from '../utils/types';

interface UseGameLoopOptions {
  isRunning: boolean;
  isPaused: boolean;
  speed: number;
  onTick: () => void;
}

export function useGameLoop({
  isRunning,
  isPaused,
  speed,
  onTick,
}: UseGameLoopOptions) {
  const lastTickRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      if (!isRunning || isPaused) {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      if (timestamp - lastTickRef.current >= speed) {
        onTick();
        lastTickRef.current = timestamp;
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, isPaused, speed, onTick]);
}
