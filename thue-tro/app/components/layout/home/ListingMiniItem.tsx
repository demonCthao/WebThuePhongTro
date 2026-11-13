import type { Rooms } from "app/types/prisma-models";
import { Link } from "react-router";
import ImageWithFallback from "../../common/ImageWithFallback";
import { formatPrice } from "app/helper/price";
import { formatTimeAgo } from "app/helper/date";

interface ListingMiniItemProps {
  item: Rooms;
}

export default function ListingMiniItem({ item }: ListingMiniItemProps) {
  return (
    <Link to={`/phong-tro/${item.id}`} className="flex gap-2.5">
      <ImageWithFallback src={item?.room_media?.[0].url} className="h-20 w-[90px] shrink-0 rounded-sm" />
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <h4 className="line-clamp-2 text-sm leading-5 text-[#1a5fd1] hover:underline">{item.title}</h4>
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-[#17b169]">{formatPrice(Number(item?.price_monthly?? "0"))} / 1 tháng</span>
          <span className="text-neutral-500">{formatTimeAgo(item.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}
