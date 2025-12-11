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

  return (
    <div className="flex items-center gap-3 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
      <span>
        Cập nhật sau: <span className="font-mono font-medium text-indigo-600">{minutes}:{seconds.toString().padStart(2, '0')}</span>
      </span>
      <div className="h-4 w-px bg-gray-300 mx-1"></div>
      <button 
        onClick={onRefreshNow}
        disabled={isLoading}
        className={`flex items-center gap-1 hover:text-indigo-600 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        title="Làm mới ngay"
      >
        <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
        <span>{isLoading ? 'Đang tải...' : 'Làm mới'}</span>
      </button>
    </div>
  );
};