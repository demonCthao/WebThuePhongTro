import { DynamicTable } from "app/components/common/DynamicTable";
import Loading from "app/components/common/Loading";
import { useFetch } from "app/hooks/useFetch";
import type { DataList } from "app/models/home/response.model";
import type { Provinces } from "app/types/prisma-models";
import { provincesColumns } from "./ProvinceTable";
import { useState } from "react";
import SearchFilter from "app/components/layout/admin/SearchFilter";
import TextField from "app/components/common/TextField";

export default function ProvincesList() {
    const [filters, setFilters] = useState({
        provinceName: "",
        provinceCode: "",
    });
    const { data, isLoading, refetch } = useFetch<DataList<Provinces>>({
        url: `/provinces?name=${filters.provinceName}&code=${filters.provinceCode}`,
        key: ["provinces"],
    });

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleChoose = (province: Provinces) => {};

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

            {/* TABLE */}
            <div className="flex-1 min-h-0 min-w-0">
                <DynamicTable
                    title="Quản lý tỉnh"
                    description="Quản lý danh sách tỉnh thành trên hệ thống"
                    data={data?.list ?? []}
                    columns={provincesColumns}
                    onChoose={handleChoose}
                    useCanMutation={true}
                    pageSize={10}
                    totalItems={data?.total ?? 0}
                    isLoading={isLoading}
                    getRowId={(province) => province.id}
                />
            </div>
        </div>
    );
}
