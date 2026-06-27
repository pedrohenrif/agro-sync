export type Garden = {
  id: number;
  name: string;
  crop: string;
  lotCode: string;
  plantingDate: string;
  sizeInM2: number;
  location: string;
  isActive?: boolean;
  geometry?: [number, number][] | null;
  mapColor?: string | null;
};
  