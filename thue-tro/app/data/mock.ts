import type { LinkItem } from "app/components/layout/home/FilterLinkList";
import type { Listing, ListingDetail, ListingSummary } from "app/models/home/listing";


const img = (seed: string, w = 600, h = 400) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const PROVINCE_OPTIONS: LinkItem[] = [
  { label: "Hồ Chí Minh", to: "/nha-nguyen-can/ho-chi-minh" },
  { label: "Hà Nội", to: "/nha-nguyen-can/ha-noi" },
  { label: "Đà Nẵng", to: "/nha-nguyen-can/da-nang" },
  { label: "Bình Dương", to: "/nha-nguyen-can/binh-duong" },
];

export const PRICE_FILTERS: LinkItem[] = [
  { label: "Dưới 1 triệu", to: "?gia=0-1" },
  { label: "Từ 1 - 2 triệu", to: "?gia=1-2" },
  { label: "Từ 2 - 3 triệu", to: "?gia=2-3" },
  { label: "Từ 3 - 5 triệu", to: "?gia=3-5" },
  { label: "Từ 5 - 7 triệu", to: "?gia=5-7" },
  { label: "Từ 7 - 10 triệu", to: "?gia=7-10" },
  { label: "Từ 10 - 15 triệu", to: "?gia=10-15" },
  { label: "Trên 15 triệu", to: "?gia=15-" },
];

export const AREA_FILTERS: LinkItem[] = [
  { label: "Dưới 20 m²", to: "?dt=0-20" },
  { label: "Từ 20 - 30m²", to: "?dt=20-30" },
  { label: "Từ 30 - 50m²", to: "?dt=30-50" },
  { label: "Từ 50 - 70m²", to: "?dt=50-70" },
  { label: "Từ 70 - 90m²", to: "?dt=70-90" },
  { label: "Trên 90m²", to: "?dt=90-" },
];

export const LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Cho thuê nhà nguyên căn hoặc mặt bằng – đường Cây Cám, P. Tân Vĩnh Lộc, TP.HCM",
    price: "20 triệu/tháng",
    area: "280 m²",
    location: "Bình Chánh, Hồ Chí Minh",
    description:
      "Cho thuê nhà nguyên căn hoặc mặt bằng đường Cây Cám, phường Tân Vĩnh Lộc. Vị trí: mặt tiền đường, thuận tiện kinh doanh, có thể thuê kho xưởng hoặc mở cửa hàng...",
    images: [img("house-1a"), img("house-1b"), img("house-1c")], // thiếu ảnh thứ 4 -> hiện ô xám
    imageCount: 3,
    hasVideo: true,
    isVip: true,
    author: { name: "Nguyễn Văn A", phone: "0900 000 000" },
    postedAt: "1 ngày trước",
  },
  {
    id: "2",
    title: "Nhà nguyên căn 1 trệt 2 lầu, hẻm xe hơi, gần chợ",
    price: "12 triệu/tháng",
    area: "60 m²",
    location: "Gò Vấp, Hồ Chí Minh",
    description:
      "Nhà mới sơn sửa, 3 phòng ngủ, 3 WC, sân để xe rộng. Gần chợ, trường học, tiện đi lại vào trung tâm.",
    images: [img("house-2a"), img("house-2b"), img("house-2c"), img("house-2d")],
    imageCount: 4,
    hasVideo: false,
    isVip: false,
    author: { name: "Trần Thị B", phone: "0911 111 111" },
    postedAt: "2 ngày trước",
  },
];

export const NEW_LISTINGS: ListingSummary[] = [
  {
    id: "n1",
    title: "Cho thuê phòng gác rộng, cửa kính siêu thoáng, máy giặt riêng",
    price: "5.9 triệu/tháng",
    postedAt: "9 phút trước",
    thumbnail: img("new-1", 200, 160),
  },
  {
    id: "n2",
    title: "PASS CHDV ĐẦY ĐỦ TIỆN NGHI 2 PHÒNG NGỦ",
    price: "8.8 triệu/tháng",
    postedAt: "1 giờ trước",
    thumbnail: img("new-2", 200, 160),
  },
  {
    id: "n3",
    title: "PHÒNG MỚI ĐẦY ĐỦ NỘI THẤT - NGUYỄN VĂN KHỐI, GÒ VẤP",
    price: "3.5 triệu/tháng",
    postedAt: "1 giờ trước",
  },
  {
    id: "n4",
    title: "Cho thuê phòng trọ diện tích 40m2. Giảm ngay 500k cho khách thuê dài hạn",
    price: "5.5 triệu/tháng",
    postedAt: "1 giờ trước",
  },
  {
    id: "n5",
    title: "Chuyển chỗ làm, cần pass phòng ban công thoáng mát",
    price: "4.2 triệu/tháng",
    postedAt: "2 giờ trước",
    thumbnail: img("new-5", 200, 160),
  },
];


// Dữ liệu demo, thay bằng dữ liệu từ API
export const ROOMS: Listing[] = [
  {
    id: "101",
    title: "Chính chủ cho thuê nhà nguyên căn ngay trung tâm Quận Gò Vấp giá rẻ",
    price: "7.5 triệu/tháng",
    area: "48 m²",
    location: "Gò Vấp, Hồ Chí Minh",
    description:
      "Cách chợ Hạnh Thông Tây ~200m. Bán kính 500m có đủ tiện ích siêu thị, trường cấp 1,2,3, mẫu giáo, chùa, nhà thờ... Nhà nằm trong khu phố văn minh, an ninh.",
    images: [img("room-101")],
    imageCount: 9,
    hasVideo: false,
    isVip: false,
    author: { name: "Nguyễn Văn A", phone: "0900 000 000" },
    postedAt: "11:30, 05/10/2026",
  },
  {
    id: "102",
    title: "Nhà nguyên căn, Q. Phú Nhuận 109m2, đầy đủ nội thất, 2PN Giá thuê 13,5 tr/th",
    price: "13.5 triệu/tháng",
    area: "109 m²",
    location: "Phú Nhuận, Hồ Chí Minh",
    description:
      "Nhà nguyên căn, Q. Phú Nhuận 109m2, đầy đủ nội thất, 2PN, 1 trệt 1 lầu, 2 PN, có ban công. Nội thất đầy đủ, vào ở ngay, gần chợ và trường học.",
    images: [img("room-102")],
    imageCount: 6,
    hasVideo: false,
    isVip: false,
    author: { name: "Trần Thị B", phone: "0911 111 111" },
    postedAt: "10:38, 04/10/2026",
  },
];

export type PlanId = "vip-hot" | "vip-1" | "vip-2" | "vip-3" | "normal";
export type FeatureKey = "autoApprove" | "keep10Days" | "callButton";

export interface Plan {
  id: PlanId;
  name: string;
  stars: number;
  headerClass: string; // màu nền ô tiêu đề cột
  titleStyle: string; // chữ hiển thị ở dòng "Màu sắc tiêu đề"
  titleClass: string; // màu/độ đậm của chữ đó
  size: string;
  // Giá CHƯA VAT (đã đúng với bảng giá: 325.000 x 1,08 = 351.000)
  prices: { d5: number; d10: number; d15: number; d30: number; push: number };
  discount30: number; // % giảm khi mua 30 ngày
  features: Record<FeatureKey, boolean>;
}

export const PLANS: Plan[] = [
  {
    id: "vip-hot",
    name: "Tin VIP Nổi Bật",
    stars: 5,
    headerClass: "bg-[#fc2c3b]",
    titleStyle: "MÀU ĐỎ, IN HOA",
    titleClass: "font-bold text-[#fc2c3b]",
    size: "Rất lớn",
    prices: { d5: 325000, d10: 650000, d15: 975000, d30: 1950000, push: 30000 },
    discount30: 20,
    features: { autoApprove: true, keep10Days: true, callButton: true },
  },
  {
    id: "vip-1",
    name: "Tin VIP 1",
    stars: 4,
    headerClass: "bg-[#f7359a]",
    titleStyle: "MÀU HỒNG, IN HOA",
    titleClass: "font-bold text-[#f7359a]",
    size: "Lớn",
    prices: { d5: 195000, d10: 390000, d15: 585000, d30: 1170000, push: 20000 },
    discount30: 20,
    features: { autoApprove: true, keep10Days: true, callButton: true },
  },
  {
    id: "vip-2",
    name: "Tin VIP 2",
    stars: 3,
    headerClass: "bg-[#ff5a1f]",
    titleStyle: "MÀU CAM, IN HOA",
    titleClass: "font-bold text-[#ff5a1f]",
    size: "Trung bình",
    prices: { d5: 130000, d10: 260000, d15: 390000, d30: 780000, push: 15000 },
    discount30: 20,
    features: { autoApprove: true, keep10Days: true, callButton: false },
  },
  {
    id: "vip-3",
    name: "Tin VIP 3",
    stars: 2,
    headerClass: "bg-[#1b5cf3]",
    titleStyle: "MÀU XANH, IN HOA",
    titleClass: "font-bold text-[#1b5cf3]",
    size: "Trung bình",
    prices: { d5: 75000, d10: 150000, d15: 225000, d30: 450000, push: 10000 },
    discount30: 20,
    features: { autoApprove: true, keep10Days: true, callButton: false },
  },
  {
    id: "normal",
    name: "Tin thường",
    stars: 0,
    headerClass: "bg-[#0e4bb4]",
    titleStyle: "Màu mặc định, viết thường",
    titleClass: "font-medium text-[#1a56c4]",
    size: "Nhỏ",
    prices: { d5: 13500, d10: 27000, d15: 40500, d30: 81000, push: 5000 },
    discount30: 32,
    features: { autoApprove: false, keep10Days: false, callButton: false },
  },
];

// Ảnh chụp bị cắt ở cuối nên các dòng tính năng phía dưới (nếu còn) bạn thêm vào đây
export const FEATURE_ROWS: { key: FeatureKey; label: string }[] = [
  { key: "autoApprove", label: "Tự động duyệt (*)" },
  { key: "keep10Days", label: "Duy trì thêm 10 ngày tin thường" },
  { key: "callButton", label: "Hiển thị nút gọi điện" },
];


// Dữ liệu demo (tên, số điện thoại là giả)
const DETAIL: ListingDetail = {
  id: "590697",
  code: "#590697",
  title: "Cần tìm bạn nữ ở ghép gấp 20/09 tại Chung cư Screc, 974A Đường Trường Sa, Phường 12, Quận 3",
  planId: "vip-3",
  fastRent: true,
  price: "2 triệu/tháng",
  area: "20 m²",
  updatedAt: "3 giờ trước",
  district: { label: "Tìm người ở ghép Quận 3", to: "/o-ghep/ho-chi-minh/quan-3" },
  province: { label: "Hồ Chí Minh", to: "/o-ghep/ho-chi-minh" },
  address: "Chung cư Screc, 974A Đường Trường Sa, Phường Bàn Cờ, Hồ Chí Minh",
  postedAt: "Chủ Nhật, 22:07 13/09/2026",
  expiresAt: "Thứ 3, 22:07 13/10/2026",
  description:
    "Phòng mình có 1 bạn nữ về quê nên cần tìm thêm 1 bạn nữ ở ghép để chia tiền phòng. Giá phòng 4tr/2 người, đã gồm tất cả chi phí.\n\nPhòng có sẵn nệm nằm riêng, 1 tủ đựng quần áo dành riêng cho người ở ghép. Nhà full nội thất (nấu ăn, máy giặt, máy nước nóng...). Nhà nằm khu vực trung tâm, lầu 22 có ban công hướng ra kênh thoáng mát. Dưới là nhà sách, siêu thị... thuận tiện đi lại các quận.\n\nƯu tiên nữ đã đi làm, ít đồ và ở lâu dài. Liên hệ xem phòng 0900 000 000 (Mai).",
  images: [img("detail-1"), img("detail-2"), img("detail-3"), img("detail-4")],
  amenities: [
    { label: "Đầy đủ nội thất", available: true },
    { label: "Có gác", available: false },
    { label: "Có kệ bếp", available: true },
    { label: "Có máy lạnh", available: false },
    { label: "Có máy giặt", available: true },
    { label: "Có tủ lạnh", available: true },
    { label: "Có thang máy", available: true },
    { label: "Không chung chủ", available: true },
    { label: "Giờ giấc tự do", available: true },
    { label: "Có bảo vệ 24/24", available: true },
    { label: "Có hầm để xe", available: true },
  ],
  breadcrumb: [
    { label: "Tìm người ở ghép", to: "/o-ghep" },
    { label: "Hồ Chí Minh", to: "/o-ghep/ho-chi-minh" },
    { label: "Quận 3", to: "/o-ghep/ho-chi-minh/quan-3" },
    { label: "Phường Bàn Cờ", to: "/o-ghep/ho-chi-minh/quan-3/phuong-ban-co" },
    { label: "Cần tìm bạn nữ ở ghép gấp 20/09 tại Chung cư Screc, 974A Đường Trường Sa, Phường 12, Quận 3" },
  ],
  author: {
    name: "Nguyễn Thị Mai",
    phone: "0900 000 000",
    online: true,
    listingCount: 1,
    joinedAt: "07/10/2021",
  },
};

// Demo: mọi id đều trả về cùng một tin. Khi có API: gọi API theo id (và trả 404 nếu không có).
export function getListingDetail(id: string): ListingDetail {
  return { ...DETAIL, id, code: `#${id}` };
}

export interface Option {
  value: string;
  label: string;
}

export interface Category extends Option {
  icon: "door" | "house" | "users" | "store" | "building";
  heading: string; // tiêu đề trang danh sách
}

export interface Province extends Option {
  districts: Option[];
}

// value cũng là đường dẫn: /phong-tro, /o-ghep... (khớp với menu trên Header)
export const CATEGORIES: Category[] = [
  { value: "phong-tro", label: "Phòng trọ", icon: "door", heading: "Cho Thuê Phòng Trọ, Nhà Trọ Giá Rẻ, Mới Nhất 2026" },
  { value: "nha-nguyen-can", label: "Nhà riêng", icon: "house", heading: "Cho Thuê Nhà Nguyên Căn, Giá Rẻ, Chính Chủ, Mới Nhất 2026" },
  { value: "o-ghep", label: "Ở ghép", icon: "users", heading: "Tìm Người Ở Ghép, Chia Sẻ Phòng Giá Rẻ, Mới Nhất 2026" },
  { value: "mat-bang", label: "Mặt bằng", icon: "store", heading: "Cho Thuê Mặt Bằng Kinh Doanh, Giá Rẻ, Mới Nhất 2026" },
  { value: "can-ho-chung-cu", label: "Căn hộ chung cư", icon: "building", heading: "Cho Thuê Căn Hộ Chung Cư, Giá Rẻ, Mới Nhất 2026" },
  { value: "can-ho-mini", label: "Căn hộ mini", icon: "building", heading: "Cho Thuê Căn Hộ Mini, Giá Rẻ, Mới Nhất 2026" },
  { value: "can-ho-dich-vu", label: "Căn hộ dịch vụ", icon: "building", heading: "Cho Thuê Căn Hộ Dịch Vụ, Giá Rẻ, Mới Nhất 2026" },
];

// Demo vài quận cho 3 tỉnh đầu. Tỉnh khác để districts rỗng, bạn bổ sung hoặc lấy từ API.
export const PROVINCES: Province[] = [
  {
    value: "ho-chi-minh",
    label: "Hồ Chí Minh",
    districts: [
      { value: "quan-1", label: "Quận 1" },
      { value: "quan-3", label: "Quận 3" },
      { value: "quan-7", label: "Quận 7" },
      { value: "quan-10", label: "Quận 10" },
      { value: "binh-thanh", label: "Bình Thạnh" },
      { value: "go-vap", label: "Gò Vấp" },
      { value: "phu-nhuan", label: "Phú Nhuận" },
      { value: "tan-binh", label: "Tân Bình" },
      { value: "thu-duc", label: "Thủ Đức" },
    ],
  },
  {
    value: "ha-noi",
    label: "Hà Nội",
    districts: [
      { value: "cau-giay", label: "Cầu Giấy" },
      { value: "dong-da", label: "Đống Đa" },
      { value: "ha-dong", label: "Hà Đông" },
      { value: "hai-ba-trung", label: "Hai Bà Trưng" },
      { value: "thanh-xuan", label: "Thanh Xuân" },
      { value: "nam-tu-liem", label: "Nam Từ Liêm" },
    ],
  },
  {
    value: "da-nang",
    label: "Đà Nẵng",
    districts: [
      { value: "hai-chau", label: "Hải Châu" },
      { value: "thanh-khe", label: "Thanh Khê" },
      { value: "son-tra", label: "Sơn Trà" },
      { value: "ngu-hanh-son", label: "Ngũ Hành Sơn" },
    ],
  },
  { value: "can-tho", label: "Cần Thơ", districts: [] },
  { value: "binh-duong", label: "Bình Dương", districts: [] },
  { value: "dong-nai", label: "Đồng Nai", districts: [] },
  { value: "vung-tau", label: "Vũng Tàu", districts: [] },
  { value: "khanh-hoa", label: "Khánh Hòa", districts: [] },
  { value: "hai-phong", label: "Hải Phòng", districts: [] },
];

// value rỗng = "Tất cả"
export const PRICE_OPTIONS: Option[] = [
  { value: "", label: "Tất cả" },
  { value: "0-1", label: "Dưới 1 triệu" },
  { value: "1-2", label: "1 - 2 triệu" },
  { value: "2-3", label: "2 - 3 triệu" },
  { value: "3-5", label: "3 - 5 triệu" },
  { value: "5-7", label: "5 - 7 triệu" },
  { value: "7-10", label: "7 - 10 triệu" },
  { value: "10-15", label: "10 - 15 triệu" },
  { value: "15-", label: "Trên 15 triệu" },
];

export const AREA_OPTIONS: Option[] = [
  { value: "", label: "Tất cả" },
  { value: "0-20", label: "Dưới 20m²" },
  { value: "20-30", label: "Từ 20m² - 30m²" },
  { value: "30-50", label: "Từ 30m² - 50m²" },
  { value: "50-70", label: "Từ 50m² - 70m²" },
  { value: "70-90", label: "Từ 70m² - 90m²" },
  { value: "90-", label: "Trên 90m²" },
];
