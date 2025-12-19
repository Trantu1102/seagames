import { API_URL, MOCK_MEDAL_DATA } from '../constants';
import { MedalStanding } from '../types';

/**
 * Determine country code based on country name
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

// Mapping from Country Code to Vietnamese Name
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
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 15000);

    // ==========================================
    // SỬA LỖI CACHE TẠI ĐÂY
    // ==========================================
    // Kiểm tra xem URL gốc đã có dấu ? chưa để thêm ký tự nối phù hợp
    const separator = API_URL.includes('?') ? '&' : '?';
    // Thêm timestamp vào cuối URL để đảm bảo mỗi lần gọi là một request mới
    const url = `${API_URL}${separator}t=${new Date().getTime()}`;

    const response = await fetch(url, {
      signal: controller.signal,
      method: 'GET',
      // Thêm headers để force trình duyệt không cache
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    clearTimeout(id);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const json = await response.json();
    let rawList: any[] = [];

    // Flexible handling for different JSON structures
    if (Array.isArray(json)) {
        // Likely the n8n output array
        rawList = json;
    } else if (json.list && Array.isArray(json.list)) {
        // Raw API format wrapped in object
        rawList = json.list;
    } else if (json.data && Array.isArray(json.data)) {
        // Common API wrapper
        rawList = json.data;
    }

    if (!rawList || rawList.length === 0) {
        throw new Error("No array found in API response");
    }

    // Map data to MedalStanding
    // Supports both n8n keys (country, gold) and raw keys (org_nm, gold_count) based on previous context
    const data: MedalStanding[] = rawList.map((item: any) => {
        const rawName = item.country || item.org_nm || "Unknown";
        const code = getCountryCode(rawName);
        
        // Use Vietnamese name if available, otherwise uppercase the raw name
        const displayName = COUNTRY_VI_NAMES[code] || rawName.toUpperCase();
        
        return {
            rank: Number(item.ranking) || 0,
            countryName: displayName,
            countryCode: code,
            // Look for 'gold' (n8n) or 'gold_count' (raw api)
            gold: Number(item.gold ?? item.gold_count) || 0,
            silver: Number(item.silver ?? item.silver_count) || 0,
            bronze: Number(item.bronze ?? item.bronze_count) || 0,
            total: Number(item.total ?? item.total_count) || 0
        };
    });

    return { data, isFallback: false };

  } catch (error) {
    console.warn("Fetch failed. Using fallback simulation.", error);
    // Giảm thời gian chờ fallback xuống thấp hơn để trải nghiệm mượt hơn
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: MOCK_MEDAL_DATA, isFallback: true };
  }
};
