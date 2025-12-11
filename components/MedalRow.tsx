import React from 'react';
import { MedalStanding } from '../types';

interface MedalRowProps {
  data: MedalStanding;
  isHeader?: boolean;
}

// Helper to get flag URL based on country code
// Maps IOC (3-letter) to ISO 3166-1 alpha-2 (2-letter) for FlagCDN
const getFlagUrl = (iocCode: string): string | null => {
  const map: Record<string, string> = {
    'THA': 'th', // Thailand
    'VIE': 'vn', // Vietnam
    'INA': 'id', // Indonesia (Note: 'in' is India)
    'PHI': 'ph', // Philippines
    'MAS': 'my', // Malaysia
    'SGP': 'sg', // Singapore
    'MYA': 'mm', // Myanmar
    'LAO': 'la', // Laos
    'BRU': 'bn', // Brunei
    'TLS': 'tl', // Timor-Leste
    'CAM': 'kh', // Cambodia
  };

  const isoCode = map[iocCode];
  if (!isoCode) return null;
  
  return `https://flagcdn.com/w160/${isoCode}.png`;
};

export const MedalRow: React.FC<MedalRowProps> = ({ data, isHeader = false }) => {
  const isTop3 = data.rank <= 3;
  
  let rankBg = "text-gray-600";
  if (data.rank === 1) rankBg = "text-yellow-600 font-bold scale-110";
  if (data.rank === 2) rankBg = "text-slate-400 font-bold scale-110";
  if (data.rank === 3) rankBg = "text-orange-600 font-bold scale-110";

  const flagUrl = getFlagUrl(data.countryCode);

  return (
    <tr className={`
      border-b last:border-b-0 transition-colors
      ${isHeader ? '' : 'hover:bg-slate-50'}
      ${data.rank === 1 ? 'bg-yellow-50/30' : ''}
    `}>
      {/* Rank */}
      <td className="px-4 py-4 whitespace-nowrap text-center w-16">
        <div className={`text-lg ${rankBg}`}>
          {data.rank}
        </div>
      </td>

      {/* Country */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {/* Flag Container: Changed from rounded-full w-10 h-10 to rounded w-14 h-9 for rectangular shape */}
          <div className="flex-shrink-0 h-9 w-14 relative bg-gray-100 rounded shadow-sm border border-gray-200 flex items-center justify-center overflow-hidden">
             {flagUrl ? (
               <img 
                 src={flagUrl} 
                 alt={data.countryName} 
                 className="h-full w-full object-cover"
                 loading="lazy"
               />
             ) : (
               <span className="text-xs font-bold text-gray-500">{data.countryCode}</span>
             )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-bold text-gray-900">{data.countryName}</div>
            <div className="text-xs text-gray-500">{data.countryCode}</div>
          </div>
        </div>
      </td>

      {/* Gold */}
      <td className="px-4 py-4 whitespace-nowrap text-center">
        <div className="flex flex-col items-center justify-center">
            <span className={`text-base font-bold ${isTop3 ? 'text-yellow-600' : 'text-gray-800'}`}>
                {data.gold}
            </span>
            {isTop3 && data.gold > 0 && <div className="h-1 w-8 bg-yellow-400 rounded-full mt-1 opacity-50"></div>}
        </div>
      </td>

      {/* Silver */}
      <td className="px-4 py-4 whitespace-nowrap text-center">
        <div className="flex flex-col items-center justify-center">
            <span className={`text-base font-bold ${isTop3 ? 'text-slate-500' : 'text-gray-800'}`}>
                {data.silver}
            </span>
        </div>
      </td>

      {/* Bronze */}
      <td className="px-4 py-4 whitespace-nowrap text-center">
        <div className="flex flex-col items-center justify-center">
            <span className={`text-base font-bold ${isTop3 ? 'text-orange-600' : 'text-gray-800'}`}>
                {data.bronze}
            </span>
        </div>
      </td>

      {/* Total */}
      <td className="px-4 py-4 whitespace-nowrap text-center">
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold bg-slate-100 text-slate-800">
          {data.total}
        </span>
      </td>
    </tr>
  );
};