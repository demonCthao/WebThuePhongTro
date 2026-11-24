import type { DynamicColumn } from "app/components/common/DynamicTable";
import Image from "app/components/common/Image";
import type { Ads } from "app/types/prisma-models";
import {
    CalendarDays,
    MousePointerClick,
    Eye,
    ExternalLink,
    Layout,
    User,
} from "lucide-react";

const formatDate = (value: string | null) => {
    if (!value) return "Không giới hạn";

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
    active: {
        title: "Đang chạy",
        className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    paused: {
        title: "Tạm dừng",
        className: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    },
    expired: {
        title: "Hết hạn",
        className: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    },
    rejected: {
        title: "Từ chối",
        className: "bg-red-500/10 text-red-400 border-red-500/20",
    },
};

export const adsColumns: DynamicColumn<Ads>[] = [
    {
        key: "title",
        title: "Thông tin quảng cáo",
        render: (ad) => (
            <div className="flex min-w-[280px] items-center gap-3">
                <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-[#252529]">
                    {ad.image_url ? (
                        <Image
                            src={ad.image_url}
                            alt={ad.alt_text || ad.title}
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
                        {ad.title}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">ID: #{ad.id}</p>

                    {ad.open_new_tab && (
                        <span className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500">
                            <ExternalLink size={11} />
                            Mở tab mới
                        </span>
                    )}
                </div>
            </div>
        ),
    },
    {
        key: "placement_id",
        title: "Vị trí hiển thị",
        render: (ad) => (
            <div className="min-w-[160px]">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Layout size={15} className="shrink-0 text-emerald-500" />
                    {ad.ad_placements?.name ?? "Chưa xác định"}
                </div>

                <p className="mt-1 text-xs text-gray-500">
                    {ad.ad_placements?.width_px ?? "?"} ×{" "}
                    {ad.ad_placements?.height_px ?? "?"} px
                </p>
            </div>
        ),
    },
    {
        key: "advertiser_name",
        title: "Nhà quảng cáo",
        render: (ad) => (
            <div className="min-w-[160px]">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <User size={14} className="shrink-0 text-gray-500" />
                    {ad.advertiser_name || "Chưa có"}
                </div>

                <p className="mt-1 text-xs text-gray-500">
                    {ad.advertiser_phone || "Chưa có SĐT"}
                </p>
            </div>
        ),
    },
    {
        key: "starts_at",
        title: "Thời gian chạy",
        render: (ad) => (
            <div className="min-w-[150px] space-y-1 text-xs text-gray-400">
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <CalendarDays size={13} className="text-emerald-500" />
                    <span>Bắt đầu: {formatDate(ad.starts_at)}</span>
                </div>

                <div className="flex items-center gap-2 whitespace-nowrap">
                    <CalendarDays size={13} className="text-orange-400" />
                    <span>Kết thúc: {formatDate(ad.ends_at)}</span>
                </div>
            </div>
        ),
    },
    {
        key: "ad_stats",
        title: "Hiệu quả",
        render: (ad) => (
            <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 whitespace-nowrap text-gray-300">
                    <Eye size={14} className="text-blue-400" />
                    <span>
                        {Number(
                            ad.ad_stats?.impression_count ?? 0,
                        ).toLocaleString("vi-VN")}{" "}
                        lượt xem
                    </span>
                </div>

                <div className="flex items-center gap-2 whitespace-nowrap text-gray-300">
                    <MousePointerClick size={14} className="text-emerald-400" />
                    <span>
                        {Number(ad.ad_stats?.click_count ?? 0).toLocaleString(
                            "vi-VN",
                        )}{" "}
                        lượt click
                    </span>
                </div>
            </div>
        ),
    },
    {
        key: "sort_order",
        title: "Thứ tự",
        render: (ad) => (
            <div className="whitespace-nowrap text-sm text-gray-300">
                {ad.sort_order}
            </div>
        ),
    },
    {
        key: "status",
        title: "Trạng thái",
        render: (ad) => {
            const status = statusConfig[ad.status] ?? {
                title: ad.status,
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
        render: (ad) => (
            <div className="flex items-center gap-2 whitespace-nowrap text-xs text-gray-400">
                <CalendarDays size={14} />
                {formatDate(ad.created_at)}
            </div>
        ),
    },
];
