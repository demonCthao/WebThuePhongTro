import { useEffect, useState, type FormEvent } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import type { Rooms } from "app/types/prisma-models";
import Modal from "app/components/common/Modal";
import TextField from "app/components/common/TextField";
import { getSession } from "app/helper/auth-storage";

interface BookingPayload {
    room_id: string;
    appointment_at: string;
    note: string;
}

interface BookingModalProps {
    open: boolean;
    onClose: () => void;
    room: Rooms | undefined;
    onSubmit: (data: BookingPayload) => void | Promise<void>;
    isPending?: boolean;
}

const formatPrice = (price: string) => {
    const value = Number(price);

    if (!Number.isFinite(value)) return "Chưa cập nhật giá";

    return `${value.toLocaleString("vi-VN")} đ/tháng`;
};

const getMinDateTime = () => {
    const date = new Date();

    date.setMinutes(date.getMinutes() + 1);
    date.setSeconds(0, 0);

    const offset = date.getTimezoneOffset() * 60000;

    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export default function BookingModal({
    open,
    onClose,
    room,
    onSubmit,
    isPending = false,
}: BookingModalProps) {
    const authenSession = getSession();
    const [appointmentAt, setAppointmentAt] = useState("");
    const [note, setNote] = useState("");
    const [error, setError] = useState("");

    const [minDateTime, setMinDateTime] = useState(getMinDateTime);

    useEffect(() => {
        if (!open) return;
        setAppointmentAt("");
        setNote("");
        setError("");
        setMinDateTime(getMinDateTime());
    }, [open, room?.id]);

    const coverImage =
        room?.room_media?.find((media) => media.is_cover) ??
        room?.room_media?.[0];

    const imageUrl = coverImage?.thumb_url || coverImage?.url;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (!room) {
            setError("Không tìm thấy thông tin phòng.");
            return;
        }

        if (!appointmentAt) {
            setError("Vui lòng chọn thời gian xem phòng.");
            return;
        }

        const selectedDate = new Date(appointmentAt);

        if (
            Number.isNaN(selectedDate.getTime()) ||
            selectedDate.getTime() <= Date.now()
        ) {
            setError("Thời gian xem phòng phải ở tương lai.");
            return;
        }

        try {
            await onSubmit({
                room_id: room.id,
                appointment_at: selectedDate.toISOString(),
                note: note.trim(),
            });
        } catch {
            setError("Không thể gửi yêu cầu đặt lịch. Vui lòng thử lại.");
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Đặt lịch xem phòng"
            size="lg"
            footer={
                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="h-10 rounded-lg border border-neutral-300 px-5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Hủy
                    </button>

                    <button
                        type="submit"
                        form="booking-form"
                        disabled={isPending || !room}
                        className="h-10 rounded-lg bg-[#ff5722] px-6 text-sm font-semibold text-white transition hover:bg-[#ed4d1c] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isPending ? "Đang gửi..." : "Xác nhận đặt lịch"}
                    </button>
                </div>
            }
        >
            {!room ? (
                <div className="py-10 text-center text-sm text-neutral-500">
                    Không tìm thấy thông tin phòng.
                </div>
            ) : (
                <form
                    id="booking-form"
                    onSubmit={handleSubmit}
                    className="space-y-2"
                >
                    {/* Thông tin phòng */}
                    <section>
                        <h3 className="mb-3 text-sm font-semibold text-neutral-800">
                            Thông tin phòng
                        </h3>

                        <div className="flex gap-3 rounded-xl border border-neutral-200 p-3">
                            <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={room.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                                        No image
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <h4 className="line-clamp-2 text-sm font-semibold text-neutral-900">
                                    {room.title}
                                </h4>

                                <div className="mt-1 flex items-start gap-1 text-xs text-neutral-500">
                                    <MapPin
                                        size={14}
                                        className="mt-0.5 shrink-0"
                                    />
                                    <span>{room.full_address}</span>
                                </div>

                                <p className="mt-2 text-sm font-bold text-[#ff5722]">
                                    {formatPrice(room.price_monthly)}
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="border-t border-neutral-100" />

                    {/* Thông tin liên hệ */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold text-neutral-800">
                            Thông tin liên hệ
                        </h3>

                        <TextField
                            label="Họ và tên"
                            value={authenSession?.user?.full_name || ""}
                            autoComplete="name"
                            readOnly
                        />

                        <TextField
                            label="Số điện thoại"
                            type="tel"
                            value={authenSession?.user?.phone || ""}
                            maxLength={10}
                            autoComplete="tel"
                            readOnly
                        />
                    </section>

                    <div className="border-t border-neutral-100" />

                    {/* Lịch xem phòng */}
                    <section className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-800">
                                Thời gian xem phòng
                            </h3>

                            <p className="mt-1 text-xs text-neutral-500">
                                Chọn ngày và giờ trong tương lai để chủ phòng
                                sắp xếp đón bạn.
                            </p>
                        </div>

                        <div className="relative">
                            <CalendarDays
                                size={17}
                                className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-neutral-400"
                            />

                            <TextField
                                label="Ngày và giờ xem phòng"
                                type="datetime-local"
                                value={appointmentAt}
                                onChange={setAppointmentAt}
                                min={minDateTime}
                                className="[&_input]:pl-10"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-700">
                                Ghi chú thêm
                                <span className="ml-1 font-normal text-neutral-400">
                                    (Không bắt buộc)
                                </span>
                            </label>

                            <textarea
                                value={note}
                                onChange={(event) =>
                                    setNote(event.target.value)
                                }
                                rows={3}
                                maxLength={500}
                                placeholder="Ví dụ: Tôi muốn xem phòng vào buổi chiều..."
                                className="w-full resize-none rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#ff5722]"
                            />

                            <p className="mt-1 text-right text-xs text-neutral-400">
                                {note.length}/500
                            </p>
                        </div>
                    </section>

                    {error && (
                        <div
                            role="alert"
                            className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600"
                        >
                            {error}
                        </div>
                    )}

                    <div className="rounded-lg bg-orange-50 p-3 text-xs leading-5 text-orange-800">
                        <strong>Lưu ý:</strong> Yêu cầu đặt lịch sẽ được gửi đến
                        chủ phòng. Lịch hẹn chỉ được xác nhận sau khi chủ phòng
                        phản hồi qua số điện thoại của bạn.
                    </div>
                </form>
            )}
        </Modal>
    );
}
