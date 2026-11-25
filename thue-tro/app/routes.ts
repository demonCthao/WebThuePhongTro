import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  // Khu vực người dùng: Header + trang + Footer
  layout("routes/home.tsx", [
    index("routes/home.index.tsx"),
    route("nha-nguyen-can", "routes/home/OriginalHouseRoute.tsx"),
    route("danh-sach", "routes/home/ListRoute.tsx"),
    route("dang-nhap-hoac-dang-ky", "routes/home/AuthRoute.tsx"),
    route("phong-tro", "routes/home/RentalRoomRoute.tsx"),
    route("bang-gia-dich-vu", "routes/home/PricingRoute.tsx"),
    route("phong-tro/:id", "routes/home/ListingDetailRoute.tsx"),
    route("can-ho-chung-cu", "routes/home/ApartmentUnitRoute.tsx"),
    route("can-ho-mini", "routes/home/MiniApartmentRoute.tsx"),
    route("can-ho-dich-vu", "routes/home/ServicedApartmentRoute.tsx"),
    route("o-ghep", "routes/home/RoommateSharingRoute.tsx"),
    route("mat-bang", "routes/home/FloorPlanRoute.tsx"),
    route("tin-da-luu", "routes/home/SavedPostsRoute.tsx"),
    route("blog", "routes/home/BlogRoute.tsx"),
    route("verify-otp", "routes/home/VerifyOtpRoute.tsx"),
  ]),

  // Khu vực quản trị: có tiền tố /admin để không trùng "/" với layout home
  route("admin", "routes/admin.tsx", [
    index("routes/admin.index.tsx"),
    route("tinh-thanh", "routes/admin/ProvincesRoute.tsx"),
    route("bai-dang", "routes/admin/RoomsRoute.tsx"),
    route("nguoi-dung", "routes/admin/UsersRoute.tsx"),
    route("phuong", "routes/admin/WardsRoute.tsx"),
    route("blog", "routes/admin/BlogRoute.tsx"),
    route("ads", "routes/admin/AdsRoute.tsx"),
    route("viewing-appointment", "routes/admin/ViewingAppointmentRoute.tsx"),
  ]),
] satisfies RouteConfig;
