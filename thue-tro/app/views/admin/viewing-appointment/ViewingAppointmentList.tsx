import SearchFilter from "app/components/layout/admin/SearchFilter";
import { useFetch } from "app/hooks/useFetch";
import type { DataList } from "app/models/home/response.model";
import type { ViewingAppointments } from "app/types/prisma-models";
import { useState } from "react";
import { viewingAppointmentsColumns } from "./ViewingAppointmentTable";
import {
    DynamicTable,
    type TableAction,
} from "app/components/common/DynamicTable";
import { useNotificationStore } from "app/stores/notification.store";
import ViewingAppointmentModal from "./ViewingAppointmentModal";

export default function ViewingAppointmentList() {
    const notification = useNotificationStore();
    const [filters, setFilters] = useState({
        pageIndex: 1,
        pageSize: 10,
    });
    const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] =
        useState<ViewingAppointments | null>(null);

    const { data, isLoading, refetch } = useFetch<
        DataList<ViewingAppointments>
    >({
        url: `/viewing-appointments?pageIndex=${filters.pageIndex}&pageSize=${filters.pageSize}`,
        key: [
            "viewing-appointments",
            filters.pageIndex.toString(),
            filters.pageSize.toString(),
        ],
    });

    const handleReset = () => {
        setFilters({
            pageIndex: 1,
            pageSize: 10,
        });

        refetch();
    };

    const handleSearch = () => {
        refetch();
    };

    const handleChoose = (
        appointment: ViewingAppointments,
        type: TableAction,
    ) => {
        if (type == "delete") {
            notification.updateState({
                message: "Không thể xóa lịch hẹn",
                type: "error",
                open: true,
            });
            return;
        }

        setIsViewingModalOpen(true);
        setSelectedAppointment(appointment);
    };

    const onChangePage = (page: number) => {
        setFilters((prev) => ({
            ...prev,
            pageIndex: page,
        }));
    };

    return (
        <div className="flex h-full min-h-0 flex-col gap-3">
            {/* TABLE */}
            <div className="min-h-0 min-w-0 flex-1">
                <DynamicTable
                    title="Quản lý quảng cáo"
                    description="Quản lý danh sách quảng cáo trên hệ thống"
                    data={data?.list ?? []}
                    columns={viewingAppointmentsColumns}
                    onChoose={handleChoose}
                    useCanMutation={true}
                    pageSize={filters.pageSize}
                    totalItems={data?.total ?? 0}
                    isLoading={isLoading}
                    getRowId={(appointment) => appointment.id}
                    onPageChange={onChangePage}
                    currentPage={filters.pageIndex}
                />
            </div>
            
            <ViewingAppointmentModal
                isOpen={isViewingModalOpen}
                onClose={() => {
                    setIsViewingModalOpen(false);
                    setSelectedAppointment(null);
                }}
                appointment={selectedAppointment}
            />
        </div>
    );
}
