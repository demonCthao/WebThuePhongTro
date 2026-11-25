import {
    CalendarDays,
    User,
    Home,
    StickyNote,
    MessageSquare,
    XCircle,
    CheckCircle2,
    Hash,
} from "lucide-react";

import Modal from "app/components/common/Modal";
import TextField from "app/components/common/TextField";
import Button from "app/components/common/Button";

import type { ViewingAppointments } from "app/types/prisma-models";
import { formatDate } from "app/helper/date";

interface ViewingAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: ViewingAppointments | null;
}

export const statusConfig = {
    pending: {
        label: "Chờ xác nhận",
        className: "border-amber-500/30 bg-amber-50 text-amber-600",
    },
    confirmed: {
        label: "Đã xác nhận",
        className: "border-emerald-500/30 bg-emerald-50 text-emerald-600",
    },
    completed: {
        label: "Đã hoàn thành",
        className: "border-blue-500/30 bg-blue-50 text-blue-600",
    },
    cancelled: {
        label: "Đã hủy",
        className: "border-red-500/30 bg-red-50 text-red-600",
    },
    no_show: {
        label: "Không đến",
        className: "border-neutral-300 bg-neutral-100 text-neutral-600",
    },
} satisfies Record<
    ViewingAppointments["status"],
    { label: string; className: string }
>;

export default function ViewingAppointmentModal({
    isOpen,
    onClose,
    appointment,
}: ViewingAppointmentModalProps) {
    if (!appointment) return null;

    const status = statusConfig[appointment.status];

    const seeker = appointment.users_viewing_appointments_seeker_idTousers;

    const cancelledBy =
        appointment.users_viewing_appointments_cancelled_byTousers;

    const room = appointment.rooms;

    const displayValue = (value: string | null | undefined) =>
        value?.trim() || "Chưa có thông tin";

    const footer = (
        <div className="flex justify-end">
            <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-auto border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
            >
                Đóng
            </Button>
        </div>
    );

    const sectionTitle =
        "flex items-center gap-2 text-sm font-semibold text-neutral-800";

    const sectionIcon = "text-[#ff5722]";

    const readOnlyClass = "pointer-events-none";

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title="Chi tiết lịch hẹn"
            size="xl"
            footer={footer}
        >
            <div className="space-y-6">
                {/* STATUS */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <div>
                        <p className="text-xs text-neutral-500">Mã lịch hẹn</p>

                        <p className="mt-1 flex items-center gap-2 font-semibold text-neutral-800">
                            <Hash size={15} className="text-neutral-400" />
                            {appointment.id}
                        </p>
                    </div>

                    <span
                        className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium ${status.className}`}
                    >
                        {status.label}
                    </span>
                </div>

                {/* APPOINTMENT INFORMATION */}
                <section className="space-y-4">
                    <div className="border-b border-neutral-100 pb-3">
                        <div className={sectionTitle}>
                            <CalendarDays size={17} className={sectionIcon} />
                            Thông tin lịch hẹn
                        </div>

                        <p className="mt-1 text-xs text-neutral-400">
                            Thông tin thời gian và liên hệ của lịch xem phòng
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextField
                            label="Thời gian hẹn"
                            value={formatDate(
                                appointment.scheduled_at,
                                "datetime",
                            )}
                            readOnly
                            className={readOnlyClass}
                        />

                        <TextField
                            label="Ngày tạo lịch"
                            value={formatDate(
                                appointment.created_at,
                                "datetime",
                            )}
                            readOnly
                            className={readOnlyClass}
                        />

                        <TextField
                            label="Mã phòng"
                            value={`#${appointment.room_id}`}
                            readOnly
                            className={readOnlyClass}
                        />

                        <TextField
                            label="Số điện thoại liên hệ"
                            value={displayValue(appointment.contact_phone)}
                            readOnly
                            className={readOnlyClass}
                        />
                    </div>
                </section>

                {/* SEEKER INFORMATION */}
                <section className="space-y-4">
                    <div className="border-b border-neutral-100 pb-3">
                        <div className={sectionTitle}>
                            <User size={17} className={sectionIcon} />
                            Người đặt lịch
                        </div>

                        <p className="mt-1 text-xs text-neutral-400">
                            Thông tin tài khoản người đăng ký xem phòng
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextField
                            label="Họ và tên"
                            value={
                                seeker?.full_name ||
                                `Người dùng #${appointment.seeker_id}`
                            }
                            readOnly
                            className={readOnlyClass}
                        />

                        <TextField
                            label="Email"
                            value={displayValue(seeker?.email)}
                            readOnly
                            className={readOnlyClass}
                        />
                    </div>
                </section>

                {/* ROOM INFORMATION */}
                <section className="space-y-4">
                    <div className="border-b border-neutral-100 pb-3">
                        <div className={sectionTitle}>
                            <Home size={17} className={sectionIcon} />
                            Thông tin phòng
                        </div>

                        <p className="mt-1 text-xs text-neutral-400">
                            Thông tin phòng được đăng ký xem
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextField
                            label="Tên phòng"
                            value={
                                room?.title || `Phòng #${appointment.room_id}`
                            }
                            readOnly
                            className={readOnlyClass}
                        />
                    </div>
                </section>

                {/* NOTES */}
                <section className="space-y-4">
                    <div className="border-b border-neutral-100 pb-3">
                        <div className={sectionTitle}>
                            <StickyNote size={17} className={sectionIcon} />
                            Ghi chú và phản hồi
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-700">
                                <User size={15} className="text-neutral-400" />
                                Ghi chú người đặt
                            </div>

                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-600">
                                {displayValue(appointment.seeker_note)}
                            </p>
                        </div>

                        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-700">
                                <MessageSquare
                                    size={15}
                                    className="text-neutral-400"
                                />
                                Phản hồi chủ phòng
                            </div>

                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-600">
                                {displayValue(appointment.owner_note)}
                            </p>
                        </div>
                    </div>
                </section>

                {/* CONFIRMATION INFORMATION */}
                <section className="space-y-4">
                    <div className="border-b border-neutral-100 pb-3">
                        <div className={sectionTitle}>
                            <CheckCircle2 size={17} className={sectionIcon} />
                            Lịch sử trạng thái
                        </div>

                        <p className="mt-1 text-xs text-neutral-400">
                            Thông tin xác nhận và hủy lịch
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextField
                            label="Thời gian xác nhận"
                            value={
                                appointment.confirmed_at
                                    ? formatDate(
                                          appointment.confirmed_at,
                                          "datetime",
                                      )
                                    : "Chưa xác nhận"
                            }
                            readOnly
                            className={readOnlyClass}
                        />

                        <TextField
                            label="Thời gian hủy"
                            value={
                                appointment.cancelled_at
                                    ? formatDate(
                                          appointment.cancelled_at,
                                          "datetime",
                                      )
                                    : "Không có"
                            }
                            readOnly
                            className={readOnlyClass}
                        />
                    </div>

                    {appointment.cancelled_by && (
                        <TextField
                            label="Người thực hiện hủy"
                            value={
                                cancelledBy?.full_name ||
                                `Người dùng #${appointment.cancelled_by}`
                            }
                            readOnly
                            className={readOnlyClass}
                        />
                    )}

                    {appointment.cancel_reason && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-red-600">
                                <XCircle size={15} />
                                Lý do hủy lịch
                            </div>

                            <p className="whitespace-pre-wrap text-sm text-red-500">
                                {appointment.cancel_reason}
                            </p>
                        </div>
                    )}
                </section>

                {/* UPDATED AT */}
                <div className="border-t border-neutral-100 pt-4">
                    <p className="text-xs text-neutral-400">
                        Cập nhật lần cuối:{" "}
                        <span className="text-neutral-600">
                            {formatDate(appointment.updated_at, "datetime")}
                        </span>
                    </p>
                </div>
            </div>
        </Modal>
    );
}
