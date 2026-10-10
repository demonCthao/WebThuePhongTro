import type { ListingSummary } from "app/models/home/listing";
import { Link } from "react-router";
import ImageWithFallback from "./ImageWithFallback";

interface ListingMiniItemProps {
  item: ListingSummary;
}

export default function ListingMiniItem({ item }: ListingMiniItemProps) {
  return (
    <Link to={`/phong-tro/${item.id}`} className="flex gap-2.5">
      <ImageWithFallback src={item.thumbnail} className="h-20 w-[90px] shrink-0 rounded-sm" />
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <h4 className="line-clamp-2 text-sm leading-5 text-[#1a5fd1] hover:underline">{item.title}</h4>
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-[#17b169]">{item.price}</span>
          <span className="text-neutral-500">{item.postedAt}</span>
        </div>
      </div>
    </Link>
  );
}
