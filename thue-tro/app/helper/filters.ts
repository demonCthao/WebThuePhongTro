import { CATEGORIES } from "app/data/mock";

export interface FilterValues {
  category: string;
  province: string;
  district: string;
  price: string;
  area: string;
}

export const DEFAULT_FILTERS: FilterValues = {
  category: CATEGORIES[0].value,
  province: "",
  district: "",
  price: "",
  area: "",
};

// /o-ghep?tinh=ho-chi-minh&quan=quan-3&gia=2-3&dt=20-30 -> FilterValues
export function parseFilters(pathname: string, search: string): FilterValues {
  const slug = pathname.split("/")[1];
  const params = new URLSearchParams(search);

  return {
    category: CATEGORIES.some((c) => c.value === slug) ? slug : DEFAULT_FILTERS.category,
    province: params.get("tinh") ?? "",
    district: params.get("quan") ?? "",
    price: params.get("gia") ?? "",
    area: params.get("dt") ?? "",
  };
}

// FilterValues -> /o-ghep?tinh=...  (bỏ qua mục để trống)
export function buildFilterUrl(values: FilterValues): string {
  const params = new URLSearchParams();
  if (values.province) params.set("tinh", values.province);
  if (values.district) params.set("quan", values.district);
  if (values.price) params.set("gia", values.price);
  if (values.area) params.set("dt", values.area);

  const query = params.toString();
  return `/${values.category}${query ? `?${query}` : ""}`;
}
