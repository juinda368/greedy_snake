import { Particle } from '../utils/types';
import { createParticle } from '../utils/helpers';

export function addParticles(
  particles: Particle[],
  x: number,
  y: number,
  color: string,
  count: number = 5
): Particle[] {
  return [...particles, ...createParticle(x, y, color, count)];
}

export function updateParticles(particles: Particle[]): Particle[] {
  return particles
    .map((particle) => ({
      ...particle,
      x: particle.x + particle.vx * 2.5, // 适中的横向扩散速度
      y: particle.y + particle.vy * 2.5, // 适中的纵向扩散速度
      life: particle.life - 0.06, // 更慢的消失速度，动画更平滑
      vy: particle.vy + 0.03, // 更小的重力影响
    }))
    .filter((particle) => particle.life > 0);
}

export function removeAllParticles(): Particle[] {
  return [];
}
