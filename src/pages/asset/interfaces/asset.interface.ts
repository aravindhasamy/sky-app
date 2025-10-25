export interface TotalViews {
  total: number;
  "sky-go": number;
  "now-tv": number;
  peacock: number;
}

export interface Asset {
  name: string;
  totalViews: TotalViews;
  prevTotalViews: TotalViews;
  description: string;
  duration: number;
  assetImage: string;
  videoImage: string;
  provider: string;
  genre: string[];
}

