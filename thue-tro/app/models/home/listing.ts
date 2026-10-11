export interface Author {
  name: string;
  phone: string;
  avatarUrl?: string;
}

export interface Listing {
  id: string;
  title: string;
  price: string;
  area: string;
  location: string;
  description: string;
  images: string[];
  imageCount: number;
  hasVideo: boolean;
  isVip: boolean;
  author: Author;
  postedAt: string;
}

// Bản rút gọn dùng cho danh sách "Tin mới đăng"
export type ListingSummary = Pick<Listing, "id" | "title" | "price" | "postedAt"> & {
  thumbnail?: string;
};

// ---------- Trang chi tiết ----------
export interface BreadcrumbItem {
  label: string;
  to?: string; // không có `to` = mục hiện tại (không bấm được)
}

export interface Amenity {
  label: string;
  available: boolean;
}

export interface AuthorProfile extends Author {
  online: boolean;
  listingCount: number;
  joinedAt: string;
}

export interface ListingDetail {
  id: string;
  code: string; // mã tin, ví dụ "#590697"
  title: string;
  planId: string; // id gói tin (xem views/pricing/data.ts) -> quyết định màu tiêu đề và nhãn VIP
  fastRent?: boolean; // hiện ruy-băng "Cho thuê nhanh"
  price: string;
  area: string;
  updatedAt: string;
  district: { label: string; to: string };
  province: { label: string; to: string };
  address: string;
  postedAt: string;
  expiresAt: string;
  description: string;
  images: string[];
  amenities: Amenity[];
  breadcrumb: BreadcrumbItem[];
  author: AuthorProfile;
}
