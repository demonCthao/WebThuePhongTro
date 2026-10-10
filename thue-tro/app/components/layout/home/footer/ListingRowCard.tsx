import { Link } from "react-router";
import { Camera, MapPin } from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import type { Listing } from "app/models/home/listing";
import Card from "app/components/common/Card";
import ImageWithFallback from "../ImageWithFallback";

interface ListingRowCardProps {
  listing: Listing;
}

// Thẻ tin dạng hàng ngang: ảnh bên trái, nội dung bên phải (trang danh sách)
export default function ListingRowCard({ listing }: ListingRowCardProps) {
  const { id, title, price, area, location, description, images, imageCount, postedAt } = listing;

  return (
    <Card className="flex gap-4 p-4 max-sm:flex-col">
      <Link
        to={`/phong-tro/${id}`}
        className="relative block h-[238px] w-[250px] shrink-0 overflow-hidden rounded-md max-sm:w-full"
      >
        <ImageWithFallback src={images[0]} alt={title} className="size-full" />
        <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/55 px-1.5 py-0.5 text-xs text-white">
          <Camera size={13} />
          {imageCount}
        </span>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <h2 className="line-clamp-2 text-[17px] font-medium leading-7 text-[#1a4fb0]">
          <Link to={`/phong-tro/${id}`} className="hover:underline">
            {title}
          </Link>
        </h2>

        <div className="mt-1 flex items-center gap-2 text-base text-neutral-900">
          <span className="font-medium text-[#17b169]">{price}</span>
          <span className="text-neutral-300">•</span>
          <span>{area}</span>
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-base text-neutral-900">
          <MapPin size={14} className="shrink-0 text-neutral-500" />
          {location}
        </p>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-500">{description}</p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-sm text-neutral-500">{postedAt}</span>
          <FavoriteButton variant="soft" />
        </div>
      </div>
    </Card>
  );
}
