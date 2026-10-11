import CheckBadge from "app/components/common/CheckBadge";
import { cn } from "app/helper/cn";
import type { Amenity } from "app/models/home/listing";

interface AmenityListProps {
  items: Amenity[];
}

export default function AmenityList({ items }: AmenityListProps) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2 text-[15px]">
          <CheckBadge checked={item.available} size="sm" label={item.available ? "Có" : "Không có"} />
          <span className={cn(item.available ? "text-neutral-900" : "text-neutral-300")}>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
