import { useEffect, useRef } from 'react';
import { Snake, Food, Trap, Obstacle, Particle } from '../utils/types';
import { COLORS, GAME_CONFIG } from '../utils/constants';
import { getTrapRemainingTime } from '../game/Trap';
import { updateParticles } from '../game/ParticleSystem';

interface GameCanvasProps {
  snake: Snake;
  foods: Food[];
  traps: Trap[];
  obstacles: Obstacle[];
  particles: Particle[];
  isRunning: boolean;
  setParticles: React.Dispatch<React.SetStateAction<Particle[]>>;
}

export function GameCanvas({
  snake,
  foods,
  traps,
  obstacles,
  particles,
  isRunning,
  setParticles,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 独立的粒子更新循环（60fps）
  useEffect(() => {
    let animationFrameId: number;
    let lastUpdate = 0;
    const PARTICLE_UPDATE_INTERVAL = 16.67; // 约60fps

    const updateParticlesLoop = (timestamp: number) => {
      if (timestamp - lastUpdate >= PARTICLE_UPDATE_INTERVAL) {
        if (isRunning) {
          setParticles(prev => updateParticles(prev));
        }
        lastUpdate = timestamp;
      }
      animationFrameId = requestAnimationFrame(updateParticlesLoop);
    };

    animationFrameId = requestAnimationFrame(updateParticlesLoop);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isRunning, setParticles]);

  // 响应式画布尺寸
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current && canvasRef.current) {
        // 计算可用空间（减去顶部分数板、底部图例和边距）
        const topOffset = 80; // 分数板高度
        const bottomOffset = 60; // 图例高度
        const sideMargin = 32;
        const verticalMargin = topOffset + bottomOffset + 40;

        // 计算最大可用尺寸（尽可能大但不溢出）
        const maxWidth = window.innerWidth - sideMargin;
        const maxHeight = window.innerHeight - verticalMargin;

        // 保持正方形比例
        const size = Math.min(maxWidth, maxHeight);

        canvasRef.current.width = size;
        canvasRef.current.height = size;
      }
    };

    updateCanvasSize();

    // 监听窗口大小变化
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 计算动态单元格大小
    const cellSize = canvas.width / GAME_CONFIG.GRID_SIZE;

    // 清空画布
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制网格
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GAME_CONFIG.GRID_SIZE; i++) {
      const pos = i * cellSize;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(canvas.width, pos);
      ctx.stroke();
    }

    // 绘制障碍物
    obstacles.forEach(obstacle => {
      ctx.fillStyle = COLORS.obstacle;
      ctx.fillRect(
        obstacle.position.x * cellSize,
        obstacle.position.y * cellSize,
        cellSize,
        cellSize
      );
    });

    // 绘制陷阱
    traps.forEach(trap => {
      const remainingTime = getTrapRemainingTime(trap);
      const opacity = Math.min(1, remainingTime / 1000 / 5 + 0.2);

      ctx.globalAlpha = opacity;
      ctx.fillStyle = trap.type === 'blue' ? COLORS.trapBlue : COLORS.trapPurple;

      const x = trap.position.x * cellSize;
      const y = trap.position.y * cellSize;
      const size = cellSize;
      const padding = Math.max(2, size * 0.08);

      ctx.fillRect(x + padding, y + padding, size - padding * 2, size - padding * 2);

      // 绘制图标
      ctx.fillStyle = '#ffffff';
      ctx.font = `${Math.max(8, size * 0.4)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        trap.type === 'blue' ? '🔒' : '⚠️',
        x + size / 2,
        y + size / 2
      );

      ctx.globalAlpha = 1;
    });

    // 绘制食物
    foods.forEach(food => {
      const x = food.position.x * cellSize + cellSize / 2;
      const y = food.position.y * cellSize + cellSize / 2;
      const radius = cellSize / 2 - Math.max(2, cellSize * 0.1);

      // 发光效果
      ctx.shadowBlur = Math.max(10, cellSize * 0.3);
      ctx.shadowColor = food.type === 'gold' ? COLORS.foodGold :
                       food.type === 'rainbow' ? COLORS.foodRainbow :
                       COLORS.foodNormal;

      ctx.fillStyle = food.type === 'gold' ? COLORS.foodGold :
                      food.type === 'rainbow' ? COLORS.foodRainbow :
                      COLORS.foodNormal;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
    });

    // 绘制蛇
    snake.body.forEach((segment, index) => {
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;
      const size = cellSize;
      const padding = cellSize * 0.03;

      // 蛇头
      if (index === 0) {
        ctx.fillStyle = snake.isInvincible ? COLORS.snakeInvincible : COLORS.snakeHead;

        // 发光效果
        if (snake.isInvincible) {
          ctx.shadowBlur = Math.max(15, cellSize * 0.4);
          ctx.shadowColor = COLORS.snakeInvincible;
        }

        // 绘制圆形蛇头
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2 - padding, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 绘制眼睛
        ctx.fillStyle = '#ffffff';
        const eyeSize = Math.max(2, cellSize * 0.08);
        const eyePadding = cellSize * 0.2;

        switch (snake.direction) {
          case 'up':
            ctx.beginPath();
            ctx.arc(x + eyePadding, y + eyePadding, eyeSize, 0, Math.PI * 2);
            ctx.arc(x + size - eyePadding, y + eyePadding, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'down':
            ctx.beginPath();
            ctx.arc(x + eyePadding, y + size - eyePadding, eyeSize, 0, Math.PI * 2);
            ctx.arc(x + size - eyePadding, y + size - eyePadding, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'left':
            ctx.beginPath();
            ctx.arc(x + eyePadding, y + eyePadding, eyeSize, 0, Math.PI * 2);
            ctx.arc(x + eyePadding, y + size - eyePadding, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'right':
            ctx.beginPath();
            ctx.arc(x + size - eyePadding, y + eyePadding, eyeSize, 0, Math.PI * 2);
            ctx.arc(x + size - eyePadding, y + size - eyePadding, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            break;
        }
      } else {
        // 蛇身 - 使用圆形绘制
        const radius = size / 2 - padding;
        const centerX = x + size / 2;
        const centerY = y + size / 2;

        // 颜色渐变：从头部到尾部逐渐变暗
        const colorFactor = 1 - (index / snake.body.length) * 0.3;
        const baseColor = snake.isInvincible ? COLORS.foodGold : COLORS.snakeBody;
        const r = Math.floor(parseInt(baseColor.slice(1, 3), 16) * colorFactor);
        const g = Math.floor(parseInt(baseColor.slice(3, 5), 16) * colorFactor);
        const b = Math.floor(parseInt(baseColor.slice(5, 7), 16) * colorFactor);

        // 无敌状态时添加金色光晕
        if (snake.isInvincible) {
          ctx.shadowBlur = Math.max(10, cellSize * 0.25);
          ctx.shadowColor = COLORS.foodGold;
        }

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    // 绘制粒子
    const scaleRatio = cellSize / GAME_CONFIG.CELL_SIZE;
    particles.forEach(particle => {
      ctx.globalAlpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color;
      const scaledSize = particle.size * scaleRatio;
      ctx.beginPath();
      ctx.arc(particle.x * scaleRatio, particle.y * scaleRatio, scaledSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }, [snake, foods, traps, obstacles, particles]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center w-full max-w-[95vw] max-h-[70vh]"
    >
      <canvas
        ref={canvasRef}
        className="rounded-2xl shadow-2xl"
      />
    </div>
  );
}
