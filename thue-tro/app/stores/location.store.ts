import type { LocationModel } from "app/models/home/location.model";
import type { Provinces, Wards } from "app/types/prisma-models";
import { create } from "zustand";

/**
 * Dữ liệu vào cho store. `RegionValue` của RegionDialog ({ province, ward })
 * thỏa kiểu này nên có thể truyền thẳng vào setLocationFromRegion.
 */
export interface RegionInput {
  province: Pick<Provinces, "code" | "full_name"> | null;
  ward: Pick<Wards, "code" | "full_name"> | null;
}

/** Chuyển lựa chọn trong dialog thành LocationModel (province null = Toàn quốc -> null). */
export function regionToLocation(region: RegionInput): LocationModel | null {
  if (!region.province) return null;
  return {
    provinceCode: region.province.code,
    provinceFullName: region.province.full_name,
    wardCode: region.ward?.code ?? null,
    wardFullName: region.ward?.full_name ?? null,
  };
}

interface LocationState {
  location: LocationModel | null;

  /** Gán trực tiếp một LocationModel (hoặc null = Toàn quốc). */
  setLocation: (location: LocationModel | null) => void;
  /** Gán từ giá trị của RegionDialog, tự lấy full_name của tỉnh và xã/phường. */
  setLocationFromRegion: (region: RegionInput) => void;
  /** Về "Toàn quốc". */
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  location: null,

  setLocation: (location) => set({ location }),

  setLocationFromRegion: (region) =>
    set({ location: regionToLocation(region) }),

  clearLocation: () => set({ location: null }),
}));
