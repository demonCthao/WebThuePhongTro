import Button from "app/components/common/Button";
import {
    DynamicTable,
    type TableAction,
} from "app/components/common/DynamicTable";
import TextField from "app/components/common/TextField";
import DeleteConfirmModal from "app/components/layout/admin/DeleteConfirmModal";
import SearchFilter from "app/components/layout/admin/SearchFilter";
import type { Option } from "app/data/mock";
import { useFetch } from "app/hooks/useFetch";
import { useMutationRequest } from "app/hooks/useMutation";
import type { DataList } from "app/models/home/response.model";
import { useNotificationStore } from "app/stores/notification.store";
import type { Provinces, Wards } from "app/types/prisma-models";
import { useMemo, useState } from "react";
import type { WardFormData } from "./WardFormData";
import WardModal from "./WardFormData";
import { wardsColumns } from "./WardTable";

export default function WardsList() {
    const notification = useNotificationStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [selectedWard, setSelectedWard] = useState<WardFormData | null>(null);
    const [filters, setFilters] = useState({
        wardName: "",
        wardCode: "",
    });

    const { data, isLoading, refetch } = useFetch<DataList<Wards>>({
        url: `/wards?name=${filters.wardName}&code=${filters.wardCode}`,
        key: ["wards"],
    });

    const { data: dataProvinces } = useFetch<DataList<Provinces>>({
        url: `/provinces/all`,
        key: ["provinces/all"],
    });
    const { mutate, isPending } = useMutationRequest({
        key: ["wards-delete"],
        url: `wards/${selectedWard?.id}`,
        method: "delete",
        options: {
            onSuccess: async () => {
                notification.updateState({
                    message: "Xóa phường xã thành công",
                    type: "success",
                    open: true,
                });

                await refetch();
                onCloseForm();
            },

            onError: () => {
                notification.updateState({
                    message: "Xóa phường xã thất bại",
                    type: "error",
                    open: true,
                });
            },
        },
    });

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const provinceOptions: Option[] = useMemo(
        () =>
            (dataProvinces?.list ?? []).map((province) => ({
                value: String(province.id),
                label: `${province.full_name} (${province.code})`,
            })),
        [dataProvinces],
    );

    const handleAdd = () => {
        setIsModalOpen(true);
    };

    const handleChoose = (ward: Wards, type: TableAction) => {
        setSelectedWard({
            province_id: String(ward.province_id),
            code: ward.code,
            name: ward.name,
            full_name: ward.full_name,
            ward_type: ward.ward_type,
            slug: ward.slug,
            name_search: ward.name_search,
            center_lat: ward.center_lat?.toString() ?? "",
            center_lng: ward.center_lng?.toString() ?? "",
            is_active: ward.is_active,
            merged_into: ward.merged_into?.toString() ?? "",
            id: ward?.id,
        });

        if (type === "delete") {
            setIsModalDeleteOpen(true);
            return;
        }

        setIsModalOpen(true);
    };

    const onCloseForm = () => {
        setIsModalOpen(false);
        setSelectedWard(null);
        setIsModalDeleteOpen(false);
    };

    return (
        <div className="flex h-full min-h-0 flex-col gap-3">
            {/* SEARCH FILTER */}
            <div className="shrink-0">
                <SearchFilter
                    loading={isLoading}
                    onReset={() => {
                        setFilters({
                            wardName: "",
                            wardCode: "",
                        });

                        refetch();
                    }}
                    onSearch={() => refetch()}
                >
                    <TextField
                        label="Tên phường xã"
                        value={filters.wardName}
                        onChange={(value) =>
                            handleFilterChange("wardName", value)
                        }
                    />

                    <TextField
                        label="Mã phường xã"
                        value={filters.wardCode}
                        onChange={(value) =>
                            handleFilterChange("wardCode", value)
                        }
                    />
                </SearchFilter>
            </div>

            {/* ADD BUTTON */}
            <div className="flex shrink-0 justify-end">
                <Button
                    type="button"
                    onClick={handleAdd}
                    className="w-auto rounded-lg px-4 text-sm font-medium"
                >
                    + Thêm phường xã
                </Button>
            </div>

            {/* TABLE */}
            <div className="min-h-0 min-w-0 flex-1">
                <DynamicTable
                    title="Quản lý phường xã"
                    description="Quản lý danh sách phường xã trên hệ thống"
                    data={data?.list ?? []}
                    columns={wardsColumns}
                    onChoose={handleChoose}
                    useCanMutation={true}
                    pageSize={10}
                    totalItems={data?.total ?? 0}
                    isLoading={isLoading}
                    getRowId={(ward) => ward.id}
                />
            </div>

            {/* MODAL */}
            <WardModal
                open={isModalOpen}
                onClose={onCloseForm}
                initialData={selectedWard}
                provinces={provinceOptions}
                refetch={refetch}
            />

            <DeleteConfirmModal
                open={isModalDeleteOpen}
                onClose={onCloseForm}
                onConfirm={() => mutate()}
                description="Bạn có chắc chắn muốn xóa xã/ phường này không?"
                itemName={selectedWard?.name}
                loading={isPending}
            />
        </div>
    );
}
