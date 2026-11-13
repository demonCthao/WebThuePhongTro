import type { DynamicColumn } from "app/components/common/DynamicTable";
import { formatPrice } from "app/helper/price";
import type { Rooms } from "app/types/prisma-models";
import { MapPin, Users, Crown, CalendarDays } from "lucide-react";

const formatDate = (value: string | null) => {
    if (!value) return "Chưa có";

    return new Date(value).toLocaleDateString("vi-VN");
};

const statusConfig: Record<string, { title: string; className: string }> = {
    draft: {
        title: "Bản nháp",
        className: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    },
    pending: {
        title: "Chờ duyệt",
        className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    },
    approved: {
        title: "Đã duyệt",
        className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    hidden: {
        title: "Đã ẩn",
        className: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    },
    rejected: {
        title: "Từ chối",
        className: "bg-red-500/10 text-red-400 border-red-500/20",
    },
};

export const roomsColumns: DynamicColumn<Rooms>[] = [
    {
        key: "title",
        title: "Thông tin phòng",
        render: (room) => {
            const coverImage =
                room.room_media?.find((media) => media.is_cover) ??
                room.room_media?.[0];

            return (
                <div className="flex min-w-[260px] items-center gap-3">
                    <div className="h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-[#252529]">
                        {coverImage?.thumb_url || coverImage?.url ? (
                            <img
                                src={coverImage.thumb_url || coverImage.url}
                                alt={room.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-xs text-gray-500">
                                No image
                            </div>
                        )}
                    </div>

                    <div className="min-w-0">
                        <p className="max-w-[220px] truncate font-medium text-white">
                            {room.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            ID: #{room.id}
                        </p>
                    </div>
                </div>
            );
        },
    },
    {
        key: "price_monthly",
        title: "Giá thuê",
        render: (room) => (
            <div>
                <p className="whitespace-nowrap font-semibold text-emerald-400">
                    {formatPrice(Number(room?.price_monthly ?? 0))}
                </p>
                <p className="text-xs text-gray-500">/ tháng</p>
            </div>
        ),
    },
    {
        key: "area_m2",
        title: "Diện tích",
        render: (room) => (
            <span className="whitespace-nowrap text-gray-300">
                {room.area_m2} m²
            </span>
        ),
    },
    {
        key: "full_address",
        title: "Địa chỉ",
        render: (room) => (
            <div className="flex min-w-[200px] items-start gap-2">
                <MapPin
                    size={15}
                    className="mt-0.5 shrink-0 text-emerald-500"
                />
                <div>
                    <p className="text-sm text-gray-300">
                        {room.wards?.name ?? "Chưa xác định"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                        {room.provinces?.name ?? "Chưa xác định"}
                    </p>
                </div>
            </div>
        ),
    },
    {
        key: "max_people",
        title: "Sức chứa",
        render: (room) => (
            <div className="flex items-center gap-2 whitespace-nowrap text-gray-300">
                <Users size={15} className="text-gray-500" />
                {room.max_people
                    ? `${room.max_people} người`
                    : "Không giới hạn"}
            </div>
        ),
    },
    {
        key: "vip_level",
        title: "VIP",
        render: (room) =>
            room.vip_level > 0 ? (
                <div className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-1 text-xs font-semibold text-yellow-400">
                    <Crown size={13} />
                    VIP {room.vip_level}
                </div>
            ) : (
                <span className="text-xs text-gray-500">Thường</span>
            ),
    },
    {
        key: "status",
        title: "Trạng thái",
        render: (room) => {
            const status = statusConfig[room.status] ?? {
                title: room.status,
                className: "bg-gray-500/10 text-gray-400 border-gray-500/20",
            };

            return (
                <span
                    className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
                >
                    {status.title}
                </span>
            );
        },
    },
    {
        key: "created_at",
        title: "Ngày tạo",
        render: (room) => (
            <div className="flex items-center gap-2 whitespace-nowrap text-xs text-gray-400">
                <CalendarDays size={14} />
                {formatDate(room.created_at)}
            </div>
        ),
    },
];
