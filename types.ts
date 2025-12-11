export interface MedalStanding {
  rank: number;
  countryCode: string;
  countryName: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
  flagUrl?: string;
}

export interface ApiResponse {
  data: any[]; // Typing as any[] for flexibility with the external API structure
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export enum FetchStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  USING_FALLBACK = 'USING_FALLBACK'
}