import { Save, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import Modal from "app/components/common/Modal";
import SelectField from "app/components/common/SelectField";
import TextField from "app/components/common/TextField";

import type { Option } from "app/data/mock";
import { useMutationRequest } from "app/hooks/useMutation";
import { cn } from "app/helper/cn";
import { useNotificationStore } from "app/stores/notification.store";
import Button from "app/components/common/Button";

// ==========================================
// TYPES
// ==========================================

export interface WardFormData {
    id: number | null;
    province_id: string;
    code: string;
    name: string;
    full_name: string;
    ward_type: string;
    slug: string;
    name_search: string;
    center_lat: string;
    center_lng: string;
    is_active: boolean;
    merged_into: string;
}

export interface WardPayload {
    province_id: number;
    code: string;
    name: string;
    full_name: string;
    ward_type: string;
    slug: string;
    name_search: string;
    center_lat: number | null;
    center_lng: number | null;
    is_active: boolean;
    merged_into: number | null;
}

interface WardInitialData {
    id?: number | null;
    province_id?: string | number | null;
    code?: string | null;
    name?: string | null;
    full_name?: string | null;
    ward_type?: string | null;
    slug?: string | null;
    name_search?: string | null;
    center_lat?: string | number | null;
    center_lng?: string | number | null;
    is_active?: boolean | number | string;
    merged_into?: string | number | null;
}

interface WardModalProps {
    open: boolean;
    onClose: () => void;
    provinces: Option[];
    initialData?: WardInitialData | null;
    loading?: boolean;
    refetch: () => Promise<unknown> | unknown;
}

// ==========================================
// CONSTANTS
// ==========================================

const initialForm: WardFormData = {
    id: null,
    province_id: "",
    code: "",
    name: "",
    full_name: "",
    ward_type: "",
    slug: "",
    name_search: "",
    center_lat: "",
    center_lng: "",
    is_active: true,
    merged_into: "",
};

const wardTypeOptions: Option[] = [
    { value: "ward", label: "Phường" },
    { value: "commune", label: "Xã" },
    { value: "special_zone", label: "Thị trấn" },
];

// ==========================================
// HELPERS
// ==========================================

const toInputValue = (value: string | number | null | undefined): string => {
    return value == null ? "" : String(value);
};

const toBoolean = (value: boolean | number | string | undefined): boolean => {
    return value === true || value === 1 || value === "1" || value === "true";
};

const toOptionalNumber = (value: string): number | null => {
    if (value.trim() === "") return null;

    const number = Number(value);

    return Number.isFinite(number) ? number : null;
};

const getInitialForm = (data?: WardInitialData | null): WardFormData => ({
    id: data?.id ?? null,
    province_id: toInputValue(data?.province_id),
    code: data?.code ?? "",
    name: data?.name ?? "",
    full_name: data?.full_name ?? "",
    ward_type: data?.ward_type ?? "",
    slug: data?.slug ?? "",
    name_search: data?.name_search ?? "",
    center_lat: toInputValue(data?.center_lat),
    center_lng: toInputValue(data?.center_lng),
    is_active: data?.is_active === undefined ? true : toBoolean(data.is_active),
    merged_into: toInputValue(data?.merged_into),
});

// ==========================================
// COMPONENT
// ==========================================

export default function WardModal({
    open,
    onClose,
    provinces,
    initialData,
    loading = false,
    refetch,
}: WardModalProps) {
    const notification = useNotificationStore();

    const [form, setForm] = useState<WardFormData>(initialForm);
    const [formError, setFormError] = useState("");

    // ID có giá trị nghĩa là đang chỉnh sửa
    const isEdit = form.id !== null;

    const { mutate, isPending } = useMutationRequest({
        key: ["wards-update"],
        url: isEdit ? `wards/${form.id}` : "wards",
        method: isEdit ? "patch" : "post",
        options: {
            onSuccess: async () => {
                notification.updateState({
                    message: isEdit
                        ? "Chỉnh sửa phường xã thành công"
                        : "Thêm phường xã thành công",
                    type: "success",
                    open: true,
                });

                await refetch();
                onClose();
            },

            onError: () => {
                notification.updateState({
                    message: isEdit
                        ? "Chỉnh sửa phường xã thất bại"
                        : "Thêm phường xã thất bại",
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

    const handleChange = (key: keyof WardFormData, value: string | boolean) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));

        setFormError("");
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isBusy) return;

        // Validate ID khi chỉnh sửa
        if (isEdit && (!form.id || form.id <= 0)) {
            setFormError("ID phường xã không hợp lệ.");
            return;
        }

        // Required fields
        if (!form.province_id) {
            setFormError("Vui lòng chọn tỉnh / thành phố.");
            return;
        }

        if (!form.ward_type) {
            setFormError("Vui lòng chọn loại đơn vị hành chính.");
            return;
        }

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

        // Parse province_id
        const provinceId = Number(form.province_id);

        if (!Number.isSafeInteger(provinceId) || provinceId <= 0) {
            setFormError("Tỉnh / thành phố không hợp lệ.");
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

        // Parse merged_into
        const mergedInto =
            form.merged_into.trim() === "" ? null : Number(form.merged_into);

        if (
            mergedInto !== null &&
            (!Number.isSafeInteger(mergedInto) || mergedInto <= 0)
        ) {
            setFormError("Mã phường xã được sáp nhập không hợp lệ.");
            return;
        }

        // Build API payload
        // ID được truyền qua URL, không gửi trong body
        const payload: WardPayload = {
            province_id: provinceId,
            code: form.code.trim(),
            name: form.name.trim(),
            full_name: form.full_name.trim(),
            ward_type: form.ward_type,
            slug: form.slug.trim(),
            name_search: form.name_search.trim(),
            center_lat: centerLat,
            center_lng: centerLng,
            is_active: form.is_active,
            merged_into: mergedInto,
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
                form="ward-form"
                disabled={isBusy}
                className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#dc3b2f] px-5 text-sm font-medium text-white transition hover:bg-[#c93227] disabled:cursor-not-allowed disabled:opacity-50"
            >
                <Save size={16} />

                {isBusy
                    ? "Đang xử lý..."
                    : isEdit
                      ? "Lưu thay đổi"
                      : "Thêm phường xã"}
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
            title={isEdit ? "Chỉnh sửa phường xã" : "Thêm phường xã"}
            size="xl"
            footer={footer}
        >
            <form id="ward-form" onSubmit={handleSubmit} className="space-y-4">
                {/* THÔNG TIN CƠ BẢN */}

                <section className="space-y-4">
                    <div className="border-b border-neutral-100 pb-3">
                        <h3 className="text-sm font-semibold text-neutral-800">
                            Thông tin cơ bản
                        </h3>

                        <p className="mt-1 text-xs text-neutral-400">
                            Nhập thông tin định danh của phường xã
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2">
                        <SelectField
                            label="Tỉnh / Thành phố"
                            value={form.province_id}
                            options={provinces}
                            placeholder="Chọn tỉnh / thành phố"
                            onChange={(value) =>
                                handleChange("province_id", value)
                            }
                        />

                        <SelectField
                            label="Loại đơn vị hành chính"
                            value={form.ward_type}
                            options={wardTypeOptions}
                            placeholder="Chọn loại đơn vị"
                            onChange={(value) =>
                                handleChange("ward_type", value)
                            }
                        />

                        <TextField
                            label="Mã phường xã"
                            value={form.code}
                            required
                            maxLength={20}
                            onChange={(value) => handleChange("code", value)}
                        />

                        <TextField
                            label="Tên phường xã"
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
                            Tọa độ trung tâm của phường xã
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

                {/* TRẠNG THÁI */}

                <section className="space-y-3">
                    <div className="border-b border-neutral-100 pb-3">
                        <h3 className="text-sm font-semibold text-neutral-800">
                            Trạng thái
                        </h3>

                        <p className="mt-1 text-xs text-neutral-400">
                            Quản lý trạng thái hoạt động của phường xã
                        </p>
                    </div>

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
                                    Cho phép phường xã được sử dụng trên hệ
                                    thống
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
