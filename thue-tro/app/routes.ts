import {
  type RouteConfig,
  index,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("routes/home.tsx", [
    index("routes/home.index.tsx"),
  ]),

  layout("routes/admin.tsx", [
    index("routes/admin.index.tsx"),
  ]),
] satisfies RouteConfig;