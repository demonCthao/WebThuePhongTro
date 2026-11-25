import Card from "app/components/common/Card";
import Image from "app/components/common/Image";
import { formatDate } from "app/helper/date";
import { formatVnd } from "app/helper/price";
import type { ViewingAppointments, ViewingAppointmentsStatus } from "app/types/prisma-models";
import { CalendarDays, Camera, MapPin, Phone, StickyNote } from "lucide-react";
import { Link } from "react-router";

interface ViewingAppointmentCardProps {
    appointment: ViewingAppointments;
}

const STATUS_CONFIG: Record<
    ViewingAppointmentsStatus,
    {
        label: string;
        className: string;
    }
> = {
    pending: {
        label: "Chờ xác nhận",
        className: "bg-amber-50 text-amber-600",
    },
    confirmed: {
        label: "Đã xác nhận",
        className: "bg-green-50 text-green-600",
    },
    cancelled: {
        label: "Đã hủy",
        className: "bg-red-50 text-red-600",
    },
    completed: {
        label: "Đã hoàn thành",
        className: "bg-blue-50 text-blue-600",
    },
    no_show: {
        label: "Không đến",
        className: "bg-neutral-100 text-neutral-600",
    },
};

export default function ViewingAppointmentCard({
    appointment,
}: ViewingAppointmentCardProps) {
    const {
        scheduled_at,
        status,
        contact_phone,
        seeker_note,
        owner_note,
        rooms,
    } = appointment;

    // API chưa trả về thông tin phòng
    if (!rooms) {
        return null;
    }

    const { id, title, price_monthly, wards, provinces, room_media } = rooms;

    const statusConfig = STATUS_CONFIG[status] ?? {
        label: status,
        className: "bg-neutral-100 text-neutral-600",
    };

    return (
        <Card className="group flex h-full min-w-0 flex-col overflow-hidden p-0 transition-shadow hover:shadow-md sm:flex-row">
            {/* ROOM IMAGE */}
            <Link
                to={`/phong-tro/${id}`}
                className="relative block aspect-[4/3] w-full shrink-0 overflow-hidden sm:aspect-square sm:w-40"
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
            <div className="flex min-w-0 flex-1 flex-col p-3">
                {/* TITLE + STATUS */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                    <h2 className="min-w-0 flex-1 text-sm font-semibold leading-5 text-[#1a4fb0]">
                        <Link
                            to={`/phong-tro/${id}`}
                            className="line-clamp-2 hover:underline"
                        >
                            {title}
                        </Link>
                    </h2>

                    <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${statusConfig.className}`}
                    >
                        {statusConfig.label}
                    </span>
                </div>

                {/* PRICE */}
                <p className="mt-1.5 text-sm font-bold text-[#17b169]">
                    {formatVnd(Number(price_monthly ?? "0"))}
                </p>

                {/* LOCATION */}
                <div className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
                    <MapPin size={13} className="shrink-0" />
                    <span className="truncate">
                        {wards?.name}, {provinces?.name}
                    </span>
                </div>

                {/* APPOINTMENT INFORMATION */}
                <div className="mt-3 space-y-2 border-t border-neutral-100 pt-3">
                    {/* SCHEDULED AT */}
                    <div className="flex items-center gap-2 text-xs">
                        <CalendarDays
                            size={14}
                            className="shrink-0 text-blue-500"
                        />

                        <span className="text-neutral-500">Thời gian hẹn:</span>

                        <span className="font-semibold text-neutral-700">
                            {formatDate(scheduled_at, "datetime")}
                        </span>
                    </div>

                    {/* CONTACT PHONE */}
                    {contact_phone && (
                        <div className="flex items-center gap-2 text-xs">
                            <Phone
                                size={14}
                                className="shrink-0 text-neutral-400"
                            />

                            <span className="text-neutral-500">
                                Số điện thoại:
                            </span>

                            <span className="font-medium text-neutral-700">
                                {contact_phone}
                            </span>
                        </div>
                    )}

                    {/* SEEKER NOTE */}
                    {seeker_note?.trim() && (
                        <div className="flex items-start gap-2 text-xs">
                            <StickyNote
                                size={14}
                                className="mt-0.5 shrink-0 text-neutral-400"
                            />

                            <span className="shrink-0 text-neutral-500">
                                Ghi chú:
                            </span>

                            <span className="text-neutral-700">
                                {seeker_note}
                            </span>
                        </div>
                    )}

                    {/* OWNER NOTE */}
                    {owner_note?.trim() && (
                        <div className="rounded-md bg-blue-50 p-2 text-xs text-blue-700">
                            <p className="mb-1 font-semibold">
                                Phản hồi từ chủ phòng:
                            </p>

                            <p>{owner_note}</p>
                        </div>
                    )}

                    {/* CANCEL REASON */}
                    {appointment.cancel_reason?.trim() && (
                        <div className="rounded-md bg-red-50 p-2 text-xs text-red-600">
                            <p className="mb-1 font-semibold">Lý do hủy:</p>

                            <p>{appointment.cancel_reason}</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
