import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { REFRESH_INTERVAL_MS } from '../constants';

interface CountdownTimerProps {
  lastUpdated: Date;
  onRefreshNow: () => void;
  isLoading: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ lastUpdated, onRefreshNow, isLoading }) => {
  const [secondsLeft, setSecondsLeft] = useState(REFRESH_INTERVAL_MS / 1000);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - lastUpdated.getTime();
      const remaining = Math.max(0, (REFRESH_INTERVAL_MS - diff) / 1000);
      setSecondsLeft(Math.floor(remaining));
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = Math.floor(secondsLeft % 60);
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-500 bg-white/90 md:bg-white px-2 py-1.5 md:px-3 md:py-1.5 rounded-lg border border-gray-200 shadow-sm backdrop-blur-sm">
      <span className="hidden md:inline">Cập nhật sau:</span>
      <span className="font-mono font-medium text-indigo-600">{timeString}</span>
      <div className="h-3 md:h-4 w-px bg-gray-300 mx-0.5 md:mx-1"></div>
      <button 
        onClick={onRefreshNow}
        disabled={isLoading}
        className={`flex items-center gap-1 hover:text-indigo-600 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        title="Làm mới ngay"
      >
        <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
        <span className="hidden md:inline">{isLoading ? 'Đang tải...' : 'Làm mới'}</span>
      </button>
    </div>
  );
};