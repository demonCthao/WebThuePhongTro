import type { LinkItem } from "app/components/layout/home/FilterLinkList";
import type { Listing, ListingSummary } from "app/models/home/listing";


const img = (seed: string, w = 600, h = 400) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const PROVINCES: LinkItem[] = [
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
