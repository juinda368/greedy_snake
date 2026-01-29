import React from 'react';
import { Lock, AlertTriangle } from 'lucide-react';
import { Trap } from '../utils/types';

interface TrapIndicatorProps {
  traps: Trap[];
}

export function TrapIndicator({ traps }: TrapIndicatorProps) {
  if (traps.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 glass-effect rounded-xl p-3 z-40">
      <h3 className="text-white text-sm font-semibold mb-2">活动陷阱</h3>
      <div className="space-y-2">
        {traps.map((trap, index) => {
          const remainingTime = Math.max(0, trap.expiryTime - Date.now());
          const remainingSeconds = Math.ceil(remainingTime / 1000);

          return (
            <div
              key={index}
              className={`flex items-center gap-2 ${
                trap.type === 'blue' ? 'text-blue-400' : 'text-purple-400'
              }`}
            >
              {trap.type === 'blue' ? (
                <Lock className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
              <span className="text-sm">{remainingSeconds}s</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
