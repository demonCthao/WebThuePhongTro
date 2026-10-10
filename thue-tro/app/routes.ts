import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  // Khu vực người dùng: Header + trang + Footer
  layout("routes/home.tsx", [
    index("routes/home.index.tsx"),
    route("nha-nguyen-can", "routes/home/nha-nguyen-can.tsx"),
    route("bang-gia-dich-vu", "routes/home/bang-gia-dich-vu.tsx"),
  ]),

  // Khu vực quản trị: có tiền tố /admin để không trùng "/" với layout home
  route("admin", "routes/admin.tsx", [index("routes/admin.index.tsx")]),
] satisfies RouteConfig;
