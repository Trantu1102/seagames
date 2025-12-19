import { API_URL } from '../constants';
import { MedalStanding } from '../types';

/**
 * Helper function to generate ISO codes for flags/UI
 */
const getCountryCode = (name: string): string => {
  if (!name) return "UNK";
  const n = name.toLowerCase();
  if (n.includes("thailand") || n.includes("thai")) return "THA";
  if (n.includes("vietnam")) return "VIE";
  if (n.includes("indonesia")) return "INA";
  if (n.includes("philippines") || n.includes("philippine")) return "PHI";
  if (n.includes("malaysia")) return "MAS";
  if (n.includes("singapore")) return "SGP";
  if (n.includes("myanmar")) return "MYA";
  if (n.includes("lao")) return "LAO";
  if (n.includes("brunei")) return "BRU";
  if (n.includes("timor") || n.includes("leste")) return "TLS";
  if (n.includes("cambodia") || n.includes("campuchia")) return "CAM";
  return name.substring(0, 3).toUpperCase();
};

const COUNTRY_VI_NAMES: Record<string, string> = {
  "THA": "THÁI LAN",
  "VIE": "VIỆT NAM",
  "INA": "INDONESIA",
  "PHI": "PHILIPPINES",
  "MAS": "MALAYSIA",
  "SGP": "SINGAPORE",
  "MYA": "MYANMAR",
  "LAO": "LÀO",
  "BRU": "BRUNEI",
  "TLS": "TIMOR LESTE",
  "CAM": "CAMPUCHIA"
};

export const fetchMedalTally = async (): Promise<{ data: MedalStanding[]; isFallback: boolean }> => {
  // Không dùng try-catch bao quanh toàn bộ để lỗi văng ra ngoài cho App xử lý
    
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 15000); // Timeout 15s

  // 1. Thêm timestamp để chống cache triệt để
  const separator = API_URL.includes('?') ? '&' : '?';
  const url = `${API_URL}${separator}t=${new Date().getTime()}`;

  console.log("Fetching from:", url); // Log để check link

  const response = await fetch(url, {
    signal: controller.signal,
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
    }
  });
  
  clearTimeout(id);

  if (!response.ok) {
    // Nếu lỗi HTTP (404, 500, 403...) thì ném lỗi ngay
    throw new Error(`Server Error: ${response.status} ${response.statusText}`);
  }

  // 2. Parse JSON
  const json = await response.json();
  console.log("Raw Data from n8n:", json); // Log để xem n8n trả về cái gì

  let rawList: any[] = [];

  // Xử lý các trường hợp cấu trúc JSON khác nhau
  if (Array.isArray(json)) {
      rawList = json;
  } else if (json.list && Array.isArray(json.list)) {
      rawList = json.list;
  } else if (json.data && Array.isArray(json.data)) {
      rawList = json.data;
  } else {
      // Nếu JSON trả về không đúng định dạng mảng
      throw new Error("Invalid Data Format: API response is not an array");
  }

  if (rawList.length === 0) {
     console.warn("API returned empty array");
  }

  // Map dữ liệu
  const data: MedalStanding[] = rawList.map((item: any) => {
      const rawName = item.country || item.org_nm || "Unknown";
      const code = getCountryCode(rawName);
      const displayName = COUNTRY_VI_NAMES[code] || rawName.toUpperCase();
      
      return {
          rank: Number(item.ranking) || 0,
          countryName: displayName,
          countryCode: code,
          gold: Number(item.gold ?? item.gold_count) || 0,
          silver: Number(item.silver ?? item.silver_count) || 0,
          bronze: Number(item.bronze ?? item.bronze_count) || 0,
          total: Number(item.total ?? item.total_count) || 0
      };
  });

  return { data, isFallback: false };
};
