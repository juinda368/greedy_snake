import React from 'react';
import { Volume2, VolumeX, RotateCcw, Play, Pause } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  volume: number;
  isMuted: boolean;
  isPaused: boolean;
  isRunning: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onPauseResume: () => void;
  onRestart: () => void;
}

export function ScoreBoard({
  score,
  highScore,
  volume,
  isMuted,
  isPaused,
  isRunning,
  onVolumeChange,
  onToggleMute,
  onPauseResume,
  onRestart,
}: ScoreBoardProps) {
  return (
    <div className="fixed top-0 left-0 right-0 glass-effect p-4 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="text-white">
            <span className="text-sm text-gray-300">分数</span>
            <div className="text-3xl font-bold text-primary-light">{score}</div>
          </div>
          <div className="text-white">
            <span className="text-sm text-gray-300">最高分</span>
            <div className="text-2xl font-semibold">{highScore}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMute}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-24 accent-primary-light"
            />
          </div>

          {/* Pause/Resume Button */}
          {isRunning && (
            <button
              onClick={onPauseResume}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              {isPaused ? (
                <Play className="w-5 h-5" />
              ) : (
                <Pause className="w-5 h-5" />
              )}
            </button>
          )}

          {/* Restart Button */}
          <button
            onClick={onRestart}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
