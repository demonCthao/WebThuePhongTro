import { DynamicTable } from "app/components/common/DynamicTable";
import Loading from "app/components/common/Loading";
import { useFetch } from "app/hooks/useFetch";
import type { DataList } from "app/models/home/response.model";
import type { Rooms } from "app/types/prisma-models";
import { roomsColumns } from "./RoomTable";
import Button from "app/components/common/Button";
import { useState } from "react";

export default function RoomList() {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
    const { data, isLoading, refetch } = useFetch<DataList<Rooms>>({
        url: `/rooms`,
        key: ["rooms/all"],
    });

    const handleChoose = (room: Rooms) => {};

    const handleAdd = () => {
        setIsOpenModal(true)
    }

    return (
        <div className="flex h-full min-h-0 flex-col gap-3">
            {/* ADD BUTTON */}
            <div className="flex shrink-0 justify-end">
                <Button
                    type="button"
                    onClick={handleAdd}
                    className="w-auto rounded-lg px-4 text-sm font-medium"
                >
                    + Thêm bài đăng phòng
                </Button>
            </div>
            {isLoading ? (
                <Loading />
            ) : (
                <DynamicTable
                    title="Quản lý bài đăng phòng"
                    description="Quản lý bài đăng phòng"
                    data={data?.list ?? []}
                    columns={roomsColumns}
                    onChoose={handleChoose}
                    useCanMutation={true}
                    pageSize={data?.total}
                    getRowId={(ward) => ward.id}
                />
            )}
        </div>
    );
}
