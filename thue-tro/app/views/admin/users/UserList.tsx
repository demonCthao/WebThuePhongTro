import { DynamicTable } from "app/components/common/DynamicTable";
import Loading from "app/components/common/Loading";
import { useFetch } from "app/hooks/useFetch";
import type { DataList } from "app/models/home/response.model";
import type { Users } from "app/types/prisma-models";
import { usersColumns } from "./UserTable";
import SearchFilter from "app/components/layout/admin/SearchFilter";
import TextField from "app/components/common/TextField";
import { useState } from "react";

export default function UserList() {
    const [filters, setFilters] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const { data, isLoading, refetch } = useFetch<DataList<Users>>({
        url: `/users?name=${filters.name}&email=${filters.email}&phone=${filters.phone}`,
        key: ["users"],
    });

    const handleChoose = (user: Users) => {};

    const handleReset = () => {
        setFilters({
            name: "",
            email: "",
            phone: "",
        });

        refetch();
    };

    return (
        <div className="flex h-full min-h-0 flex-col gap-3">
            <div className="shrink-0">
                <SearchFilter
                    loading={isLoading}
                    onReset={handleReset}
                    onSearch={() => refetch()}
                >
                    <TextField
                        label="Họ và tên"
                        value={filters.name}
                        onChange={(value) => handleFilterChange("name", value)}
                    />

                    <TextField
                        label="Email"
                        value={filters.email}
                        onChange={(value) => handleFilterChange("email", value)}
                    />

                    <TextField
                        label="Số điện thoại"
                        value={filters.phone}
                        onChange={(value) => handleFilterChange("phone", value)}
                        inputMode="tel"
                    />
                </SearchFilter>
            </div>

            <div className="flex-1 min-h-0 min-w-0">
                <DynamicTable
                    title="Quản lý người dùng"
                    description="Quản lý người dùng trên hệ thống"
                    data={data?.list ?? []}
                    columns={usersColumns}
                    onChoose={handleChoose}
                    useCanMutation={true}
                    pageSize={10}
                    totalItems={data?.total ?? 0}
                    isLoading={isLoading}
                    getRowId={(user) => user.id}
                />
            </div>
        </div>
    );
}
