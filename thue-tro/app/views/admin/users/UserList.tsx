import { DynamicTable } from "app/components/common/DynamicTable";
import Loading from "app/components/common/Loading";
import { useFetch } from "app/hooks/useFetch";
import type { DataList } from "app/models/home/response.model";
import type { Users } from "app/types/prisma-models";
import { usersColumns } from "./UserTable";

export default function UserList() {
    const { data, isLoading, refetch } = useFetch<DataList<Users>>({
        url: `/users`,
        key: ["wards"],
    });

    const handleChoose = (user: Users) => {};

    return (
        <div>
            {isLoading ? (
                <Loading />
            ) : (
                <DynamicTable
                    title="Quản lý người dùng"
                    description="Quản lý người dùng trên hệ thống"
                    data={data?.list ?? []}
                    columns={usersColumns}
                    onChoose={handleChoose}
                    useCanMutation={true}
                    pageSize={data?.total}
                    getRowId={(ward) => ward.id}
                />
            )}
        </div>
    );
}
