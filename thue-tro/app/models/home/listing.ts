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
