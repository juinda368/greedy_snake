import { useState, useCallback } from 'react';
import { Food } from '../utils/types';
import { createFood, getFoodScore } from '../game/Food';

export function useFood() {
  const [foods, setFoods] = useState<Food[]>(() => [createFood([]), createFood([])]);

  const spawnFood = useCallback((occupiedPositions: { x: number; y: number }[]) => {
    setFoods(currentFoods => {
      const allPositions = [...occupiedPositions];
      currentFoods.forEach(food => allPositions.push(food.position));

      if (currentFoods.length < 2) {
        return [...currentFoods, createFood(allPositions)];
      }
      return currentFoods;
    });
  }, []);

  const eatFood = useCallback((position: { x: number; y: number }, scoreMultiplier: number = 1) => {
    const eatenIndex = foods.findIndex(food => 
      food.position.x === position.x && food.position.y === position.y
    );

    if (eatenIndex === -1) return { score: 0, type: null as string | null };

    const eatenFood = foods[eatenIndex];
    const score = getFoodScore(eatenFood, scoreMultiplier);

    setFoods(currentFoods => {
      const newFoods = [...currentFoods];
      newFoods.splice(eatenIndex, 1);
      return newFoods;
    });

    return { score, type: eatenFood.type };
  }, [foods]);

  const reset = useCallback(() => {
    setFoods([createFood([]), createFood([])]);
  }, []);

  return {
    foods,
    spawnFood,
    eatFood,
    reset,
  };
}
