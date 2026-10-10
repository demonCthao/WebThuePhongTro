import Card from "app/components/common/Card";
import type { Listing } from "app/models/home/listing";
import { Link } from "react-router";
import ListingGallery from "./ListingGallery";
import StarRating from "./StarRating";
import Avatar from "app/components/common/Avatar";
import PhoneButton from "./PhoneButton";
import FavoriteButton from "./FavoriteButton";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const {
    id,
    title,
    price,
    area,
    location,
    description,
    images,
    imageCount,
    hasVideo,
    isVip,
    author,
    postedAt,
  } = listing;

  return (
    <Card className="p-3.5">
      <ListingGallery
        title={title}
        images={images}
        imageCount={imageCount}
        hasVideo={hasVideo}
      />

      <h2 className="mt-3 text-[15px] font-medium uppercase leading-6 text-[#dc3b2f]">
        <Link to={`/phong-tro/${id}`} className="hover:underline">
          {isVip && <StarRating />} {title}
        </Link>
      </h2>

      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 text-sm text-neutral-900">
        <span className="font-medium text-[#17b169]">{price}</span>
        <span className="text-neutral-300">•</span>
        <span>{area}</span>
        <span className="text-neutral-300">•</span>
        <span>{location}</span>
      </div>

      <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-neutral-500">
        {description}
      </p>

      <div className="mt-3 flex items-center gap-2.5">
        <Avatar src={author.avatarUrl} alt={author.name} />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[13px] font-medium text-neutral-900">
            {author.name}
          </p>
          <p className="text-xs text-neutral-500">{postedAt}</p>
        </div>
        <PhoneButton phone={author.phone} />
        <FavoriteButton />
      </div>
    </Card>
  );
}
