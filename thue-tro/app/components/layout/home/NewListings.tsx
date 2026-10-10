import Card from "app/components/common/Card";
import type { ListingSummary } from "app/models/home/listing";
import ListingMiniItem from "./ListingMiniItem";


interface NewListingsProps {
  items: ListingSummary[];
}

export default function NewListings({ items }: NewListingsProps) {
  return (
    <Card className="p-3.5">
      <h3 className="mb-3 text-[15px] font-medium text-neutral-900">Tin mới đăng</h3>
      <ul className="divide-y divide-neutral-200">
        {items.map((item) => (
          <li key={item.id} className="py-3 first:pt-0 last:pb-0">
            <ListingMiniItem item={item} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
