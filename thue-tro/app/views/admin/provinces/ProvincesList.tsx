import { DynamicTable } from "app/components/common/DynamicTable";
import Loading from "app/components/common/Loading";
import { useFetch } from "app/hooks/useFetch";
import type { DataList } from "app/models/home/response.model";
import type { Provinces } from "app/types/prisma-models";
import { provincesColumns } from "./ProvinceTable";

export default function ProvincesList() {
    const { data, isLoading, refetch } = useFetch<DataList<Provinces>>({
        url: `/provinces`,
        key: ["provinces"],
    });

    const handleChoose = (province: Provinces) => {

    }

    return (
        <div>
            {isLoading ? (
                <Loading />
            ) : (
                <DynamicTable
                    title="Quản lý tỉnh"
                    description="Quản lý danh sách phường xã trên hệ thống"
                    data={data?.list ?? []}
                    columns={provincesColumns}
                    onChoose={handleChoose}
                    useCanMutation={true}
                    pageSize={data?.total}
                    getRowId={(ward) => ward.id}
                />
            )}
        </div>
    );
}
