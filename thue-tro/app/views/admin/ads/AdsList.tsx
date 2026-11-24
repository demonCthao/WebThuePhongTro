import { useState } from "react";

import Button from "app/components/common/Button";
import {
    DynamicTable,
    type TableAction,
} from "app/components/common/DynamicTable";
import TextField from "app/components/common/TextField";
import SearchFilter from "app/components/layout/admin/SearchFilter";
import DeleteConfirmModal from "app/components/layout/admin/DeleteConfirmModal";

import { useFetch } from "app/hooks/useFetch";
import { useMutationRequest } from "app/hooks/useMutation";

import type { DataList } from "app/models/home/response.model";
import type { Ads } from "app/types/prisma-models";

import { useNotificationStore } from "app/stores/notification.store";

import { adsColumns } from "./AdsTable";
import AdsModal from "./AdsFormModal";

// ==========================================
// COMPONENT
// ==========================================

export default function AdsList() {
    const notification = useNotificationStore();

    // ==========================================
    // STATES
    // ==========================================

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

    const [adsSelected, setAdsSelected] = useState<Ads | null>(null);

    const [filters, setFilters] = useState({
        title: "",
        pageIndex: 1,
        pageSize: 10,
    });

    // ==========================================
    // FETCH DATA
    // ==========================================

    const { data, isLoading, refetch } = useFetch<DataList<Ads>>({
        url: `/ads/list?pageIndex=${filters.pageIndex}&pageSize=${filters.pageSize}&title=${encodeURIComponent(filters.title)}`,
        key: [
            "ads",
            filters.pageIndex.toString(),
            filters.pageSize.toString(),
            filters.title,
        ],
    });

    // ==========================================
    // DELETE MUTATION
    // ==========================================

    const { mutate, isPending } = useMutationRequest({
        key: ["ads-delete"],
        url: `ads/${adsSelected?.id}`,
        method: "delete",
        options: {
            onSuccess: async () => {
                notification.updateState({
                    message: "Xóa quảng cáo thành công",
                    type: "success",
                    open: true,
                });

                await refetch();
                onCloseForm();
            },

            onError: () => {
                notification.updateState({
                    message: "Xóa quảng cáo thất bại",
                    type: "error",
                    open: true,
                });
            },
        },
    });

    // ==========================================
    // FILTER HANDLERS
    // ==========================================

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            pageIndex: 1,
        }));
    };

    const handleSearch = () => {
        refetch();
    };

    const handleReset = () => {
        setFilters({
            title: "",
            pageIndex: 1,
            pageSize: 10,
        });

        refetch();
    };

    // ==========================================
    // MODAL HANDLERS
    // ==========================================

    const handleChoose = (ads: Ads, type: TableAction) => {
        setAdsSelected(ads);

        if (type === "delete") {
            setIsModalDeleteOpen(true);
            return;
        }

        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setAdsSelected(null);
        setIsModalOpen(true);
    };

    const onCloseForm = () => {
        setIsModalOpen(false);
        setIsModalDeleteOpen(false);
        setAdsSelected(null);
    };

    // ==========================================
    // DELETE HANDLER
    // ==========================================

    const handleDelete = () => {
        if (!adsSelected?.id || isPending) return;

        mutate();
    };

    // ==========================================
    // PAGINATION
    // ==========================================

    const onChangePage = (page: number) => {
        setFilters((prev) => ({
            ...prev,
            pageIndex: page,
        }));
    };

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <div className="flex h-full min-h-0 flex-col gap-3">
            {/* SEARCH FILTER */}

            <div className="shrink-0">
                <SearchFilter
                    loading={isLoading}
                    onReset={handleReset}
                    onSearch={handleSearch}
                >
                    <TextField
                        label="Tên quảng cáo"
                        value={filters.title}
                        onChange={(value) => handleFilterChange("title", value)}
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
                    + Thêm quảng cáo
                </Button>
            </div>

            {/* TABLE */}

            <div className="min-h-0 min-w-0 flex-1">
                <DynamicTable
                    title="Quản lý quảng cáo"
                    description="Quản lý danh sách quảng cáo trên hệ thống"
                    data={data?.list ?? []}
                    columns={adsColumns}
                    onChoose={handleChoose}
                    useCanMutation={true}
                    pageSize={filters.pageSize}
                    totalItems={data?.total ?? 0}
                    isLoading={isLoading}
                    getRowId={(ads) => ads.id}
                    onPageChange={onChangePage}
                    currentPage={filters.pageIndex}
                />
            </div>

            {/* ADD / EDIT MODAL */}

            <AdsModal
                open={isModalOpen}
                onClose={onCloseForm}
                initialData={adsSelected}
                loading={isLoading}
                refetch={refetch}
            />

            {/* DELETE MODAL */}

            <DeleteConfirmModal
                open={isModalDeleteOpen}
                onClose={onCloseForm}
                onConfirm={handleDelete}
                loading={isPending}
            />
        </div>
    );
}
