export function GameLegend() {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 glass-effect px-4 py-2 rounded-xl z-50">
      <div className="flex items-center justify-center gap-6 text-xs text-white">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#00ff88] shadow-lg shadow-[#00ff88]/50"></span>
          <span>普通10分</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ffd700] shadow-lg shadow-[#ffd700]/50"></span>
          <span>金色20分·加速</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff6b9d] shadow-lg shadow-[#ff6b9d]/50"></span>
          <span>彩虹30分·加速+无敌</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#3b82f6] shadow-lg shadow-[#3b82f6]/50"></span>
          <span>蓝色陷阱·锁定</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#8b5cf6] shadow-lg shadow-[#8b5cf6]/50"></span>
          <span>紫色陷阱·断裂</span>
        </div>
      </div>
    </div>
  );
}
