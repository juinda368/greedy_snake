import { Direction } from '../utils/types';

export class InputHandler {
  private callbacks: Map<string, (direction: Direction) => void> = new Map();
  private touchStartX: number = 0;
  private touchStartY: number = 0;

  onDirectionChange(callback: (direction: Direction) => void): () => void {
    const id = Math.random().toString(36);
    this.callbacks.set(id, callback);
    return () => this.callbacks.delete(id);
  }

  handleKeyDown(event: KeyboardEvent): void {
    let direction: Direction | null = null;

    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        direction = 'up';
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        direction = 'down';
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        direction = 'left';
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        direction = 'right';
        break;
    }

    if (direction) {
      event.preventDefault();
      this.callbacks.forEach((callback) => callback(direction));
    }
  }

  handleTouchStart(event: TouchEvent): void {
    event.preventDefault();
    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
  }

  handleTouchMove(event: TouchEvent): void {
    event.preventDefault();
  }

  handleTouchEnd(event: TouchEvent): void {
    event.preventDefault();
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;

    const threshold = 30; // 最小滑动距离
    if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
      return;
    }

    let direction: Direction;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    this.callbacks.forEach((callback) => callback(direction));
  }
}
