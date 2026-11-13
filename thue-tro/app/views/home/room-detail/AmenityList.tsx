import CheckBadge from "app/components/common/CheckBadge";
import { cn } from "app/helper/cn";
import type { Amenity } from "app/models/home/listing";
import type { Amenities } from "app/types/prisma-models";

interface AmenityListProps {
  items?: Amenities[];
}

export default function AmenityList({ items }: AmenityListProps) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
      {items?.map((item) => (
        <li key={item?.id} className="flex items-center gap-2 text-[15px]">
          <CheckBadge checked={true} size="sm" />
          <span className={cn("text-neutral-900")}>{item?.name?? ""}</span>
        </li>
      ))}
    </ul>
  );
}
