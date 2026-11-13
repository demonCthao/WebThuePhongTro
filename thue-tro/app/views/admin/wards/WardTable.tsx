import type { DynamicColumn } from "app/components/common/DynamicTable";
import type { Wards } from "app/types/prisma-models";

export const wardsColumns: DynamicColumn<Wards>[] = [
    {
        key: "code",
        title: "Mã phường",
        width: "150px",
        render: (ward) => (
            <span className="font-medium text-neutral-700">{ward.code}</span>
        ),
    },
    {
        key: "name",
        title: "Tên phường",
        width: "180px",
        render: (ward) => (
            <span className="font-semibold text-neutral-800">{ward.name}</span>
        ),
    },
    {
        key: "full_name",
        title: "Tên đầy đủ",
        width: "220px",
    },
    {
        key: "province_id",
        title: "Province ID",
        align: "center",
        width: "120px",
    },
    {
        key: "ward_type",
        title: "Loại",
        align: "center",
        render: (ward) => (
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                {ward.ward_type === "ward" ? "Phường" : "Xã"}
            </span>
        ),
    },
    {
        key: "is_active",
        title: "Trạng thái",
        align: "center",
        render: (ward) => (
            <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    ward.is_active
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-500"
                }`}
            >
                {ward.is_active ? "Hoạt động" : "Ngừng hoạt động"}
            </span>
        ),
    },
    {
        key: "center_lat",
        title: "Tọa độ",
        align: "center",
        render: (ward) => (
            <span className="text-xs text-neutral-500">
                {ward.center_lat}, {ward.center_lng}
            </span>
        ),
    },
];
