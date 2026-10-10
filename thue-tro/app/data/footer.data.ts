import type { LinkItem } from "app/components/layout/home/FilterLinkList";

const CITY_NAMES: Record<string, string> = {
  "ho-chi-minh": "Hồ Chí Minh",
  "ha-noi": "Hà Nội",
  "da-nang": "Đà Nẵng",
  "can-tho": "Cần Thơ",
  "binh-duong": "Bình Dương",
  "dong-nai": "Đồng Nai",
  "vung-tau": "Vũng Tàu",
  "khanh-hoa": "Khánh Hòa",
  "hai-phong": "Hải Phòng",
};

// "Phòng trọ" + "/phong-tro" + ["ha-noi"] -> { label: "Phòng trọ Hà Nội", to: "/phong-tro/ha-noi" }
const cityLinks = (prefix: string, basePath: string, slugs: string[]): LinkItem[] =>
  slugs.map((slug) => ({ label: `${prefix} ${CITY_NAMES[slug]}`, to: `${basePath}/${slug}` }));

export interface FooterColumnData {
  title: string;
  links: LinkItem[];
}

export const CATEGORY_COLUMNS: FooterColumnData[] = [
  {
    title: "Phòng trọ, nhà trọ",
    links: cityLinks("Phòng trọ", "/phong-tro", [
      "ho-chi-minh", "ha-noi", "da-nang", "can-tho", "binh-duong", "dong-nai", "vung-tau", "khanh-hoa",
    ]),
  },
  {
    title: "Thuê nhà nguyên căn",
    links: cityLinks("Thuê nhà", "/nha-nguyen-can", [
      "ho-chi-minh", "ha-noi", "binh-duong", "da-nang", "dong-nai", "can-tho", "khanh-hoa",
    ]),
  },
  {
    title: "Cho thuê căn hộ",
    links: cityLinks("Thuê căn hộ", "/can-ho-chung-cu", [
      "ho-chi-minh", "ha-noi", "binh-duong", "da-nang", "hai-phong", "khanh-hoa",
    ]),
  },
  {
    title: "Cho thuê mặt bằng",
    links: cityLinks("Thuê mặt bằng", "/mat-bang", [
      "ho-chi-minh", "ha-noi", "da-nang", "can-tho", "binh-duong",
    ]),
  },
  {
    title: "Tìm người ở ghép",
    links: cityLinks("Ở ghép", "/o-ghep", [
      "ho-chi-minh", "ha-noi", "da-nang", "binh-duong", "can-tho", "dong-nai", "hai-phong", "khanh-hoa",
    ]),
  },
];

// Ảnh chụp bị cắt ở cuối nên các mục cuối mỗi cột là ước đoán, sửa lại theo ý bạn
export const ABOUT_COLUMNS: FooterColumnData[] = [
  {
    title: "Về Phongtro123.com",
    links: [
      { label: "Giới thiệu", to: "/gioi-thieu" },
      { label: "Quy chế hoạt động", to: "/quy-che-hoat-dong" },
      { label: "Quy định sử dụng", to: "/quy-dinh-su-dung" },
      { label: "Chính sách bảo mật", to: "/chinh-sach-bao-mat" },
    ],
  },
  {
    title: "Dành cho khách hàng",
    links: [
      { label: "Câu hỏi thường gặp", to: "/hoi-dap" },
      { label: "Hướng dẫn đăng tin", to: "/huong-dan-dang-tin" },
      { label: "Bảng giá dịch vụ", to: "/bang-gia-dich-vu" },
      { label: "Giải quyết khiếu nại", to: "/giai-quyet-khieu-nai" },
    ],
  },
];

export interface Partner {
  name: string;
  href: string;
  logo?: string; // có ảnh logo thì truyền vào, không có thì hiện chữ
  textClass: string;
}

export const PARTNERS: Partner[] = [
  { name: "bds123.vn", href: "https://bds123.vn", textClass: "text-[#1a73e8]" },
  { name: "chothuenha.me", href: "https://chothuenha.me", textClass: "text-[#ee2f6b]" },
  { name: "thuecanho123", href: "https://thuecanho123.com", textClass: "text-[#12a8d6]" },
  { name: "chothuephongtro.me", href: "https://chothuephongtro.me", textClass: "text-[#f26b1d]" },
];
