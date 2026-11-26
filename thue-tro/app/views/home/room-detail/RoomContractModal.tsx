import {
    FileText,
    Hash,
    CalendarDays,
    User,
    Home,
    Wallet,
    MapPin,
    Phone,
    ShieldCheck,
    StickyNote,
    Building2,
} from "lucide-react";

import Modal from "app/components/common/Modal";
import TextField from "app/components/common/TextField";
import Button from "app/components/common/Button";

import type { Rooms, Users } from "app/types/prisma-models";

import { formatDate } from "app/helper/date";

interface RoomContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    room: Rooms | undefined;
    user: Users | undefined;
}

export default function RoomContractModal({
    isOpen,
    onClose,
    room,
    user,
}: RoomContractModalProps) {
    if (!room || !user) return null;

    const displayValue = (value: string | number | null | undefined) => {
        if (value === null || value === undefined || value === "") {
            return "Chưa có thông tin";
        }

        return String(value);
    };

    const formatMoney = (value: string | number | null | undefined) => {
        if (value === null || value === undefined || value === "") {
            return "Chưa có thông tin";
        }

        const amount = Number(value);

        if (!Number.isFinite(amount)) {
            return "Chưa có thông tin";
        }

        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const sectionTitle =
        "flex items-center gap-2 text-sm font-semibold text-neutral-800";

    const sectionIcon = "text-[#ff5722]";

    const readOnlyClass = "pointer-events-none";

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

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title="Thông tin hợp đồng thuê phòng"
            size="xl"
            footer={footer}
        >
            <div className="space-y-6">
                {/* CONTRACT HEADER */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
                    <div>
                        <p className="text-xs text-neutral-500">
                            Thông tin hợp đồng
                        </p>

                        <p className="mt-1 flex items-center gap-2 font-semibold text-neutral-800">
                            <FileText size={17} className="text-[#ff5722]" />
                            HỢP ĐỒNG THUÊ PHÒNG
                        </p>
                    </div>

                    <span className="rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-medium text-[#ff5722]">
                        Bản xem trước
                    </span>
                </div>

                {/* TENANT INFORMATION */}
                <section className="space-y-4">
                    <div className="border-b border-neutral-100 pb-3">
                        <div className={sectionTitle}>
                            <User size={17} className={sectionIcon} />
                            Thông tin người thuê
                        </div>

                        <p className="mt-1 text-xs text-neutral-400">
                            Thông tin cá nhân của người thuê phòng
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextField
                            label="Mã người dùng"
                            value={`#${user.id}`}
                            readOnly
                            className={readOnlyClass}
                        />

                        <TextField
                            label="Họ và tên"
                            value={displayValue(user.full_name)}
                            readOnly
                            className={readOnlyClass}
                        />

                        <TextField
                            label="Số điện thoại"
                            value={displayValue(user.phone)}
                            readOnly
                            className={readOnlyClass}
                        />

                        <TextField
                            label="Email"
                            value={displayValue(user.email)}
                            readOnly
                            className={readOnlyClass}
                        />
                    </div>
                </section>

                {/* OWNER INFORMATION */}
                <section className="space-y-4">
                    <div className="border-b border-neutral-100 pb-3">
                        <div className={sectionTitle}>
                            <Building2 size={17} className={sectionIcon} />
                            Thông tin chủ phòng
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextField
                            label="Họ và tên chủ phòng"
                            value={displayValue(room.contact_name)}
                            readOnly
                            className={readOnlyClass}
                        />

                        <TextField
                            label="Số điện thoại chủ phòng"
                            value={displayValue(room.contact_phone)}
                            readOnly
                            className={readOnlyClass}
                        />

                        <TextField
                            label="Số Zalo"
                            value={displayValue(room.zalo_phone)}
                            readOnly
                            className={readOnlyClass}
                        />

                        <TextField
                            label="Mã chủ phòng"
                            value={`#${room.owner_id}`}
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
                            Thông tin phòng thuê
                        </div>

                        <p className="mt-1 text-xs text-neutral-400">
                            Thông tin chi tiết về phòng được thuê
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextField
                            label="Mã phòng"
                            value={`#${room.id}`}
                            readOnly
                            className={readOnlyClass}
                        />

                        <TextField
                            label="Tên phòng"
                            value={displayValue(room.title)}
                            readOnly
                            className={readOnlyClass}
                        />

                        <TextField
                            label="Diện tích"
                            value={`${room.area_m2} m²`}
                            readOnly
                            className={readOnlyClass}
                        />

                        <TextField
                            label="Số người tối đa"
                            value={
                                room.max_people != null
                                    ? `${room.max_people} người`
                                    : "Chưa có thông tin"
                            }
                            readOnly
                            className={readOnlyClass}
                        />

                        <TextField
                            label="Tỉnh / Thành phố"
                            value={displayValue(room.provinces?.name)}
                            readOnly
                            className={readOnlyClass}
                        />

                        <TextField
                            label="Phường / Xã"
                            value={displayValue(room.wards?.name)}
                            readOnly
                            className={readOnlyClass}
                        />

                        <div className="sm:col-span-2">
                            <TextField
                                label="Địa chỉ đầy đủ"
                                value={displayValue(room.full_address)}
                                readOnly
                                className={readOnlyClass}
                            />
                        </div>
                    </div>

                    {room.description && (
                        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-700">
                                <StickyNote
                                    size={15}
                                    className="text-neutral-400"
                                />
                                Mô tả phòng
                            </div>

                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-600">
                                {room.description}
                            </p>
                        </div>
                    )}
                </section>

                {/* RENTAL INFORMATION */}
                <section className="space-y-4">
                    <div className="border-b border-neutral-100 pb-3">
                        <div className={sectionTitle}>
                            <Wallet size={17} className={sectionIcon} />
                            Thông tin chi phí thuê
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextField
                            label="Giá thuê hàng tháng"
                            value={formatMoney(room.price_monthly)}
                            readOnly
                            className={readOnlyClass}
                        />

                        <TextField
                            label="Tiền đặt cọc đăng tin"
                            value={formatMoney(room.deposit)}
                            readOnly
                            className={readOnlyClass}
                        />

                        <TextField
                            label="Giá điện"
                            value={formatMoney(room.electricity_price)}
                            readOnly
                            className={readOnlyClass}
                        />

                        <TextField
                            label="Giá nước"
                            value={formatMoney(room.water_price)}
                            readOnly
                            className={readOnlyClass}
                        />
                    </div>

                    <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                        <p className="text-sm font-medium text-orange-700">
                            Giá thuê phòng
                        </p>

                        <p className="mt-2 text-2xl font-bold text-[#ff5722]">
                            {formatMoney(room.price_monthly)}
                        </p>

                        <p className="mt-1 text-xs text-orange-600">/ tháng</p>
                    </div>
                </section>

                {/* ROOM AVAILABILITY */}
                <section className="space-y-4">
                    <div className="border-b border-neutral-100 pb-3">
                        <div className={sectionTitle}>
                            <CalendarDays size={17} className={sectionIcon} />
                            Thời gian phòng có thể thuê
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextField
                            label="Ngày bắt đầu cho thuê"
                            value={
                                room.available_from
                                    ? formatDate(room.available_from, "date")
                                    : "Chưa xác định"
                            }
                            readOnly
                            className={readOnlyClass}
                        />

                        <TextField
                            label="Ngày đăng tin"
                            value={formatDate(room.created_at, "datetime")}
                            readOnly
                            className={readOnlyClass}
                        />
                    </div>
                </section>

                {/* DISCLAIMER */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
                        <ShieldCheck size={17} className="text-[#ff5722]" />
                        Lưu ý
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                        Đây là thông tin tham khảo được tổng hợp từ thông tin
                        phòng và tài khoản người dùng trên hệ thống. Các điều
                        khoản, thời hạn thuê, tiền cọc thực tế và thỏa thuận
                        giữa hai bên cần được xác nhận riêng trước khi ký hợp
                        đồng chính thức.
                    </p>
                </div>
            </div>
        </Modal>
    );
}
