import React from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Gamepad2 } from 'lucide-react';

interface StartMenuProps {
  isGameOver: boolean;
  score: number;
  highScore: number;
  onStart: () => void;
  onRestart: () => void;
}

export function StartMenu({
  isGameOver,
  score,
  highScore,
  onStart,
  onRestart,
}: StartMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Gamepad2 className="w-24 h-24 text-primary-light mx-auto mb-6" />
        </motion.div>

        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-bold text-white mb-4"
        >
          贪吃蛇
        </motion.h1>

        {isGameOver && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <p className="text-2xl text-primary-light mb-2">游戏结束</p>
            <p className="text-xl text-white">得分: {score}</p>
            {score === highScore && score > 0 && (
              <p className="text-yellow-400 mt-2 font-semibold">🎉 新纪录！</p>
            )}
          </motion.div>
        )}

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={isGameOver ? onRestart : onStart}
          className="group bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full text-xl font-semibold transition-all flex items-center gap-3 mx-auto touch-manipulation"
        >
          {isGameOver ? (
            <>
              <RotateCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-300" />
              重新开始
            </>
          ) : (
            <>
              <Play className="w-6 h-6" />
              开始游戏
            </>
          )}
        </motion.button>

        {!isGameOver && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-400 mt-6 text-sm"
          >
            使用方向键或 WASD 控制移动
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
