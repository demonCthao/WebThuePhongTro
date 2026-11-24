import Card from "app/components/common/Card";
import Image from "app/components/common/Image";
import FavoriteButton from "app/components/layout/home/FavoriteButton";
import { getSession } from "app/helper/auth-storage";
import { formatDate } from "app/helper/date";
import { formatVnd } from "app/helper/price";
import { useMutationRequest } from "app/hooks/useMutation";
import { useNotificationStore } from "app/stores/notification.store";
import type { Rooms } from "app/types/prisma-models";
import { Camera, MapPin } from "lucide-react";
import { Link } from "react-router";

interface ListingRowCardProps {
    room: Rooms;
}

export default function ListingGridCard({ room }: ListingRowCardProps) {
    const notification = useNotificationStore();
    const authenSession = getSession();
    const {
        id,
        title,
        price_monthly,
        wards,
        provinces,
        street_address,
        description,
        room_media,
        created_at,
    } = room;

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
        <Card className="group flex h-full min-w-0 flex-col overflow-hidden p-0 transition-shadow hover:shadow-md">
            {/* IMAGE */}
            <Link
                to={`/phong-tro/${id}`}
                className="relative block aspect-[4/3] w-full shrink-0 overflow-hidden"
            >
                <Image
                    src={room_media?.[0]?.thumb_url || room_media?.[0]?.url}
                    alt={title}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded bg-black/55 px-1.5 py-0.5 text-[10px] text-white">
                    <Camera size={11} />
                    {room_media?.length ?? 0}
                </span>
            </Link>

            {/* CONTENT */}
            <div className="flex min-w-0 flex-1 flex-col p-2.5">
                {/* TITLE */}
                <h2 className="line-clamp-2 text-[13px] font-semibold leading-[18px] text-[#1a4fb0]">
                    <Link to={`/phong-tro/${id}`} className="hover:underline">
                        {title}
                    </Link>
                </h2>

                {/* PRICE */}
                <p className="mt-1.5 truncate text-[13px] font-bold text-[#17b169]">
                    {formatVnd(Number(price_monthly ?? "0"))}
                </p>

                {/* AREA / LOCATION */}
                <div className="mt-1 flex items-center gap-1 text-[11px] text-neutral-500">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate">
                        {wards?.name}, {provinces?.name}
                    </span>
                </div>

                {/* DESCRIPTION */}
                <p className="mt-1.5 line-clamp-2 text-[11px] leading-4 text-neutral-500">
                    {description}
                </p>

                {/* FOOTER */}
                <div className="mt-auto flex items-center justify-between gap-1 border-t border-neutral-100 pt-2 mt-2">
                    <span className="truncate text-[10px] text-neutral-400">
                        {formatDate(created_at, "datetime")}
                    </span>

                    <FavoriteButton
                        onToggle={() =>
                            mutate({
                                user_id: Number(authenSession?.user?.id),
                                room_id: Number(id),
                            })
                        }
                    />
                </div>
            </div>
        </Card>
    );
}
