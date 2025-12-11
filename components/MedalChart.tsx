import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { MedalStanding } from '../types';

interface MedalChartProps {
  data: MedalStanding[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg text-xs md:text-sm z-50">
        <p className="font-bold text-slate-900 mb-2">{label}</p>
        <p className="text-yellow-600 font-medium">🥇 Vàng: {payload[0].value}</p>
        <p className="text-slate-500 font-medium">🥈 Bạc: {payload[1].value}</p>
        <p className="text-orange-600 font-medium">🥉 Đồng: {payload[2].value}</p>
        <div className="mt-2 pt-2 border-t border-slate-100 font-bold text-slate-700">
          Tổng: {payload[0].value + payload[1].value + payload[2].value}
        </div>
      </div>
    );
  }
  return null;
};

export const MedalChart: React.FC<MedalChartProps> = ({ data }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-xl border border-slate-200 p-4">
      <div className="mb-4 text-center md:text-left">
        <h3 className="text-sm md:text-lg font-bold text-slate-800">Biểu đồ phân bố huy chương</h3>
      </div>
      
      {/* Container must have defined height for ResponsiveContainer to work properly */}
      <div className="h-[350px] md:h-[450px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: -20, 
              bottom: 5,
            }}
            barGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="countryCode" 
              tick={{ fontSize: 10, fill: '#64748b' }} 
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: '#64748b' }} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
            <Legend 
              wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
              formatter={(value) => <span className="text-slate-600 font-medium ml-1">{value}</span>}
            />
            
            <Bar dataKey="gold" name="Vàng" fill="#ca8a04" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="silver" name="Bạc" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="bronze" name="Đồng" fill="#ea580c" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};