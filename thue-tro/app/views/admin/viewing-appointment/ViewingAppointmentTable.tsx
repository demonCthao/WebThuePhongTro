
import type { DynamicColumn } from "app/components/common/DynamicTable";
import { formatDate } from "app/helper/date";
import type { ViewingAppointments } from "app/types/prisma-models";
import {
    CalendarDays,
    MessageSquare,
    Phone,
    StickyNote,
    User,
    XCircle
} from "lucide-react";
import { statusConfig } from "./ViewingAppointmentModal";

export const viewingAppointmentsColumns: DynamicColumn<ViewingAppointments>[] = [
    {
        key: "id",
        title: "Mã lịch hẹn",
        render: (appointment) => (
            <div className="min-w-[110px]">
                <p className="font-semibold text-white">
                    #{appointment.id}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                    Phòng #{appointment.room_id}
                </p>
            </div>
        ),
    },
    {
        key: "seeker_id",
        title: "Người đặt lịch",
        render: (appointment) => (
            <div className="min-w-[150px]">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <User size={14} className="shrink-0 text-gray-500" />
                    {appointment.users_viewing_appointments_seeker_idTousers?.full_name
                        ?? `Người dùng #${appointment.seeker_id}`}
                </div>

                {appointment.users_viewing_appointments_seeker_idTousers?.email && (
                    <p className="mt-1 truncate text-xs text-gray-500">
                        {appointment.users_viewing_appointments_seeker_idTousers.email}
                    </p>
                )}
            </div>
        ),
    },
    {
        key: "scheduled_at",
        title: "Thời gian hẹn",
        render: (appointment) => (
            <div className="min-w-[170px] space-y-1 text-xs text-gray-400">
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <CalendarDays size={13} className="text-emerald-500" />
                    <span>
                        {formatDate(appointment.scheduled_at, "datetime")}
                    </span>
                </div>
            </div>
        ),
    },
    {
        key: "contact_phone",
        title: "Liên hệ",
        render: (appointment) => (
            <div className="min-w-[130px]">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Phone size={14} className="shrink-0 text-gray-500" />
                    {appointment.contact_phone || "Chưa có SĐT"}
                </div>
            </div>
        ),
    },
    {
        key: "seeker_note",
        title: "Ghi chú người đặt",
        render: (appointment) => (
            <div className="min-w-[180px] max-w-[220px]">
                <div className="flex items-start gap-2 text-sm text-gray-300">
                    <StickyNote size={14} className="mt-0.5 shrink-0 text-gray-500" />
                    <span className="line-clamp-2">
                        {appointment.seeker_note || "Không có ghi chú"}
                    </span>
                </div>
            </div>
        ),
    },
    {
        key: "owner_note",
        title: "Phản hồi chủ phòng",
        render: (appointment) => (
            <div className="min-w-[180px] max-w-[220px]">
                <div className="flex items-start gap-2 text-sm text-gray-300">
                    <MessageSquare size={14} className="mt-0.5 shrink-0 text-gray-500" />
                    <span className="line-clamp-2">
                        {appointment.owner_note || "Chưa có phản hồi"}
                    </span>
                </div>
            </div>
        ),
    },
    {
        key: "status",
        title: "Trạng thái",
        render: (appointment) => {
            const status = statusConfig[appointment.status];

            return (
                <span
                    className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
                >
                    {status.label}
                </span>
            );
        },
    },
    {
        key: "cancel_reason",
        title: "Thông tin hủy",
        render: (appointment) => (
            <div className="min-w-[180px] max-w-[220px]">
                {appointment.cancel_reason ? (
                    <div className="flex items-start gap-2 text-xs text-red-400">
                        <XCircle size={14} className="mt-0.5 shrink-0" />
                        <span className="line-clamp-2">
                            {appointment.cancel_reason}
                        </span>
                    </div>
                ) : (
                    <span className="text-xs text-gray-500">—</span>
                )}
            </div>
        ),
    },
    {
        key: "confirmed_at",
        title: "Ngày xác nhận",
        render: (appointment) => (
            <div className="whitespace-nowrap text-xs text-gray-400">
                {appointment.confirmed_at
                    ? formatDate(appointment.confirmed_at, "datetime")
                    : "Chưa xác nhận"}
            </div>
        ),
    },
    {
        key: "created_at",
        title: "Ngày tạo",
        render: (appointment) => (
            <div className="flex items-center gap-2 whitespace-nowrap text-xs text-gray-400">
                <CalendarDays size={14} />
                {formatDate(appointment.created_at)}
            </div>
        ),
    },
];
