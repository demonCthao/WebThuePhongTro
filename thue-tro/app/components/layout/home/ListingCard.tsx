import Card from "app/components/common/Card";
import { formatDate } from "app/helper/date";
import { formatPrice } from "app/helper/price";
import type { Rooms } from "app/types/prisma-models";
import { Eye, Heart, MapPin } from "lucide-react";
import { Link } from "react-router";
import FavoriteButton from "./FavoriteButton";
import ListingGallery from "./ListingGallery";
import PhoneButton from "./PhoneButton";
import StarRating from "./StarRating";
import { useMutationRequest } from "app/hooks/useMutation";
import { useNotificationStore } from "app/stores/notification.store";
import { getSession } from "app/helper/auth-storage";

interface ListingCardProps {
  room: Rooms;
}

const formatCount = (value: number) => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

export default function ListingCard({ room }: ListingCardProps) {
  const notification = useNotificationStore();
  const authenSession = getSession();
  const {
    id,
    title,
    description,
    price_monthly,
    area_m2,
    full_address,
    vip_level,
    contact_name,
    contact_phone,
    published_at,
    room_media,
    room_stats,
    room_categories,
  } = room;

  const images = (room_media ?? [])
    .filter((media) => media.kind === "image")
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((media) => media.thumb_url || media.url);

  const hasVideo = (room_media ?? []).some((media) => media.kind === "video");

  const imageCount = images.length;
  const isVip = vip_level > 0;

  const authorInitial = contact_name?.trim().charAt(0).toUpperCase() || "U";

  const { mutate } = useMutationRequest({
    key: ["room-likes"],
    url: `room-likes`,
    method: "post",
    options: {
      onSuccess: async () => {
        notification.updateState({
          message: "Lưu thành công thành công",
          type: "success",
          open: true,
        });
      },

      onError: () => {
        notification.updateState({
          message: "Lưu thành công thất bại",
          type: "error",
          open: true,
        });
      },
    },
  });

  return (
    <Card className="overflow-hidden p-3.5">
      {/* IMAGE */}
      <ListingGallery
        title={title}
        images={images}
        imageCount={imageCount}
        hasVideo={hasVideo}
      />

      {/* TITLE */}
      <h2 className="mt-3 line-clamp-2 text-[15px] font-medium uppercase leading-6 text-[#dc3b2f]">
        <Link to={`/phong-tro/${id}`} className="hover:underline">
          {isVip && <StarRating />}
          {title}
        </Link>
      </h2>

      {/* PRICE - AREA */}
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <span className="font-semibold text-[#17b169]">
          {formatPrice(Number(price_monthly ?? 0))}
        </span>

        <span className="text-neutral-300">•</span>

        <span className="font-medium text-neutral-700">{area_m2} m²</span>

        {room_categories && (
          <>
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-500">{room_categories.name}</span>
          </>
        )}
      </div>

      {/* ADDRESS */}
      <div className="mt-2 flex items-start gap-1.5 text-[13px] text-neutral-500">
        <MapPin className="mt-0.5 size-4 shrink-0" />

        <span className="line-clamp-1">{full_address}</span>
      </div>

      {/* DESCRIPTION */}
      <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-neutral-500">
        {description}
      </p>

      {/* STATS */}
      <div className="mt-3 flex items-center gap-4 border-t border-neutral-100 pt-3 text-xs text-neutral-500">
        <span className="flex items-center gap-1">
          <Eye className="size-3.5" />
          {formatCount(room_stats?.view_count ?? 0)} lượt xem
        </span>

        <span className="flex items-center gap-1">
          <Heart className="size-3.5" />
          {formatCount(room_stats?.like_count ?? 0)} yêu thích
        </span>
      </div>

      {/* AUTHOR */}
      <div className="mt-3 flex items-center gap-2.5">
        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-orange-50 text-sm font-semibold text-[#ff5722]">
          {authorInitial}
        </div>

        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[13px] font-medium text-neutral-900">
            {contact_name}
          </p>

          <p className="mt-1 text-xs text-neutral-500">
            {formatDate(published_at ?? "")}
          </p>
        </div>

        <PhoneButton phone={contact_phone} />

        <FavoriteButton
          onToggle={() =>
            mutate({
              user_id: Number(authenSession?.user?.id),
              room_id: Number(id),
            })
          }
        />
      </div>
    </Card>
  );
}
