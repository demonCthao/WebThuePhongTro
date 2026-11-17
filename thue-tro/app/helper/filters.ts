import { CATEGORIES } from "app/data/mock";

export interface FilterValues {
  category: string;
  province: string;
  district: string;
  maxPrice: string;
  minPrice: string;
  area: string;
  amenities: string[];
}

export const DEFAULT_FILTERS: FilterValues = {
  category: CATEGORIES[0].value,
  province: "",
  district: "",
  maxPrice: "",
  minPrice: "",
  area: "",
  amenities: []
};

// /o-ghep?tinh=ho-chi-minh&quan=quan-3&gia=2-3&dt=20-30 -> FilterValues

export function parseFilters(
  pathname: string,
  search: string,
): FilterValues {
  const slug = pathname.split("/")[1];
  const params = new URLSearchParams(search);

  return {
    category: CATEGORIES.some((c) => c.value === slug)
      ? slug
      : DEFAULT_FILTERS.category,

    province: params.get("province") ?? "",
    district: params.get("ward") ?? "",
    maxPrice: params.get("maxPrice") ?? "",
    minPrice: params.get("minPrice") ?? "",
    area: params.get("areaM2") ?? "",

    // Lấy tất cả amenities từ URL
    amenities: params.getAll("amenities"),
  };
}


// FilterValues -> /o-ghep?tinh=...  (bỏ qua mục để trống)
export function buildFilterUrl(values: FilterValues): string {
  const params = new URLSearchParams();
  if (values.province) params.set("province", values.province);
  if (values.district) params.set("ward", values.district);
  if (values.maxPrice) params.set("maxPrice", values.maxPrice);
  if (values.minPrice) params.set("minPrice", values.minPrice);
  if (values.area) params.set("areaM2", values.area);

  values.amenities.forEach((amenity) => {
    if (amenity) params.append("amenities", amenity);
  });

  const query = params.toString();
  return `/${values.category}${query ? `?${query}` : ""}`;
}
