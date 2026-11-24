import { ImagePlus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

import Modal from "app/components/common/Modal";
import TextField from "app/components/common/TextField";

import { useMutationRequest } from "app/hooks/useMutation";
import { useNotificationStore } from "app/stores/notification.store";
import type { Ads } from "app/types/prisma-models";

// ==========================================
// TYPES
// ==========================================

interface AdsModalProps {
    open: boolean;
    onClose: () => void;
    initialData?: Ads | null;
    loading?: boolean;
    refetch: () => Promise<unknown> | unknown;
}

type AdsStatus = Ads["status"];

interface AdsFormData {
    id: string | null;
    title: string;

    image_url: string;
    image_file: File | null;
    remove_image: boolean;

    image_mobile_url: string;

    alt_text: string;
    link_url: string;
    open_new_tab: boolean;

    advertiser_name: string;
    advertiser_phone: string;
    note: string;

    status: AdsStatus;
    starts_at: string;
    ends_at: string;

    sort_order: string;
    weight: string;
}

type AdsPayload = Omit<
    AdsFormData,
    | "id"
    | "image_file"
    | "image_url"
    | "image_mobile_url"
>;

// ==========================================
// INITIAL FORM
// ==========================================

const initialForm: AdsFormData = {
    id: null,
    title: "",

    image_url: "",
    image_file: null,
    remove_image: false,

    image_mobile_url: "",

    alt_text: "",
    link_url: "",
    open_new_tab: true,

    advertiser_name: "",
    advertiser_phone: "",
    note: "",

    status: "DRAFT" as AdsStatus,
    starts_at: "",
    ends_at: "",

    sort_order: "1",
    weight: "1",
};

// ==========================================
// HELPERS
// ==========================================

const toDateTimeLocal = (
    value: Date | string | null | undefined,
): string => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    const offset = date.getTimezoneOffset() * 60000;

    return new Date(date.getTime() - offset)
        .toISOString()
        .slice(0, 16);
};

const isValidVietnamesePhone = (phone: string): boolean => {
    return /^0[0-9]{9}$/.test(phone);
};

const getInitialForm = (ad?: Ads | null): AdsFormData => {
    if (!ad) return { ...initialForm };

    return {
        ...initialForm,

        id: String(ad.id),
        title: ad.title ?? "",

        image_url: ad.image_url ?? "",
        image_file: null,
        remove_image: false,

        image_mobile_url: ad.image_mobile_url ?? "",

        alt_text: ad.alt_text ?? "",
        link_url: ad.link_url ?? "",
        open_new_tab: ad.open_new_tab ?? true,

        advertiser_name: ad.advertiser_name ?? "",
        advertiser_phone: ad.advertiser_phone ?? "",
        note: ad.note ?? "",

        status: ad.status,
        starts_at: toDateTimeLocal(ad.starts_at),
        ends_at: toDateTimeLocal(ad.ends_at),

        sort_order: String(ad.sort_order ?? 1),
        weight: String(ad.weight ?? 1),
    };
};

// ==========================================
// COMPONENT
// ==========================================

export default function AdsModal({
    open,
    onClose,
    initialData,
    loading = false,
    refetch,
}: AdsModalProps) {
    const notification = useNotificationStore();

    const [form, setForm] = useState<AdsFormData>(initialForm);
    const [formError, setFormError] = useState("");
    const [imagePreview, setImagePreview] = useState("");

    const isEdit = form.id !== null;

    // ==========================================
    // MUTATION
    // ==========================================

    const { mutate, isPending } = useMutationRequest<unknown, FormData>({
        key: ["ads-save"],
        url: isEdit ? `ads/${form.id}` : "ads",
        method: isEdit ? "patch" : "post",

        options: {
            onSuccess: async () => {
                notification.updateState({
                    message: isEdit
                        ? "Chỉnh sửa quảng cáo thành công"
                        : "Thêm quảng cáo thành công",
                    type: "success",
                    open: true,
                });

                await refetch();
                onClose();
            },

            onError: () => {
                notification.updateState({
                    message: isEdit
                        ? "Chỉnh sửa quảng cáo thất bại"
                        : "Thêm quảng cáo thất bại",
                    type: "error",
                    open: true,
                });
            },
        },
    });

    const isBusy = loading || isPending;

    // ==========================================
    // EFFECTS
    // ==========================================

    useEffect(() => {
        if (!open) {
            setForm({ ...initialForm });
            setFormError("");
            setImagePreview("");
            return;
        }

        setForm(getInitialForm(initialData));
        setFormError("");
    }, [open, initialData]);

    // Tạo và thu hồi URL preview của ảnh local.

    useEffect(() => {
        if (!form.image_file) {
            setImagePreview(form.image_url);
            return;
        }

        const previewUrl = URL.createObjectURL(form.image_file);

        setImagePreview(previewUrl);

        return () => {
            URL.revokeObjectURL(previewUrl);
        };
    }, [form.image_file, form.image_url]);

    // ==========================================
    // FORM HANDLERS
    // ==========================================

    const handleChange = <K extends keyof AdsFormData>(
        key: K,
        value: AdsFormData[K],
    ) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));

        setFormError("");
    };

    // ==========================================
    // IMAGE HANDLERS
    // ==========================================

    const handleSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            setFormError("Chỉ hỗ trợ hình ảnh JPG, PNG và WEBP.");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setFormError("Hình ảnh không được vượt quá 5MB.");
            e.target.value = "";
            return;
        }

        setForm((prev) => ({
            ...prev,
            image_file: file,
            remove_image: false,
        }));

        setFormError("");

        // Cho phép chọn lại cùng một file.
        e.target.value = "";
    };

    // Xóa hoàn toàn ảnh hiện tại trên form.
    // Nếu người dùng chọn ảnh mới rồi xóa thì ảnh cũ cũng không được khôi phục.

    const handleRemoveImage = () => {
        setForm((prev) => ({
            ...prev,
            image_file: null,
            image_url: "",
            image_mobile_url: "",
            remove_image: true,
        }));

        setImagePreview("");
        setFormError("");
    };

    // ==========================================
    // VALIDATION
    // ==========================================

    const validateForm = (): boolean => {
        if (!form.title.trim()) {
            setFormError("Vui lòng nhập tiêu đề quảng cáo.");
            return false;
        }

        if (!form.image_file && !form.image_url) {
            setFormError("Vui lòng chọn ảnh quảng cáo.");
            return false;
        }

        const phone = form.advertiser_phone.trim();

        if (!phone) {
            setFormError("Vui lòng nhập số điện thoại nhà quảng cáo.");
            return false;
        }

        if (!isValidVietnamesePhone(phone)) {
            setFormError(
                "Số điện thoại không hợp lệ. Vui lòng nhập số bắt đầu bằng 0 và có 9–10 chữ số.",
            );
            return false;
        }

        const sortOrder = Number(form.sort_order);

        if (
            !Number.isSafeInteger(sortOrder) ||
            sortOrder < -32768 ||
            sortOrder > 32767
        ) {
            setFormError(
                "Thứ tự sắp xếp phải là số nguyên từ -32768 đến 32767.",
            );
            return false;
        }

        const weight = Number(form.weight);

        if (!Number.isSafeInteger(weight) || weight < 1 || weight > 255) {
            setFormError("Weight phải là số nguyên từ 1 đến 255.");
            return false;
        }

        if (form.starts_at && form.ends_at) {
            const startsAt = new Date(form.starts_at).getTime();
            const endsAt = new Date(form.ends_at).getTime();

            if (
                !Number.isFinite(startsAt) ||
                !Number.isFinite(endsAt) ||
                startsAt > endsAt
            ) {
                setFormError(
                    "Thời gian kết thúc phải sau thời gian bắt đầu.",
                );
                return false;
            }
        }

        return true;
    };

    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isBusy) return;

        if (isEdit && !form.id) {
            setFormError("ID quảng cáo không hợp lệ.");
            return;
        }

        if (!validateForm()) return;

        try {
            setFormError("");

            const payload: AdsPayload = {
                title: form.title.trim(),

                alt_text: form.alt_text.trim(),
                link_url: form.link_url.trim(),
                open_new_tab: form.open_new_tab,

                advertiser_name: form.advertiser_name.trim(),
                advertiser_phone: form.advertiser_phone.trim(),
                note: form.note.trim(),

                status: form.status,

                starts_at: form.starts_at
                    ? new Date(form.starts_at).toISOString()
                    : "",

                ends_at: form.ends_at
                    ? new Date(form.ends_at).toISOString()
                    : "",

                sort_order: form.sort_order,
                weight: form.weight,

                remove_image: form.remove_image,
            };

            const formData = new FormData();

            Object.entries(payload).forEach(([key, value]) => {
                if (value === null || value === undefined) return;

                formData.append(key, String(value));
            });

            if (form.image_file instanceof File) {
                formData.append("files", form.image_file);
            }

            mutate(formData);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Không thể chuẩn bị dữ liệu quảng cáo.";

            setFormError(message);
        }
    };

    // ==========================================
    // FOOTER
    // ==========================================

    const footer = (
        <div className="flex justify-end gap-2">
            <button
                type="button"
                onClick={onClose}
                disabled={isBusy}
                className="flex h-10 items-center gap-2 rounded-lg border border-neutral-200 px-4 text-sm text-neutral-600 transition hover:bg-neutral-50 disabled:opacity-50"
            >
                <X size={16} />
                Hủy
            </button>

            <button
                type="submit"
                form="ads-form"
                disabled={isBusy}
                className="flex h-10 items-center gap-2 rounded-lg bg-[#dc3b2f] px-5 text-sm font-medium text-white transition hover:bg-[#c93227] disabled:opacity-50"
            >
                <Save size={16} />

                {isBusy
                    ? "Đang xử lý..."
                    : isEdit
                      ? "Lưu thay đổi"
                      : "Thêm quảng cáo"}
            </button>
        </div>
    );

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={isEdit ? "Chỉnh sửa quảng cáo" : "Thêm quảng cáo"}
            size="xl"
            footer={footer}
        >
            <form
                id="ads-form"
                onSubmit={handleSubmit}
                className="space-y-2"
            >
                {/* 01. THÔNG TIN CƠ BẢN */}

                <section className="space-y-4">
                    <div className="border-b border-neutral-100 pb-3">
                        <h3 className="text-sm font-semibold text-neutral-800">
                            Thông tin cơ bản
                        </h3>

                        <p className="mt-1 text-xs text-neutral-400">
                            Thông tin giới thiệu quảng cáo
                        </p>
                    </div>

                    <TextField
                        label="Tiêu đề quảng cáo"
                        value={form.title}
                        required
                        maxLength={150}
                        onChange={(value) =>
                            handleChange("title", value)
                        }
                    />
                </section>

                {/* 02. HÌNH ẢNH */}

                <section className="space-y-4">
                    <div className="border-b border-neutral-100 pb-3">
                        <h3 className="text-sm font-semibold text-neutral-800">
                            Hình ảnh quảng cáo
                            <span className="ml-1 text-red-500">*</span>
                        </h3>

                        <p className="mt-1 text-xs text-neutral-400">
                            Một ảnh được sử dụng cho cả giao diện desktop và
                            mobile
                        </p>
                    </div>

                    {imagePreview ? (
                        <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                            <div className="flex min-h-48 items-center justify-center p-3">
                                <img
                                    src={imagePreview}
                                    alt={
                                        form.alt_text ||
                                        form.title ||
                                        "Ảnh quảng cáo"
                                    }
                                    className="max-h-72 max-w-full object-contain"
                                />
                            </div>

                            <div className="absolute right-2 top-2 flex gap-2">
                                <label
                                    title="Thay ảnh"
                                    className="grid size-9 cursor-pointer place-items-center rounded-lg bg-white shadow transition hover:bg-neutral-100"
                                >
                                    <ImagePlus size={17} />

                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={handleSelectImage}
                                    />
                                </label>

                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    title="Xóa ảnh"
                                    disabled={isBusy}
                                    className="grid size-9 place-items-center rounded-lg bg-white text-red-500 shadow transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Trash2 size={17} />
                                </button>
                            </div>

                            {form.image_file && (
                                <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[10px] text-white">
                                    Ảnh mới - chưa upload
                                </div>
                            )}
                        </div>
                    ) : (
                        <label className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 transition hover:border-[#dc3b2f] hover:bg-red-50/30">
                            <ImagePlus
                                size={32}
                                className="text-neutral-400"
                            />

                            <span className="mt-2 text-sm font-medium text-neutral-600">
                                Chọn hình ảnh quảng cáo
                            </span>

                            <span className="mt-1 text-xs text-neutral-400">
                                JPG, PNG, WEBP - Tối đa 5MB
                            </span>

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={handleSelectImage}
                            />
                        </label>
                    )}

                    <TextField
                        label="Alt text"
                        value={form.alt_text}
                        maxLength={255}
                        onChange={(value) =>
                            handleChange("alt_text", value)
                        }
                    />
                </section>

                {/* 03. LIÊN KẾT */}

                <section className="space-y-4">
                    <div className="border-b border-neutral-100 pb-3">
                        <h3 className="text-sm font-semibold text-neutral-800">
                            Liên kết
                        </h3>

                        <p className="mt-1 text-xs text-neutral-400">
                            Địa chỉ người dùng được chuyển đến khi nhấn quảng
                            cáo
                        </p>
                    </div>

                    <TextField
                        label="URL liên kết"
                        value={form.link_url}
                        maxLength={1000}
                        onChange={(value) =>
                            handleChange("link_url", value)
                        }
                    />

                    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-neutral-200 p-4">
                        <span className="text-sm text-neutral-700">
                            Mở liên kết trong tab mới
                        </span>

                        <input
                            type="checkbox"
                            checked={form.open_new_tab}
                            onChange={(e) =>
                                handleChange(
                                    "open_new_tab",
                                    e.target.checked,
                                )
                            }
                            className="size-4 accent-[#dc3b2f]"
                        />
                    </label>
                </section>

                {/* 04. NHÀ QUẢNG CÁO */}

                <section className="space-y-4">
                    <div className="border-b border-neutral-100 pb-3">
                        <h3 className="text-sm font-semibold text-neutral-800">
                            Thông tin nhà quảng cáo
                        </h3>

                        <p className="mt-1 text-xs text-neutral-400">
                            Thông tin liên hệ của nhà quảng cáo
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextField
                            label="Tên nhà quảng cáo"
                            value={form.advertiser_name}
                            maxLength={150}
                            onChange={(value) =>
                                handleChange("advertiser_name", value)
                            }
                        />

                        <div>
                            <TextField
                                label="Số điện thoại"
                                value={form.advertiser_phone}
                                required
                                maxLength={10}
                                onChange={(value) => {
                                    handleChange(
                                        "advertiser_phone",
                                        value.replace(/\D/g, ""),
                                    );
                                }}
                            />

                            <p className="mt-1 text-xs text-neutral-400">
                                Bắt đầu bằng số 0, gồm 9–10 chữ số
                            </p>
                        </div>
                    </div>

                    <TextField
                        label="Ghi chú"
                        value={form.note}
                        maxLength={500}
                        onChange={(value) =>
                            handleChange("note", value)
                        }
                    />
                </section>

                {/* 05. THỜI GIAN */}

                <section className="space-y-4">
                    <div className="border-b border-neutral-100 pb-3">
                        <h3 className="text-sm font-semibold text-neutral-800">
                            Thời gian hiển thị
                        </h3>

                        <p className="mt-1 text-xs text-neutral-400">
                            Thiết lập thời gian bắt đầu và kết thúc quảng cáo
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextField
                            label="Thời gian bắt đầu"
                            type="datetime-local"
                            value={form.starts_at}
                            onChange={(value) =>
                                handleChange("starts_at", value)
                            }
                        />

                        <TextField
                            label="Thời gian kết thúc"
                            type="datetime-local"
                            value={form.ends_at}
                            onChange={(value) =>
                                handleChange("ends_at", value)
                            }
                        />
                    </div>
                </section>

                {/* 06. CẤU HÌNH */}

                <section className="space-y-4">
                    <div className="border-b border-neutral-100 pb-3">
                        <h3 className="text-sm font-semibold text-neutral-800">
                            Cấu hình quảng cáo
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                Trạng thái
                            </label>

                            <select
                                value={form.status}
                                onChange={(e) =>
                                    handleChange(
                                        "status",
                                        e.target.value as AdsStatus,
                                    )
                                }
                                className="h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm outline-none transition focus:border-[#dc3b2f]"
                            >
                                <option value="DRAFT">Bản nháp</option>
                                <option value="ACTIVE">Hoạt động</option>
                                <option value="PAUSED">Tạm dừng</option>
                                <option value="EXPIRED">Hết hạn</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                Thứ tự sắp xếp
                            </label>

                            <TextField
                                type="number"
                                step="1"
                                value={form.sort_order}
                                onChange={(value) =>
                                    handleChange("sort_order", value)
                                }
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                Weight
                            </label>

                            <TextField
                                type="number"
                                min={1}
                                max={255}
                                step="1"
                                value={form.weight}
                                onChange={(value) =>
                                    handleChange("weight", value)
                                }
                            />
                        </div>
                    </div>
                </section>

                {/* ERROR */}

                {formError && (
                    <p
                        role="alert"
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600"
                    >
                        {formError}
                    </p>
                )}
            </form>
        </Modal>
    );
}