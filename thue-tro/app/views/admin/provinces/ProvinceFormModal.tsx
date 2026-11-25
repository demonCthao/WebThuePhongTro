import { useEffect, useState, type FormEvent } from "react";
import { Save, X } from "lucide-react";

import { cn } from "app/helper/cn";
import Modal from "app/components/common/Modal";
import TextField from "app/components/common/TextField";

import type { Provinces } from "app/types/prisma-models";
import { useMutationRequest } from "app/hooks/useMutation";
import { useNotificationStore } from "app/stores/notification.store";
import Button from "app/components/common/Button";

// ==========================================
// TYPES
// ==========================================

interface ProvinceModalProps {
    open: boolean;
    onClose: () => void;
    initialData?: Provinces | null;
    loading?: boolean;
    refetch: () => Promise<unknown>;
}

export interface ProvinceFormData {
    id: number | null;
    code: string;
    name: string;
    full_name: string;
    slug: string;
    name_search: string;
    center_lat: string;
    center_lng: string;
    sort_order: string;
    is_active: boolean;
}

type ProvincePayload = Omit<
    ProvinceFormData,
    "id" | "center_lat" | "center_lng" | "sort_order"
> & {
    center_lat: number | null;
    center_lng: number | null;
    sort_order: number;
};

// ==========================================
// INITIAL FORM
// ==========================================

const initialForm: ProvinceFormData = {
    id: null,
    code: "",
    name: "",
    full_name: "",
    slug: "",
    name_search: "",
    center_lat: "",
    center_lng: "",
    sort_order: "0",
    is_active: true,
};

const getInitialForm = (province?: Provinces | null): ProvinceFormData => {
    if (!province) return initialForm;

    return {
        id: province.id,
        code: province.code ?? "",
        name: province.name ?? "",
        full_name: province.full_name ?? "",
        slug: province.slug ?? "",
        name_search: province.name_search ?? "",
        center_lat: province.center_lat?.toString() ?? "",
        center_lng: province.center_lng?.toString() ?? "",
        sort_order: String(province.sort_order ?? 0),
        is_active: province.is_active ?? true,
    };
};

// ==========================================
// HELPERS
// ==========================================

const toOptionalNumber = (value: string): number | null => {
    if (value.trim() === "") return null;

    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
};

// ==========================================
// COMPONENT
// ==========================================

export default function ProvinceModal({
    open,
    onClose,
    initialData,
    loading = false,
    refetch,
}: ProvinceModalProps) {
    const notification = useNotificationStore();

    const [form, setForm] = useState<ProvinceFormData>(initialForm);
    const [formError, setFormError] = useState("");

    // ID có giá trị nghĩa là đang chỉnh sửa
    const isEdit = form.id !== null;

    const { mutate, isPending } = useMutationRequest({
        key: ["provinces-update"],
        url: isEdit ? `provinces/${form.id}` : "provinces",
        method: isEdit ? "patch" : "post",
        options: {
            onSuccess: async () => {
                notification.updateState({
                    message: isEdit
                        ? "Chỉnh sửa tỉnh / thành phố thành công"
                        : "Thêm tỉnh / thành phố thành công",
                    type: "success",
                    open: true,
                });

                await refetch();
                onClose();
            },

            onError: () => {
                notification.updateState({
                    message: isEdit
                        ? "Chỉnh sửa tỉnh / thành phố thất bại"
                        : "Thêm tỉnh / thành phố thất bại",
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
        if (!open) return;

        setForm(getInitialForm(initialData));
        setFormError("");
    }, [open, initialData]);

    // ==========================================
    // HANDLERS
    // ==========================================

    const handleChange = (
        key: keyof ProvinceFormData,
        value: string | boolean,
    ) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));

        setFormError("");
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isBusy) return;

        // Validate ID
        if (isEdit && (!form.id || form.id <= 0)) {
            setFormError("ID tỉnh / thành phố không hợp lệ.");
            return;
        }

        // Required fields
        if (
            !form.code.trim() ||
            !form.name.trim() ||
            !form.full_name.trim() ||
            !form.slug.trim() ||
            !form.name_search.trim()
        ) {
            setFormError("Vui lòng nhập đầy đủ thông tin cơ bản.");
            return;
        }

        // Parse coordinates
        const centerLat = toOptionalNumber(form.center_lat);
        const centerLng = toOptionalNumber(form.center_lng);

        if (form.center_lat.trim() !== "" && centerLat === null) {
            setFormError("Vĩ độ không hợp lệ.");
            return;
        }

        if (form.center_lng.trim() !== "" && centerLng === null) {
            setFormError("Kinh độ không hợp lệ.");
            return;
        }

        if (centerLat !== null && (centerLat < -90 || centerLat > 90)) {
            setFormError("Vĩ độ phải nằm trong khoảng -90 đến 90.");
            return;
        }

        if (centerLng !== null && (centerLng < -180 || centerLng > 180)) {
            setFormError("Kinh độ phải nằm trong khoảng -180 đến 180.");
            return;
        }

        // Parse sort_order
        const sortOrder = Number(form.sort_order);

        if (
            !Number.isSafeInteger(sortOrder) ||
            sortOrder < -32768 ||
            sortOrder > 32767
        ) {
            setFormError(
                "Thứ tự sắp xếp phải là số nguyên từ -32768 đến 32767.",
            );
            return;
        }

        // Build payload
        const payload: ProvincePayload = {
            code: form.code.trim(),
            name: form.name.trim(),
            full_name: form.full_name.trim(),
            slug: form.slug.trim(),
            name_search: form.name_search.trim(),
            center_lat: centerLat,
            center_lng: centerLng,
            sort_order: sortOrder,
            is_active: form.is_active,
        };

        mutate(payload);
    };

    // ==========================================
    // FOOTER
    // ==========================================

    const footer = (
        <div className="flex justify-end gap-2">
            <Button
                type="button"
                onClick={onClose}
                disabled={isBusy}
                className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 px-4 text-sm text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <X size={16} />
                Hủy
            </Button>

            <Button
                type="submit"
                form="province-form"
                disabled={isBusy}
                className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#dc3b2f] px-5 text-sm font-medium text-white transition hover:bg-[#c93227] disabled:cursor-not-allowed disabled:opacity-50"
            >
                <Save size={16} />

                {isBusy
                    ? "Đang xử lý..."
                    : isEdit
                      ? "Lưu thay đổi"
                      : "Thêm tỉnh / thành phố"}
            </Button>
        </div>
    );

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={
                isEdit ? "Chỉnh sửa tỉnh / thành phố" : "Thêm tỉnh / thành phố"
            }
            size="xl"
            footer={footer}
        >
            <form
                id="province-form"
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                {/* THÔNG TIN CƠ BẢN */}

                <section className="space-y-4">
                    <div className="border-b border-neutral-100 pb-3">
                        <h3 className="text-sm font-semibold text-neutral-800">
                            Thông tin cơ bản
                        </h3>

                        <p className="mt-1 text-xs text-neutral-400">
                            Nhập thông tin định danh của tỉnh / thành phố
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2">
                        <TextField
                            label="Mã tỉnh"
                            value={form.code}
                            required
                            maxLength={20}
                            onChange={(value) => handleChange("code", value)}
                        />

                        <TextField
                            label="Tên tỉnh"
                            value={form.name}
                            required
                            maxLength={100}
                            onChange={(value) => handleChange("name", value)}
                        />

                        <div className="sm:col-span-2">
                            <TextField
                                label="Tên đầy đủ"
                                value={form.full_name}
                                required
                                maxLength={150}
                                onChange={(value) =>
                                    handleChange("full_name", value)
                                }
                            />
                        </div>

                        <TextField
                            label="Slug"
                            value={form.slug}
                            required
                            maxLength={100}
                            onChange={(value) => handleChange("slug", value)}
                        />

                        <TextField
                            label="Tên tìm kiếm"
                            value={form.name_search}
                            required
                            maxLength={100}
                            onChange={(value) =>
                                handleChange("name_search", value)
                            }
                        />
                    </div>
                </section>

                {/* VỊ TRÍ ĐỊA LÝ */}

                <section className="space-y-3">
                    <div className="border-b border-neutral-100 pb-3">
                        <h3 className="text-sm font-semibold text-neutral-800">
                            Vị trí địa lý
                        </h3>

                        <p className="mt-1 text-xs text-neutral-400">
                            Tọa độ trung tâm của tỉnh / thành phố
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <TextField
                            label="Vĩ độ (Latitude)"
                            type="number"
                            step="any"
                            min={-90}
                            max={90}
                            value={form.center_lat}
                            onChange={(value) =>
                                handleChange("center_lat", value)
                            }
                        />

                        <TextField
                            label="Kinh độ (Longitude)"
                            type="number"
                            step="any"
                            min={-180}
                            max={180}
                            value={form.center_lng}
                            onChange={(value) =>
                                handleChange("center_lng", value)
                            }
                        />
                    </div>
                </section>

                {/* CẤU HÌNH */}

                <section className="space-y-3">
                    <div className="border-b border-neutral-100 pb-3">
                        <h3 className="text-sm font-semibold text-neutral-800">
                            Cấu hình
                        </h3>

                        <p className="mt-1 text-xs text-neutral-400">
                            Thiết lập thứ tự hiển thị và trạng thái hoạt động
                        </p>
                    </div>

                    <TextField
                        label="Thứ tự sắp xếp"
                        type="number"
                        step="1"
                        min={-32768}
                        max={32767}
                        value={form.sort_order}
                        onChange={(value) => handleChange("sort_order", value)}
                    />

                    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-neutral-200 p-4 transition hover:border-[#ff5722]/40 hover:bg-[#fffaf8]">
                        <div className="flex items-center gap-3">
                            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#fff1ed]">
                                <span
                                    className={cn(
                                        "size-2.5 rounded-full",
                                        form.is_active
                                            ? "bg-[#ff5722]"
                                            : "bg-neutral-400",
                                    )}
                                />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-neutral-800">
                                    Đang hoạt động
                                </p>

                                <p className="mt-1 text-xs text-neutral-400">
                                    Cho phép tỉnh / thành phố được sử dụng trên
                                    hệ thống
                                </p>
                            </div>
                        </div>

                        <input
                            type="checkbox"
                            checked={form.is_active}
                            onChange={(e) =>
                                handleChange("is_active", e.target.checked)
                            }
                            className="size-4 cursor-pointer accent-[#dc3b2f]"
                        />
                    </label>
                </section>

                {/* FORM ERROR */}

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
