import { useState, useEffect, useCallback, useRef } from 'react';
import { Direction, Particle } from './utils/types';
import { GAME_CONFIG, FOOD_SCORES } from './utils/constants';
import { isOutOfBounds, checkSelfCollision, checkObstacleCollision, calculateSpeed } from './game/Snake';
import { addParticles } from './game/ParticleSystem';
import { InputHandler } from './game/InputHandler';
import { useGameLoop } from './hooks/useGameLoop';
import { useSnake } from './hooks/useSnake';
import { useFood } from './hooks/useFood';
import { useTraps } from './hooks/useTraps';
import { useAudio } from './hooks/useAudio';
import { GameCanvas } from './components/GameCanvas';
import { ScoreBoard } from './components/ScoreBoard';
import { ControlPanel } from './components/ControlPanel';
import { TrapIndicator } from './components/TrapIndicator';
import { GameLegend } from './components/GameLegend';
import { StartMenu } from './components/StartMenu';
import { mergeObstacles } from './game/Obstacle';

interface GameState {
  isRunning: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  speed: number;
  scoreMultiplier: number;
  scoreMultiplierEndTime: number;
  speedMultiplier: number;
  speedMultiplierEndTime: number;
}

export default function App() {
  // 游戏状态
  const [gameState, setGameState] = useState<GameState>({
    isRunning: false,
    isPaused: false,
    isGameOver: false,
    score: 0,
    highScore: parseInt(localStorage.getItem('highScore') || '0'),
    speed: GAME_CONFIG.INITIAL_SPEED,
    scoreMultiplier: 1,
    scoreMultiplierEndTime: 0,
    speedMultiplier: 1,
    speedMultiplierEndTime: 0,
  });

  // 粒子状态
  const [particles, setParticles] = useState<Particle[]>([]);

  // 障碍物状态
  const [obstacles, setObstacles] = useState<{ position: { x: number; y: number }; createTime: number }[]>([]);

  // 自定义hooks
  const { snake, move, grow, handleDirectionChange, reset: resetSnake, lockDirection, activateInvincibility, breakTail, updateInitialLength, getTailSegments } = useSnake();
  const { foods, spawnFood, eatFood, reset: resetFood } = useFood();
  const { traps, spawnTrap, batchSpawnTraps, getTrapAtPosition, removeTrap, reset: resetTraps } = useTraps();
  const { playSound, playBGM, stopBGM, volume, isMuted, setVolume, toggleMute } = useAudio();

  const inputHandlerRef = useRef<InputHandler>(new InputHandler());

  // 设置输入处理
  useEffect(() => {
    const handler = inputHandlerRef.current;

    const unsubscribe = handler.onDirectionChange((direction: Direction) => {
      if (gameState.isRunning && !gameState.isPaused) {
        handleDirectionChange(direction);
      }
    });

    window.addEventListener('keydown', handler.handleKeyDown.bind(handler));
    window.addEventListener('touchstart', handler.handleTouchStart.bind(handler), { passive: false });
    window.addEventListener('touchmove', handler.handleTouchMove.bind(handler), { passive: false });
    window.addEventListener('touchend', handler.handleTouchEnd.bind(handler), { passive: false });

    return () => {
      unsubscribe();
      window.removeEventListener('keydown', handler.handleKeyDown.bind(handler));
      window.removeEventListener('touchstart', handler.handleTouchStart.bind(handler));
      window.removeEventListener('touchmove', handler.handleTouchMove.bind(handler));
      window.removeEventListener('touchend', handler.handleTouchEnd.bind(handler));
    };
  }, [gameState.isRunning, gameState.isPaused, handleDirectionChange]);

  // 开始游戏
  const startGame = useCallback(() => {
    setGameState({
      isRunning: true,
      isPaused: false,
      isGameOver: false,
      score: 0,
      highScore: gameState.highScore,
      speed: GAME_CONFIG.INITIAL_SPEED,
      scoreMultiplier: 1,
      scoreMultiplierEndTime: 0,
      speedMultiplier: 1,
      speedMultiplierEndTime: 0,
    });
    setParticles([]);
    setObstacles([]);
    resetSnake();
    resetFood();
    resetTraps();
  }, [gameState.highScore, resetSnake, resetFood, resetTraps]);

  // 暂停/继续
  const togglePause = useCallback(() => {
    if (gameState.isGameOver) return;
    setGameState(prev => {
      const newPaused = !prev.isPaused;
      if (newPaused) {
        playBGM('');
      } else {
        playBGM('/assets/audio/bgm.mp3');
      }
      return { ...prev, isPaused: newPaused };
    });
  }, [gameState.isGameOver, playBGM]);

  // 重新开始
  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  // 游戏主循环
  const gameTick = useCallback(() => {
    move();

    // 获取新的蛇头位置
    const newHead = snake.body[0];

    // 检查碰撞
    const outOfBounds = isOutOfBounds(newHead);
    const selfCollision = checkSelfCollision(snake);
    const obstacleCollision = checkObstacleCollision(snake, obstacles);

    if (outOfBounds || selfCollision || obstacleCollision) {
      if (!snake.isInvincible) {
        // 游戏结束
        playSound('gameover');
        stopBGM();

        // 爆炸粒子效果
        const explosionParticles = addParticles([], newHead.x * GAME_CONFIG.CELL_SIZE + GAME_CONFIG.CELL_SIZE / 2, newHead.y * GAME_CONFIG.CELL_SIZE + GAME_CONFIG.CELL_SIZE / 2, '#ff4444', 10);
        setParticles(explosionParticles);

        setGameState(prev => ({
          ...prev,
          isRunning: false,
          isGameOver: true,
          highScore: Math.max(prev.score, prev.highScore),
        }));
        localStorage.setItem('highScore', Math.max(gameState.score, gameState.highScore).toString());
        return;
      }
    }

    // 检查食物
    const eatenFood = foods.find(food => food.position.x === newHead.x && food.position.y === newHead.y);
    if (eatenFood) {
      const multiplier = gameState.scoreMultiplierEndTime > Date.now() ? 2 : 1;
      const score = FOOD_SCORES[eatenFood.type] * multiplier;

      grow();
      setGameState(prev => ({
        ...prev,
        score: prev.score + score,
        speed: calculateSpeed(snake.body.length),
      }));

      // 粒子效果
      const color = eatenFood.type === 'gold' ? '#ffd700' : eatenFood.type === 'rainbow' ? '#ff6b9d' : '#00ff88';
      setParticles(prev => addParticles(prev, newHead.x * GAME_CONFIG.CELL_SIZE + GAME_CONFIG.CELL_SIZE / 2, newHead.y * GAME_CONFIG.CELL_SIZE + GAME_CONFIG.CELL_SIZE / 2, color, 12));

      // 播放音效
      playSound(`eat-${eatenFood.type}`);

      // 特殊效果
      if (eatenFood.type === 'gold') {
        setGameState(prev => ({
          ...prev,
          scoreMultiplier: 2,
          scoreMultiplierEndTime: Date.now() + 6000,
        }));
      } else if (eatenFood.type === 'rainbow') {
        activateInvincibility(6000);
        setGameState(prev => ({
          ...prev,
          speedMultiplier: 1.5,
          speedMultiplierEndTime: Date.now() + 6000,
        }));
        playSound('invincible');
      }

      // 移除被吃掉的食物
      eatFood(eatenFood.position, multiplier);

      // 立即补充新食物
      const allOccupied = [...snake.body, ...obstacles.map(o => o.position), ...foods.filter(f => f !== eatenFood).map(f => f.position)];
      if (foods.length <= 2) {
        spawnFood(allOccupied);
      }
    }

    // 检查陷阱
    const trap = getTrapAtPosition(newHead);
    if (trap && !snake.isInvincible) {
      if (trap.type === 'blue') {
        lockDirection(1000);
        playSound('trap-blue');
      } else if (trap.type === 'purple') {
        const tailSegments = getTailSegments(GAME_CONFIG.TRAP_CONFIG.purple.tailBreak);
        setObstacles(prev => mergeObstacles(prev, tailSegments));
        breakTail(GAME_CONFIG.TRAP_CONFIG.purple.tailBreak);
        playSound('trap-purple');
      }
      removeTrap(trap.position);
    }

    // 基于长度增量批量生成陷阱
    const lengthIncrement = snake.body.length - snake.initialLength;
    const allOccupied = [...snake.body, ...obstacles.map(o => o.position), ...foods.map(f => f.position), ...traps.map(t => t.position)];

    // 每增加3节，有80%概率批量生成陷阱
    if (lengthIncrement > 0 && lengthIncrement % 3 === 0 && Math.random() < 0.8) {
      // 陷阱数量：不超过蛇身长度的三分之一，减去已有陷阱数量
      const maxTraps = Math.floor(snake.body.length / 3);
      const trapCount = Math.max(1, maxTraps - traps.length);
      batchSpawnTraps(trapCount, allOccupied);

      // 更新初始长度以避免重复触发
      updateInitialLength(snake.body.length);
    }

    // 更新分数倍数
    if (gameState.scoreMultiplierEndTime < Date.now()) {
      setGameState(prev => ({ ...prev, scoreMultiplier: 1 }));
    }
  }, [move, snake, obstacles, foods, gameState.scoreMultiplierEndTime, gameState.scoreMultiplier, gameState.score, gameState.highScore, playSound, stopBGM, grow, activateInvincibility, getTailSegments, breakTail, spawnFood, getTrapAtPosition, removeTrap, lockDirection, traps, spawnTrap, calculateSpeed]);

  // 使用游戏循环
  useGameLoop({
    isRunning: gameState.isRunning,
    isPaused: gameState.isPaused,
    speed: gameState.speed,
    onTick: gameTick,
  });

  // 播放BGM
  useEffect(() => {
    if (gameState.isRunning && !gameState.isPaused) {
      playBGM('/assets/audio/bgm.mp3');
    }
  }, [gameState.isRunning, gameState.isPaused, playBGM]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <ScoreBoard
        score={gameState.score}
        highScore={gameState.highScore}
        volume={volume}
        isMuted={isMuted}
        isPaused={gameState.isPaused}
        isRunning={gameState.isRunning}
        onVolumeChange={setVolume}
        onToggleMute={toggleMute}
        onPauseResume={togglePause}
        onRestart={restartGame}
      />

      <div className="mt-20 mb-20">
        <GameCanvas
          snake={snake}
          foods={foods}
          traps={traps}
          obstacles={obstacles}
          particles={particles}
          isRunning={gameState.isRunning}
          setParticles={setParticles}
        />
      </div>

      <TrapIndicator traps={traps} />

      <GameLegend />

      <ControlPanel onDirectionChange={handleDirectionChange} />

      {!gameState.isRunning && (
        <StartMenu
          isGameOver={gameState.isGameOver}
          score={gameState.score}
          highScore={gameState.highScore}
          onStart={startGame}
          onRestart={restartGame}
        />
      )}
    </div>
  );
}
