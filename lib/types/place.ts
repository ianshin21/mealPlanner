export interface Place {
  id: string;
  name: string;
  category: string;
  address: string;
  distance: number; // meters
  phone?: string;
  kakaoMapUrl: string;
  estimatedPricePerPerson?: number;
}

export type PlaceType = "lunch" | "party";
