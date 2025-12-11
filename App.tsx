import React, { useEffect, useState, useCallback } from 'react';
import { Trophy, AlertTriangle, Info, ServerOff } from 'lucide-react';
import { fetchMedalTally } from './services/medalService';
import { MedalStanding, FetchStatus } from './types';
import { REFRESH_INTERVAL_MS } from './constants';
import { MedalRow } from './components/MedalRow';
import { CountdownTimer } from './components/CountdownTimer';

const App: React.FC = () => {
  const [medals, setMedals] = useState<MedalStanding[]>([]);
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.IDLE);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const loadData = useCallback(async () => {
    setStatus(FetchStatus.LOADING);
    try {
      const { data, isFallback } = await fetchMedalTally();
      // Sort: Gold DESC, then Silver DESC, then Bronze DESC
      const sortedData = data.sort((a, b) => {
        if (b.gold !== a.gold) return b.gold - a.gold;
        if (b.silver !== a.silver) return b.silver - a.silver;
        return b.bronze - a.bronze;
      });

      // Recalculate rank based on sort order
      const rankedData = sortedData.map((item, idx) => ({ ...item, rank: idx + 1 }));

      setMedals(rankedData);
      setLastUpdated(new Date());
      setStatus(isFallback ? FetchStatus.USING_FALLBACK : FetchStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setStatus(FetchStatus.ERROR);
    }
  }, []);

  // Initial Load & Interval setup
  useEffect(() => {
    loadData();

    const intervalId = setInterval(() => {
      loadData();
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [loadData]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Hero Header */}
      <header className="bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                <Trophy size={40} className="text-yellow-400" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">SEA Games 33</h1>
                <p className="text-indigo-200 font-medium">Bảng Tổng Sắp Huy Chương</p>
              </div>
            </div>
            
            <CountdownTimer 
              lastUpdated={lastUpdated} 
              onRefreshNow={loadData}
              isLoading={status === FetchStatus.LOADING}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 -mt-6">
        
        {/* Status Messages */}
        {status === FetchStatus.USING_FALLBACK && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3 shadow-sm">
            <AlertTriangle className="text-amber-500 mt-0.5 flex-shrink-0" size={18} />
            <div className="text-sm text-amber-800">
              <span className="font-semibold">Chế độ giả lập:</span> Dữ liệu trực tiếp hiện chưa có hoặc bị chặn kết nối (CORS). Hệ thống đang hiển thị dữ liệu mẫu.
            </div>
          </div>
        )}

        {status === FetchStatus.ERROR && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center flex items-center justify-center gap-2">
            <AlertTriangle size={18} />
            <span>Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.</span>
          </div>
        )}

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-16">
                    Hạng
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Quốc gia
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-bold text-yellow-600 uppercase tracking-wider w-24">
                    Vàng
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-24">
                    Bạc
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-bold text-orange-600 uppercase tracking-wider w-24">
                    Đồng
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider w-24 bg-slate-100">
                    Tổng
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {status === FetchStatus.LOADING && medals.length === 0 ? (
                  // Skeleton Loading State
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-4"><div className="h-6 bg-slate-200 rounded w-8 mx-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-6 bg-slate-200 rounded w-32"></div></td>
                      <td className="px-4 py-4"><div className="h-6 bg-slate-200 rounded w-8 mx-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-6 bg-slate-200 rounded w-8 mx-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-6 bg-slate-200 rounded w-8 mx-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-6 bg-slate-200 rounded w-8 mx-auto"></div></td>
                    </tr>
                  ))
                ) : medals.length > 0 ? (
                  medals.map((country) => (
                    <MedalRow key={country.countryCode} data={country} />
                  ))
                ) : (
                  // Empty State
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <ServerOff size={32} className="text-slate-300" />
                        <p>Không có dữ liệu huy chương.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <Info size={14} />
                <span>Cập nhật tự động mỗi 5 phút</span>
             </div>
             <span>Nguồn: GMS Mate Systems</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;