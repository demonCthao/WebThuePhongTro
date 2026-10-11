import PricingView from "app/views/home/pricing/PricingView";

export function meta() {
  return [{ title: "Bảng giá dịch vụ đăng tin" }];
}

export default function PricingRoute() {
  return <PricingView />;
}