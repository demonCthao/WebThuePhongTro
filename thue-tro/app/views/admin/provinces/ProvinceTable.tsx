import type { DynamicColumn } from "app/components/common/DynamicTable";
import type { Provinces } from "app/types/prisma-models";

export const provincesColumns: DynamicColumn<Provinces>[] = [
    {
        key: "code",
        title: "Mã tỉnh",
        width: "120px",
        align: "center",
        render: (province) => (
            <span className="font-medium text-neutral-700">
                {province.code}
            </span>
        ),
    },
    {
        key: "name",
        title: "Tên tỉnh",
        width: "180px",
        render: (province) => (
            <span className="font-semibold text-neutral-800">
                {province.name}
            </span>
        ),
    },
    {
        key: "full_name",
        title: "Tên đầy đủ",
        width: "200px",
        render: (province) => (
            <span className="text-neutral-600">{province.full_name}</span>
        ),
    },
    {
        key: "slug",
        title: "Slug",
        width: "160px",
        render: (province) => (
            <span className="text-xs text-neutral-500">{province.slug}</span>
        ),
    },
    {
        key: "sort_order",
        title: "Thứ tự",
        align: "center",
        width: "100px",
        render: (province) => (
            <span className="font-medium text-neutral-600">
                {province.sort_order}
            </span>
        ),
    },
    {
        key: "center_lat",
        title: "Tọa độ",
        align: "center",
        width: "180px",
        render: (province) => (
            <span className="text-xs text-neutral-500">
                {province.center_lat ?? "-"}, {province.center_lng ?? "-"}
            </span>
        ),
    },
    {
        key: "is_active",
        title: "Trạng thái",
        align: "center",
        width: "140px",
        render: (province) => (
            <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    province.is_active
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-500"
                }`}
            >
                {province.is_active ? "Hoạt động" : "Ngừng hoạt động"}
            </span>
        ),
    },
];
