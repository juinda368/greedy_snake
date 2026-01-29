import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface ControlPanelProps {
  onDirectionChange: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export function ControlPanel({ onDirectionChange }: ControlPanelProps) {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
      <div className="grid grid-cols-3 gap-2 p-4 glass-effect rounded-2xl">
        <div></div>
        <button
          onClick={() => onDirectionChange('up')}
          className="p-4 bg-primary hover:bg-primary-dark rounded-xl transition-all active:scale-95 touch-manipulation"
        >
          <ArrowUp className="w-8 h-8 text-white" />
        </button>
        <div></div>
        <button
          onClick={() => onDirectionChange('left')}
          className="p-4 bg-primary hover:bg-primary-dark rounded-xl transition-all active:scale-95 touch-manipulation"
        >
          <ArrowLeft className="w-8 h-8 text-white" />
        </button>
        <button
          onClick={() => onDirectionChange('down')}
          className="p-4 bg-primary hover:bg-primary-dark rounded-xl transition-all active:scale-95 touch-manipulation"
        >
          <ArrowDown className="w-8 h-8 text-white" />
        </button>
        <button
          onClick={() => onDirectionChange('right')}
          className="p-4 bg-primary hover:bg-primary-dark rounded-xl transition-all active:scale-95 touch-manipulation"
        >
          <ArrowRight className="w-8 h-8 text-white" />
        </button>
      </div>
      <p className="text-center text-gray-400 text-sm mt-2">方向键控制</p>
    </div>
  );
}
