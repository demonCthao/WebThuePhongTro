import Modal from "app/components/common/Modal";
import SelectField from "app/components/common/SelectField";
import TextField from "app/components/common/TextField";
import { api } from "app/configs/ky-config";
import type { Option } from "app/data/mock";
import { cn } from "app/helper/cn";
import { useMutationRequest } from "app/hooks/useMutation";
import { useNotificationStore } from "app/stores/notification.store";

import {
    ArrowDown,
    ArrowUp,
    ImagePlus,
    Save,
    Star,
    Trash2,
    Upload,
    X,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";

// ==========================================

// TYPES

// ==========================================

export interface RoomMediaForm {
    id?: string | number;
    url: string;
    thumb_url: string;
    sort_order: number;
    is_cover: boolean;
    // Chỉ sử dụng ở frontend
    file?: File;
    preview_url?: string;
}

export interface RoomFormData {
    id: string | null;
    category_id: string;
    title: string;
    slug: string;
    description: string;
    price_monthly: string;
    deposit: string;
    electricity_price: string;
    water_price: string;
    area_m2: string;
    max_people: string;
    floor_no: string;
    available_from: string;
    province_id: string;
    ward_id: string;
    street_address: string;
    full_address: string;
    latitude: string;
    longitude: string;
    contact_name: string;
    contact_phone: string;
    zalo_phone: string;
    zalo_url: string;
    amenity_ids: number[];
    room_media: RoomMediaForm[];
}

export interface RoomInitialData {
    id?: string | number | bigint | null;
    category_id?: string | number | null;
    title?: string | null;
    slug?: string | null;
    description?: string | null;
    price_monthly?: string | number | bigint | null;
    deposit?: string | number | bigint | null;
    electricity_price?: string | number | null;
    water_price?: string | number | null;
    area_m2?: string | number | null;
    max_people?: string | number | null;
    floor_no?: string | number | null;
    available_from?: string | null;
    province_id?: string | number | null;
    ward_id?: string | number | null;
    street_address?: string | null;
    full_address?: string | null;
    latitude?: string | number | null;
    longitude?: string | number | null;
    contact_name?: string | null;
    contact_phone?: string | null;
    zalo_phone?: string | null;
    zalo_url?: string | null;
    amenity_ids?: number[];
    room_media?: RoomMediaForm[];
}

interface RoomModalProps {
    open: boolean;
    onClose: () => void;
    categories: Option[];
    provinces: Option[];
    wards: Option[];
    amenities: Option[];
    initialData?: RoomInitialData | null;
    refetch: () => Promise<unknown> | unknown;
}

// ==========================================

// CONSTANTS

// ==========================================

const initialForm: RoomFormData = {
    id: null,
    category_id: "",
    title: "",
    slug: "",
    description: "",
    price_monthly: "",
    deposit: "",
    electricity_price: "",
    water_price: "",
    area_m2: "",
    max_people: "",
    floor_no: "",
    available_from: "",
    province_id: "",
    ward_id: "",
    street_address: "",
    full_address: "",
    latitude: "",
    longitude: "",
    contact_name: "",
    contact_phone: "",
    zalo_phone: "",
    zalo_url: "",
    amenity_ids: [],
    room_media: [],
};

// ==========================================

// HELPERS
// ==========================================

// Địa chỉ gốc của backend dùng để resolve URL tương đối trong DB.
// Nếu dự án có biến môi trường riêng, thay giá trị này bằng import.meta.env.VITE_API_URL
// và loại bỏ hậu tố /api nếu VITE_API_URL đang trỏ tới API prefix.
const API_BASE_URL = "http://localhost:3000";

const getImageUrl = (url?: string | null): string => {
    if (!url) return "";

    // Giữ nguyên URL tuyệt đối, Blob URL và Data URL.
    if (/^(https?:|blob:|data:)/i.test(url)) {
        return url;
    }

    // Chuẩn hóa URL tương đối từ backend, ví dụ /uploads/image.jpg.
    return `${API_BASE_URL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
};

const toInputValue = (
    value: string | number | bigint | null | undefined,
): string => {
    return value == null ? "" : String(value);
};

const toOptionalNumber = (value: string): number | null => {
    if (value.trim() === "") return null;

    const number = Number(value);

    return Number.isFinite(number) ? number : null;
};

// Chuyển tiếng Việt thành slug

const generateSlug = (value: string): string => {
    return value

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g, "")

        .replace(/đ/g, "d")

        .replace(/Đ/g, "d")

        .toLowerCase()

        .trim()

        .replace(/[^a-z0-9]+/g, "-")

        .replace(/^-+|-+$/g, "");
};

// Lấy label từ Option

const getOptionLabel = (options: Option[], value: string): string => {
    return options.find((item) => String(item.value) === value)?.label ?? "";
};

// Tạo địa chỉ đầy đủ

const buildFullAddress = (
    street: string,

    wardId: string,

    provinceId: string,

    wards: Option[],

    provinces: Option[],
): string => {
    return [
        street.trim(),

        getOptionLabel(wards, wardId),

        getOptionLabel(provinces, provinceId),
    ]

        .filter(Boolean)

        .join(", ");
};

// Khởi tạo dữ liệu form

const getInitialForm = (data?: RoomInitialData | null): RoomFormData => ({
    ...initialForm,

    id: toInputValue(data?.id) || null,

    category_id: toInputValue(data?.category_id),

    title: data?.title ?? "",

    slug: data?.slug ?? "",

    description: data?.description ?? "",

    price_monthly: toInputValue(data?.price_monthly),

    deposit: toInputValue(data?.deposit),

    electricity_price: toInputValue(data?.electricity_price),

    water_price: toInputValue(data?.water_price),

    area_m2: toInputValue(data?.area_m2),

    max_people: toInputValue(data?.max_people),

    floor_no: toInputValue(data?.floor_no),

    available_from: data?.available_from?.slice(0, 10) ?? "",

    province_id: toInputValue(data?.province_id),

    ward_id: toInputValue(data?.ward_id),

    street_address: data?.street_address ?? "",

    full_address: data?.full_address ?? "",

    latitude: toInputValue(data?.latitude),

    longitude: toInputValue(data?.longitude),

    contact_name: data?.contact_name ?? "",

    contact_phone: data?.contact_phone ?? "",

    zalo_phone: data?.zalo_phone ?? "",

    zalo_url: data?.zalo_url ?? "",

    amenity_ids: data?.amenity_ids ?? [],

    room_media:
        data?.room_media

            ?.slice()

            .sort((a, b) => a.sort_order - b.sort_order)

            .map((item) => ({
                id: item.id,

                url: item.url ?? "",

                thumb_url: item.thumb_url ?? "",

                sort_order: item.sort_order ?? 0,

                is_cover: Boolean(item.is_cover),

                file: undefined,

                preview_url: "",
            })) ?? [],
});

// ==========================================

// COMPONENT

// ==========================================

export default function RoomModal({
    open,

    onClose,

    categories,

    provinces,

    wards,

    amenities,

    initialData,

    refetch,
}: RoomModalProps) {
    const notification = useNotificationStore();
    const [form, setForm] = useState<RoomFormData>(initialForm);
    const mediaRef = useRef<RoomMediaForm[]>([]);
    const [formError, setFormError] = useState("");

    // Đánh dấu người dùng đã chỉnh slug thủ công

    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const isEdit = form.id !== null;
    const { mutate, isPending } = useMutationRequest<unknown, FormData>({
        key: ["rooms-update"],
        url: isEdit ? `rooms/${form.id}` : "rooms",
        method: isEdit ? "patch" : "post",
        options: {
            onSuccess: async () => {
                notification.updateState({
                    message: isEdit
                        ? "Chỉnh sửa phòng thành công"
                        : "Thêm phòng thành công",

                    type: "success",

                    open: true,
                });
                await refetch();
                onClose();
            },

            onError: () => {
                notification.updateState({
                    message: isEdit
                        ? "Chỉnh sửa phòng thất bại"
                        : "Thêm phòng thất bại",

                    type: "error",
                    open: true,
                });
            },
        },
    });

    // ==========================================

    // EFFECTS

    // ==========================================

    useEffect(() => {
        if (!open) {
            // Giải phóng preview của ảnh local khi đóng modal.
            mediaRef.current.forEach((media) => {
                if (media.file && media.preview_url) {
                    URL.revokeObjectURL(media.preview_url);
                }
            });

            setForm(initialForm);
            return;
        }

        // Thu hồi Blob URL của các ảnh local từ lần mở form trước.
        mediaRef.current.forEach((media) => {
            if (media.file && media.preview_url) {
                URL.revokeObjectURL(media.preview_url);
            }
        });
        setForm(getInitialForm(initialData));
        setFormError("");
        setSlugManuallyEdited(false);
    }, [open, initialData]);

    // Theo dõi danh sách ảnh mới nhất để thu hồi URL preview khi unmount.

    useEffect(() => {
        mediaRef.current = form.room_media;
    }, [form.room_media]);

    useEffect(() => {
        return () => {
            mediaRef.current.forEach((media) => {
                if (media.file && media.preview_url) {
                    URL.revokeObjectURL(media.preview_url);
                }
            });
        };
    }, []);

    // ==========================================

    // FORM HANDLERS

    // ==========================================

    const handleChange = <K extends keyof RoomFormData>(
        key: K,

        value: RoomFormData[K],
    ) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));

        setFormError("");
    };

    // Tự động tạo slug khi nhập tiêu đề

    const handleTitleChange = (value: string) => {
        setForm((prev) => ({
            ...prev,
            title: value,
            ...(!slugManuallyEdited ? { slug: generateSlug(value) } : {}),
        }));

        setFormError("");
    };

    // Người dùng tự chỉnh slug

    const handleSlugChange = (value: string) => {
        setSlugManuallyEdited(true);
        handleChange("slug", generateSlug(value));
    };

    // Tỉnh thay đổi

    const handleProvinceChange = (value: string) => {
        const fullAddress = buildFullAddress(
            form.street_address,
            "",
            value,
            wards,
            provinces,
        );

        setForm((prev) => ({
            ...prev,
            province_id: value,
            ward_id: "",
            full_address: fullAddress,
        }));

        setFormError("");
    };

    // Phường thay đổi

    const handleWardChange = (value: string) => {
        setForm((prev) => ({
            ...prev,
            ward_id: value,
            full_address: buildFullAddress(
                prev.street_address,
                value,
                prev.province_id,
                wards,
                provinces,
            ),
        }));

        setFormError("");
    };

    // Đường phố thay đổi

    const handleStreetChange = (value: string) => {
        setForm((prev) => ({
            ...prev,
            street_address: value,
            full_address: buildFullAddress(
                value,
                prev.ward_id,
                prev.province_id,
                wards,
                provinces,
            ),
        }));

        setFormError("");
    };

    // ==========================================

    // AMENITIES

    // ==========================================

    const handleAmenityChange = (amenityId: number, checked: boolean) => {
        setForm((prev) => ({
            ...prev,
            amenity_ids: checked
                ? [...new Set([...prev.amenity_ids, amenityId])]
                : prev.amenity_ids.filter((id) => id !== amenityId),
        }));

        setFormError("");
    };

    // ==========================================

    // IMAGE HANDLERS

    // ==========================================

    // Chọn nhiều ảnh từ máy tính

    const handleSelectImages = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []) as File[];
        if (files.length === 0) return;

        for (const file of files) {
            const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());

            console.log("FILE BEFORE UPLOAD:", {
                name: file.name,
                type: file.type,
                size: file.size,
                header: Array.from(bytes)
                    .map((byte) => byte.toString(16).padStart(2, "0"))
                    .join(""),
            });
        }

        if (form.room_media.length + files.length > 10) {
            setFormError("Mỗi phòng chỉ được tải tối đa 10 ảnh.");
            e.target.value = "";
            return;
        }
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        const invalidFiles = files.filter(
            (file) => !allowedTypes.includes(file.type),
        );

        if (invalidFiles.length > 0) {
            setFormError("Chỉ hỗ trợ hình ảnh JPG, PNG và WEBP.");
            e.target.value = "";
            return;
        }

        const oversizedFiles = files.filter(
            (file) => file.size > 5 * 1024 * 1024,
        );

        if (oversizedFiles.length > 0) {
            setFormError("Mỗi hình ảnh không được vượt quá 5MB.");
            e.target.value = "";

            return;
        }

        setForm((prev) => {
            const newMedia: RoomMediaForm[] = files.map((file, index) => ({
                url: "",
                thumb_url: "",
                sort_order: prev.room_media.length + index,
                is_cover: prev.room_media.length === 0 && index === 0,
                file,
                preview_url: URL.createObjectURL(file),
            }));

            return {
                ...prev,
                room_media: [...prev.room_media, ...newMedia],
            };
        });

        setFormError("");

        // Cho phép chọn lại cùng một file

        e.target.value = "";
    };

    // Xóa ảnh

    const handleRemoveMedia = (index: number) => {
        const removedMedia = form.room_media[index];

        if (removedMedia?.file && removedMedia.preview_url) {
            URL.revokeObjectURL(removedMedia.preview_url);
        }

        setForm((prev) => {
            const media = prev.room_media.filter((_, i) => i !== index);
            if (media.length > 0 && !media.some((item) => item.is_cover)) {
                media[0].is_cover = true;
            }

            return {
                ...prev,
                room_media: media.map((item, i) => ({
                    ...item,
                    sort_order: i,
                })),
            };
        });

        setFormError("");
    };

    // Chọn ảnh bìa

    const handleSetCover = (index: number) => {
        setForm((prev) => ({
            ...prev,

            room_media: prev.room_media.map((item, i) => ({
                ...item,
                is_cover: i === index,
            })),
        }));
    };

    // Di chuyển ảnh

    const handleMoveMedia = (index: number, direction: "up" | "down") => {
        setForm((prev) => {
            const media = [...prev.room_media];
            const targetIndex = direction === "up" ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= media.length) {
                return prev;
            }

            [media[index], media[targetIndex]] = [
                media[targetIndex],
                media[index],
            ];

            return {
                ...prev,
                room_media: media.map((item, i) => ({
                    ...item,

                    sort_order: i,
                })),
            };
        });
    };

    // ==========================================

    // VALIDATION

    // ==========================================

    const validateForm = (): boolean => {
        if (!form.category_id) {
            setFormError("Vui lòng chọn danh mục phòng.");

            return false;
        }

        if (
            !form.title.trim() ||
            !form.slug.trim() ||
            !form.description.trim()
        ) {
            setFormError("Vui lòng nhập đầy đủ thông tin cơ bản.");

            return false;
        }

        if (!form.province_id || !form.ward_id) {
            setFormError("Vui lòng chọn tỉnh / thành phố và phường xã.");

            return false;
        }

        const categoryId = Number(form.category_id);
        const provinceId = Number(form.province_id);
        const wardId = Number(form.ward_id);

        if (
            !Number.isSafeInteger(categoryId) ||
            categoryId <= 0 ||
            !Number.isSafeInteger(provinceId) ||
            provinceId <= 0 ||
            !Number.isSafeInteger(wardId) ||
            wardId <= 0
        ) {
            setFormError("Thông tin danh mục hoặc địa chỉ không hợp lệ.");

            return false;
        }

        if (
            !/^\d+$/.test(form.price_monthly) ||
            BigInt(form.price_monthly) <= 0n
        ) {
            setFormError("Giá thuê phải là số nguyên dương.");

            return false;
        }

        if (
            form.deposit &&
            (!/^\d+$/.test(form.deposit) || BigInt(form.deposit) < 0n)
        ) {
            setFormError("Tiền đặt cọc không hợp lệ.");

            return false;
        }

        const area = Number(form.area_m2);

        if (
            !Number.isFinite(area) ||
            area <= 0 ||
            area >= 100000 ||
            !/^\d+(\.\d{1,2})?$/.test(form.area_m2)
        ) {
            setFormError("Diện tích không hợp lệ (tối đa 2 chữ số thập phân).");

            return false;
        }

        const optionalFields = [
            {
                value: form.electricity_price,
                label: "Giá điện",
                max: 4294967295,
            },
            {
                value: form.water_price,
                label: "Giá nước",
                max: 4294967295,
            },
            {
                value: form.max_people,
                label: "Số người tối đa",
                max: 65535,
            },
        ];

        for (const field of optionalFields) {
            if (!field.value.trim()) continue;
            const number = Number(field.value);

            if (
                !Number.isSafeInteger(number) ||
                number < 0 ||
                number > field.max ||
                (field.label === "Số người tối đa" && number === 0)
            ) {
                setFormError(`${field.label} không hợp lệ.`);

                return false;
            }
        }

        if (form.floor_no.trim()) {
            const floor = Number(form.floor_no);
            if (!Number.isInteger(floor) || floor < -32768 || floor > 32767) {
                setFormError("Số tầng không hợp lệ.");

                return false;
            }
        }

        const latitude = toOptionalNumber(form.latitude);
        const longitude = toOptionalNumber(form.longitude);

        if (
            form.latitude.trim() &&
            (latitude === null || latitude < -90 || latitude > 90)
        ) {
            setFormError("Vĩ độ phải nằm trong khoảng -90 đến 90.");

            return false;
        }

        if (
            form.longitude.trim() &&
            (longitude === null || longitude < -180 || longitude > 180)
        ) {
            setFormError("Kinh độ phải nằm trong khoảng -180 đến 180.");

            return false;
        }

        if (!form.street_address.trim() || !form.full_address.trim()) {
            setFormError("Vui lòng nhập đầy đủ địa chỉ phòng.");

            return false;
        }

        if (
            !form.contact_name.trim() ||
            !/^\d{10}$/.test(form.contact_phone.trim())
        ) {
            setFormError("Vui lòng kiểm tra tên và số điện thoại liên hệ.");

            return false;
        }

        if (
            form.zalo_phone.trim() &&
            !/^\d{10}$/.test(form.zalo_phone.trim())
        ) {
            setFormError("Số điện thoại Zalo không hợp lệ.");

            return false;
        }

        if (form.zalo_url.length > 100) {
            setFormError("Đường dẫn Zalo không được vượt quá 100 ký tự.");

            return false;
        }

        if (
            form.room_media.length > 0 &&
            form.room_media.filter((item) => item.is_cover).length !== 1
        ) {
            setFormError("Vui lòng chọn đúng một ảnh bìa.");

            return false;
        }

        return true;
    };

    // ==========================================

    // SUBMIT

    // ==========================================

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isPending) return;

        if (isEdit && !form.id) {
            setFormError("ID phòng không hợp lệ.");

            return;
        }

        if (!validateForm()) return;

        try {
            setFormError("");

            // Tạo FormData
            const formData = new FormData();
            const payload = {
                category_id: Number(form.category_id),
                title: form.title.trim(),
                slug: form.slug.trim(),
                description: form.description.trim(),
                price_monthly: form.price_monthly,
                deposit: form.deposit.trim() || null,
                electricity_price: toOptionalNumber(form.electricity_price),
                water_price: toOptionalNumber(form.water_price),
                area_m2: Number(form.area_m2),
                max_people: toOptionalNumber(form.max_people),
                floor_no: toOptionalNumber(form.floor_no),
                available_from: form.available_from || null,
                province_id: Number(form.province_id),
                ward_id: Number(form.ward_id),
                street_address: form.street_address.trim(),
                full_address: form.full_address.trim(),
                latitude: toOptionalNumber(form.latitude),
                longitude: toOptionalNumber(form.longitude),
                contact_name: form.contact_name.trim(),
                contact_phone: form.contact_phone.trim(),
                zalo_phone: form.zalo_phone.trim() || null,
                zalo_url: form.zalo_url.trim() || null,
            };

            // 1. Các trường thông thường
            Object.entries(payload).forEach(([key, value]) => {
                if (value === null || value === undefined) return;

                formData.append(key, String(value));
            });

            // 2. Các trường mảng: gửi JSON string
            formData.append(
                "amenity_ids",
                JSON.stringify(form.amenity_ids.map(Number)),
            );

            // 3. Giữ lại ảnh cũ
            if (isEdit) {
                const keepMediaIds = form.room_media
                    .filter(
                        (media) =>
                            !media.file &&
                            media.id !== undefined &&
                            media.id !== null,
                    )
                    .map((media) => String(media.id));

                formData.append("keep_media_ids", JSON.stringify(keepMediaIds));
            }

            // 4. Upload ảnh mới
            form.room_media.forEach((media) => {
                if (media.file instanceof File) {
                    formData.append("files", media.file);
                }
            });
            const files = formData.getAll("files");

            for (const item of files) {
                if (item instanceof File) {
                    const getFileHash = async (file: File) => {
                        const buffer = await file.arrayBuffer();
                        const hash = await crypto.subtle.digest(
                            "SHA-256",
                            buffer,
                        );

                        return Array.from(new Uint8Array(hash))
                            .map((b) => b.toString(16).padStart(2, "0"))
                            .join("");
                    };
                }
            }
            // 5. Gửi request
            console.log("FORM DATA:", formData.getAll("files"));
            mutate(formData);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Không thể chuẩn bị dữ liệu phòng.";

            setFormError(message);
        }
    };

    // FOOTER

    // ==========================================

    const footer = (
        <div className="flex justify-end gap-2">
            <button
                type="button"

                onClick={onClose}

                disabled={isPending}

                className="flex h-10 items-center gap-2 rounded-lg border border-neutral-200 px-4 text-sm text-neutral-600 transition hover:bg-neutral-50 disabled:opacity-50"
            >
                <X size={16} />
                Hủy
            </button>

            <button
                type="submit"

                form="room-form"

                disabled={isPending}

                className="flex h-10 items-center gap-2 rounded-lg bg-[#dc3b2f] px-5 text-sm font-medium text-white transition hover:bg-[#c93227] disabled:opacity-50"
            >
                <Save size={16} />

                {isPending
                    ? "Đang xử lý..."
                    : isEdit
                      ? "Lưu thay đổi"
                      : "Thêm phòng"}
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

            title={isEdit ? "Chỉnh sửa phòng" : "Thêm phòng cho thuê"}

            size="2xl"

            footer={footer}
        >
            <form id="room-form" onSubmit={handleSubmit} className="space-y-6">
                {/* 01. THÔNG TIN CƠ BẢN */}

                <section className="space-y-2">
                    <div className="border-b border-neutral-100 pb-3">
                        <h3 className="text-sm font-semibold text-neutral-800">
                            Thông tin cơ bản
                        </h3>

                        <p className="mt-1 text-xs text-neutral-400">
                            Thông tin giới thiệu phòng cho thuê
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-neutral-700">
                                Tiêu đề phòng
                                <span className="ml-1 text-red-500">*</span>
                            </label>

                            <TextField
                                value={form.title}

                                required

                                maxLength={255}

                                onChange={handleTitleChange}
                            />
                        </div>

                        <SelectField
                            label="Danh mục phòng"

                            value={form.category_id}

                            options={categories}

                            placeholder="Chọn danh mục"

                            onChange={(value) =>
                                handleChange("category_id", value)
                            }
                        />

                        <div>
                            <div className="mb-0.5 flex h-[21px] items-center justify-between">
                                <label className="text-sm font-medium text-neutral-700">
                                    Slug
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <button
                                    type="button"

                                    onClick={() => {
                                        setSlugManuallyEdited(false);

                                        handleChange(
                                            "slug",

                                            generateSlug(form.title),
                                        );
                                    }}

                                    className="text-xs font-medium text-[#dc3b2f] hover:underline"
                                >
                                    Tạo tự động
                                </button>
                            </div>

                            <TextField
                                value={form.slug}

                                required

                                maxLength={255}

                                onChange={handleSlugChange}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                Mô tả phòng
                                <span className="ml-1 text-red-500">*</span>
                            </label>

                            <textarea
                                value={form.description}

                                onChange={(e) =>
                                    handleChange("description", e.target.value)
                                }

                                rows={5}

                                placeholder="Mô tả chi tiết về phòng..."

                                className="w-full resize-y rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#dc3b2f] focus:ring-2 focus:ring-[#dc3b2f]/10"
                            />
                        </div>
                    </div>
                </section>

                {/* 02. GIÁ THUÊ */}

                <section className="space-y-2">
                    <div className="border-b border-neutral-100 pb-3">
                        <h3 className="text-sm font-semibold text-neutral-800">
                            Giá thuê và diện tích
                        </h3>

                        <p className="mt-1 text-xs text-neutral-400">
                            Thông tin chi phí và sức chứa
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextField
                            label="Giá thuê / tháng (VNĐ)"

                            type="number"

                            min={1}

                            value={form.price_monthly}

                            required

                            onChange={(value) =>
                                handleChange("price_monthly", value)
                            }
                        />

                        <TextField
                            label="Tiền đặt cọc (VNĐ)"

                            type="number"

                            min={0}

                            value={form.deposit}

                            onChange={(value) => handleChange("deposit", value)}
                        />

                        <TextField
                            label="Diện tích (m²)"

                            type="number"

                            step="0.01"

                            min={0.01}

                            value={form.area_m2}

                            required

                            onChange={(value) => handleChange("area_m2", value)}
                        />

                        <TextField
                            label="Số người tối đa"

                            type="number"

                            min={1}

                            value={form.max_people}

                            onChange={(value) =>
                                handleChange("max_people", value)
                            }
                        />

                        <TextField
                            label="Giá điện (VNĐ/kWh)"

                            type="number"

                            min={0}

                            value={form.electricity_price}

                            onChange={(value) =>
                                handleChange("electricity_price", value)
                            }
                        />

                        <TextField
                            label="Giá nước (VNĐ/m³)"

                            type="number"

                            min={0}

                            value={form.water_price}

                            onChange={(value) =>
                                handleChange("water_price", value)
                            }
                        />

                        <TextField
                            label="Số tầng"

                            type="number"

                            value={form.floor_no}

                            onChange={(value) =>
                                handleChange("floor_no", value)
                            }
                        />

                        <div>
                            <TextField
                                label="Ngày có thể nhận phòng"

                                type="date"

                                value={form.available_from}

                                onChange={(value) =>
                                    handleChange("available_from", value)
                                }
                            />
                        </div>
                    </div>
                </section>

                {/* 03. ĐỊA CHỈ */}

                <section className="space-y-2">
                    <div className="border-b border-neutral-100 pb-3">
                        <h3 className="text-sm font-semibold text-neutral-800">
                            Địa chỉ và vị trí
                        </h3>

                        <p className="mt-1 text-xs text-neutral-400">
                            Tự động ghép địa chỉ đầy đủ từ các trường
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <SelectField
                            label="Tỉnh / Thành phố"

                            value={form.province_id}

                            options={provinces}

                            placeholder="Chọn tỉnh / thành phố"

                            onChange={handleProvinceChange}
                        />

                        <SelectField
                            label="Phường / Xã"

                            value={form.ward_id}

                            options={wards}

                            placeholder={
                                form.province_id
                                    ? "Chọn phường / xã"
                                    : "Vui lòng chọn tỉnh trước"
                            }

                            onChange={handleWardChange}
                        />

                        <div className="sm:col-span-2">
                            <TextField
                                label="Địa chỉ đường phố"

                                value={form.street_address}

                                required

                                maxLength={255}

                                onChange={handleStreetChange}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                Địa chỉ đầy đủ
                            </label>

                            <textarea
                                value={form.full_address}

                                readOnly

                                rows={2}

                                className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-600 outline-none"
                            />

                            <p className="mt-1 text-xs text-neutral-400">
                                Được tự động tạo từ địa chỉ đường phố, phường/xã
                                và tỉnh/thành phố.
                            </p>
                        </div>

                        <TextField
                            label="Vĩ độ (Latitude)"

                            type="number"

                            step="any"

                            min={-90}

                            max={90}

                            value={form.latitude}

                            onChange={(value) =>
                                handleChange("latitude", value)
                            }
                        />

                        <TextField
                            label="Kinh độ (Longitude)"

                            type="number"

                            step="any"

                            min={-180}

                            max={180}

                            value={form.longitude}

                            onChange={(value) =>
                                handleChange("longitude", value)
                            }
                        />
                    </div>
                </section>

                {/* 04. TIỆN ÍCH */}

                <section>
                    <div className="border-b border-neutral-100 pb-3">
                        <h3 className="text-sm font-semibold text-neutral-800">
                            Tiện ích phòng
                        </h3>

                        <p className="mt-1 text-xs text-neutral-400">
                            Có thể chọn nhiều tiện ích
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {amenities.map((amenity) => {
                            const id = Number(amenity.value);

                            const checked = form.amenity_ids.includes(id);

                            return (
                                <label
                                    key={amenity.value}

                                    className={cn(
                                        "flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition",

                                        checked
                                            ? "border-[#dc3b2f] bg-[#fff7f5] text-[#dc3b2f]"
                                            : "border-neutral-200 text-neutral-600 hover:bg-neutral-50",
                                    )}
                                >
                                    <input
                                        type="checkbox"

                                        checked={checked}

                                        onChange={(e) =>
                                            handleAmenityChange(
                                                id,

                                                e.target.checked,
                                            )
                                        }

                                        className="size-4 accent-[#dc3b2f]"
                                    />

                                    {amenity.label}
                                </label>
                            );
                        })}
                    </div>
                </section>

                {/* 05. HÌNH ẢNH */}

                <section className="space-y-2">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-800">
                                Hình ảnh phòng
                            </h3>

                            <p className="mt-1 text-xs text-neutral-400">
                                Upload nhiều ảnh, chọn ảnh bìa và sắp xếp
                            </p>
                        </div>

                        <label className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-neutral-200 px-3 text-xs font-medium text-neutral-600 transition hover:bg-neutral-50">
                            <Upload size={15} />
                            Upload ảnh
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                className="hidden"
                                onChange={handleSelectImages}
                            />
                        </label>
                    </div>

                    {form.room_media.length === 0 ? (
                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 py-10 text-neutral-400 transition hover:border-[#dc3b2f] hover:bg-[#fff7f5]">
                            <ImagePlus size={36} />

                            <p className="mt-2 text-sm font-medium">
                                Chưa có hình ảnh
                            </p>

                            <p className="mt-1 text-xs">
                                Nhấn để chọn nhiều hình ảnh từ máy tính
                            </p>

                            <input
                                type="file"

                                accept="image/jpeg,image/png,image/webp"

                                multiple

                                className="hidden"

                                onChange={handleSelectImages}
                            />
                        </label>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {form.room_media.map((media, index) => (
                                <div
                                    key={
                                        media.preview_url ??
                                        `${media.url}-${index}`
                                    }

                                    className={cn(
                                        "group relative overflow-hidden rounded-xl border transition",

                                        media.is_cover
                                            ? "border-[#dc3b2f] ring-1 ring-[#dc3b2f]"
                                            : "border-neutral-200",
                                    )}
                                >
                                    {/* IMAGE PREVIEW */}

                                    <div className="aspect-[4/3] bg-neutral-100">
                                        <img
                                            src={
                                                media.file && media.preview_url
                                                    ? media.preview_url
                                                    : getImageUrl(
                                                          media.thumb_url ||
                                                              media.url,
                                                      )
                                            }

                                            alt={`Ảnh phòng ${index + 1}`}

                                            className="size-full object-cover"
                                        />
                                    </div>

                                    {/* COVER BADGE */}

                                    {media.is_cover && (
                                        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-[#dc3b2f] px-2 py-1 text-[10px] font-medium text-white">
                                            <Star size={11} />
                                            Ảnh bìa
                                        </div>
                                    )}

                                    {/* UPLOADING BADGE */}

                                    {media.file && (
                                        <div className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-1 text-[10px] text-white">
                                            Chưa upload
                                        </div>
                                    )}

                                    {/* CONTROLS */}

                                    <div className="space-y-2 p-2">
                                        <p className="truncate text-xs font-medium text-neutral-600">
                                            Hình ảnh {index + 1}
                                        </p>

                                        <div className="flex items-center justify-between gap-1">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"

                                                    disabled={index === 0}

                                                    onClick={() =>
                                                        handleMoveMedia(
                                                            index,

                                                            "up",
                                                        )
                                                    }

                                                    title="Di chuyển lên"

                                                    className="rounded-md border border-neutral-200 p-1.5 text-neutral-500 hover:bg-neutral-50 disabled:opacity-30"
                                                >
                                                    <ArrowUp size={14} />
                                                </button>

                                                <button
                                                    type="button"

                                                    disabled={
                                                        index ===
                                                        form.room_media.length -
                                                            1
                                                    }

                                                    onClick={() =>
                                                        handleMoveMedia(
                                                            index,

                                                            "down",
                                                        )
                                                    }

                                                    title="Di chuyển xuống"

                                                    className="rounded-md border border-neutral-200 p-1.5 text-neutral-500 hover:bg-neutral-50 disabled:opacity-30"
                                                >
                                                    <ArrowDown size={14} />
                                                </button>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleSetCover(index)
                                                }
                                                title="Chọn làm ảnh bìa"
                                                className={cn(
                                                    "rounded-md border p-1.5 transition",
                                                    media.is_cover
                                                        ? "border-[#dc3b2f] bg-[#fff7f5] text-[#dc3b2f]"
                                                        : "border-neutral-200 text-neutral-400 hover:bg-neutral-50",
                                                )}
                                            >
                                                <Star size={14} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveMedia(index)
                                                }
                                                title="Xóa ảnh"
                                                className="rounded-md border border-neutral-200 p-1.5 text-neutral-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <p className="text-xs text-neutral-400">
                        Hỗ trợ JPG, PNG, WEBP. Tối đa 5MB mỗi ảnh. Ảnh đầu tiên
                        sẽ mặc định là ảnh bìa nếu chưa chọn.
                    </p>
                </section>

                {/* 06. LIÊN HỆ */}

                <section className="space-y-2">
                    <div className="border-b border-neutral-100 pb-3">
                        <h3 className="text-sm font-semibold text-neutral-800">
                            Thông tin liên hệ
                        </h3>
                        <p className="mt-1 text-xs text-neutral-400">
                            Thông tin người cho thuê
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextField
                            label="Tên người liên hệ"
                            value={form.contact_name}
                            required
                            maxLength={150}
                            onChange={(value) =>
                                handleChange("contact_name", value)
                            }
                        />

                        <TextField
                            label="Số điện thoại"
                            value={form.contact_phone}
                            required
                            maxLength={10}
                            onChange={(value) =>
                                handleChange("contact_phone", value)
                            }
                        />

                        <TextField
                            label="Số điện thoại Zalo"
                            value={form.zalo_phone}
                            maxLength={10}
                            onChange={(value) =>
                                handleChange("zalo_phone", value)
                            }
                        />

                        <TextField
                            label="Đường dẫn Zalo"
                            value={form.zalo_url}
                            maxLength={100}
                            onChange={(value) =>
                                handleChange("zalo_url", value)
                            }
                        />
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
