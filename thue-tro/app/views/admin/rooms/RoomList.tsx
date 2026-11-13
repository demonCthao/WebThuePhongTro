import { DynamicTable } from "app/components/common/DynamicTable";
import Loading from "app/components/common/Loading";
import { useFetch } from "app/hooks/useFetch";
import type { DataList } from "app/models/home/response.model";
import type { Rooms } from "app/types/prisma-models";
import { roomsColumns } from "./RoomTable";

export default function RoomList() {
    const { data, isLoading, refetch } = useFetch<DataList<Rooms>>({
        url: `/rooms`,
        key: ["rooms/all"],
    });

    const handleChoose = (room: Rooms) => {

    }

    return (
        <div>
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
