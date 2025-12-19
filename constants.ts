import { MedalStanding } from './types';

// New n8n Webhook API provided by user
export const API_URL = "https://n8n.autowf.xyz/webhook/cdf60061-3fa9-4ff7-9d37-b250d9eed306";

export const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// Fallback data
export const MOCK_MEDAL_DATA: MedalStanding[] = [
  { rank: 1, countryCode: "THA", countryName: "THÁI LAN", gold: 45, silver: 30, bronze: 25, total: 100 },
  { rank: 2, countryCode: "VIE", countryName: "VIỆT NAM", gold: 40, silver: 35, bronze: 30, total: 105 },
  { rank: 3, countryCode: "INA", countryName: "INDONESIA", gold: 35, silver: 25, bronze: 40, total: 100 },
  { rank: 4, countryCode: "PHI", countryName: "PHILIPPINES", gold: 25, silver: 30, bronze: 35, total: 90 },
  { rank: 5, countryCode: "MAS", countryName: "MALAYSIA", gold: 20, silver: 25, bronze: 20, total: 65 },
  { rank: 6, countryCode: "SGP", countryName: "SINGAPORE", gold: 15, silver: 10, bronze: 15, total: 40 },
  { rank: 7, countryCode: "MYA", countryName: "MYANMAR", gold: 5, silver: 5, bronze: 10, total: 20 },
  { rank: 8, countryCode: "LAO", countryName: "LÀO", gold: 2, silver: 3, bronze: 5, total: 10 },
  { rank: 9, countryCode: "BRU", countryName: "BRUNEI", gold: 1, silver: 1, bronze: 2, total: 4 },
  { rank: 10, countryCode: "TLS", countryName: "TIMOR LESTE", gold: 0, silver: 1, bronze: 1, total: 2 },
  { rank: 11, countryCode: "CAM", countryName: "CAMPUCHIA", gold: 0, silver: 0, bronze: 0, total: 0 },
];
