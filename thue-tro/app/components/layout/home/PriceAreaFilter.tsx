import Card from "app/components/common/Card";
import type { LinkItem } from "./FilterLinkList";
import FilterLinkList from "./FilterLinkList";

interface PriceAreaFilterProps {
  prices: LinkItem[];
  areas: LinkItem[];
}

export default function PriceAreaFilter({ prices, areas }: PriceAreaFilterProps) {
  return (
    <Card className="space-y-5 p-3.5">
      <FilterLinkList title="Xem theo khoảng giá" items={prices} />
      <FilterLinkList title="Xem theo diện tích" items={areas} />
    </Card>
  );
}
