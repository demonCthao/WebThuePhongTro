import Button from "app/components/common/Button";
import {
    DynamicTable,
    type TableAction,
} from "app/components/common/DynamicTable";
import TextField from "app/components/common/TextField";
import SearchFilter from "app/components/layout/admin/SearchFilter";
import { useFetch } from "app/hooks/useFetch";
import type { DataList } from "app/models/home/response.model";
import type { Provinces } from "app/types/prisma-models";
import { useState } from "react";
import ProvinceModal from "./ProvinceFormModal";
import { provincesColumns } from "./ProvinceTable";
import DeleteConfirmModal from "app/components/layout/admin/DeleteConfirmModal";
import { useMutationRequest } from "app/hooks/useMutation";
import { useNotificationStore } from "app/stores/notification.store";

export default function ProvincesList() {
    const notification = useNotificationStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [provinceSelected, setProvinceSelected] = useState<Provinces | null>(
        null,
    );
    const [filters, setFilters] = useState({
        provinceName: "",
        provinceCode: "",
        pageIndex: 1,
        pageSize: 10,
    });
    const { data, isLoading, refetch } = useFetch<DataList<Provinces>>({
        url: `/provinces?name=${filters.provinceName}&code=${filters.provinceCode}&pageIndex=${filters.pageIndex}&pageSize=${filters.pageSize}`,
        key: ["provinces", filters.pageIndex.toString(), filters.pageSize.toString()],
    });
    const { mutate, isPending } = useMutationRequest({
        key: ["provinces-delete"],
        url: `provinces/${provinceSelected?.id}`,
        method: "delete",
        options: {
            onSuccess: async () => {
                notification.updateState({
                    message: "Xóa tỉnh thành công",
                    type: "success",
                    open: true,
                });

                await refetch();
                onCloseForm();
            },

            onError: () => {
                notification.updateState({
                    message: "Xóa tỉnh thất bại",
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

    const handleChoose = (province: Provinces, type: TableAction) => {
        setProvinceSelected(province);
        if (type === "delete") {
            setIsModalDeleteOpen(true);
            return;
        }

        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setIsModalOpen(true);
    };

    const onCloseForm = () => {
        setIsModalOpen(false);
        setProvinceSelected(null);
        setIsModalDeleteOpen(false);
    };

    const onChangePage = (page: number) => {
        setFilters({
            ...filters,
            pageIndex: page,
        });
    };

    return (
        <div className="flex h-full min-h-0 flex-col gap-3">
            {/* SEARCH FILTER */}
            <div className="shrink-0">
                <SearchFilter
                    loading={isLoading}
                    onReset={() => {
                        setFilters({
                            provinceName: "",
                            provinceCode: "",
                            pageIndex: 1,
                            pageSize: 10
                        });

                        refetch();
                    }}
                    onSearch={() => refetch()}
                >
                    <TextField
                        label="Tên tỉnh"
                        value={filters.provinceName}
                        onChange={(value) =>
                            handleFilterChange("provinceName", value)
                        }
                    />

                    <TextField
                        label="Mã tỉnh"
                        value={filters.provinceCode}
                        onChange={(value) =>
                            handleFilterChange("provinceCode", value)
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
                    + Thêm tỉnh
                </Button>
            </div>

            {/* TABLE */}
            <div className="flex-1 min-h-0 min-w-0">
                <DynamicTable
                    title="Quản lý tỉnh"
                    description="Quản lý danh sách tỉnh thành trên hệ thống"
                    data={data?.list ?? []}
                    columns={provincesColumns}
                    onChoose={handleChoose}
                    useCanMutation={true}
                    pageSize={filters.pageSize}
                    totalItems={data?.total ?? 0}
                    isLoading={isLoading}
                    getRowId={(province) => province.id}
                    onPageChange={onChangePage}
                    currentPage={filters.pageIndex}
                />
            </div>

            {/* MODAL */}
            <ProvinceModal
                open={isModalOpen}
                onClose={onCloseForm}
                initialData={provinceSelected}
                loading={isLoading}
                refetch={refetch}
            />

            <DeleteConfirmModal
                open={isModalDeleteOpen}
                onClose={onCloseForm}
                onConfirm={() => mutate()}
                description="Bạn có chắc chắn muốn xóa xã/ phường này không?"
                itemName={provinceSelected?.name}
                loading={isPending}
            />
        </div>
    );
}
