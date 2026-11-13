import { DynamicTable } from "app/components/common/DynamicTable";
import Loading from "app/components/common/Loading";
import { useFetch } from "app/hooks/useFetch";
import type { DataList } from "app/models/home/response.model";
import type { Wards } from "app/types/prisma-models";
import { wardsColumns } from "./WardTable";

export default function WardsList() {
    const { data, isLoading, refetch } = useFetch<DataList<Wards>>({
        url: `/wards`,
        key: ["wards"],
    });

    const handleChoose = (ward: Wards) => {};

    return (
        <div>
            {isLoading ? (
                <Loading />
            ) : (
                <DynamicTable
                    title="Quản lý phường xã"
                    description="Quản lý danh sách phường xã trên hệ thống"
                    data={data?.list ?? []}
                    columns={wardsColumns}
                    onChoose={handleChoose}
                    useCanMutation={true}
                    pageSize={data?.total}
                    getRowId={(ward) => ward.id}
                />
            )}
        </div>
    );
}
