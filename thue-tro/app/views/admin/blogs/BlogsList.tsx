import { DynamicTable } from "app/components/common/DynamicTable";
import TextField from "app/components/common/TextField";
import SearchFilter from "app/components/layout/admin/SearchFilter";
import { useState } from "react";
import { blogsColumns } from "./BlogTable";
import { useFetch } from "app/hooks/useFetch";
import type { DataList } from "app/models/home/response.model";
import type { BlogPosts } from "app/types/prisma-models";

export default function BlogsList() {
    const [filters, setFilters] = useState({
        title: "",
    });
    const { data, isLoading, refetch } = useFetch<DataList<BlogPosts>>({
        url: `/blog-posts?title=${filters.title}`,
        key: ["provinces"],
    });

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleChoose = (blog: BlogPosts) => {

    };

    return (
        <div className="flex h-full min-h-0 flex-col gap-3">
            {/* SEARCH FILTER */}
            <div className="shrink-0">
                <SearchFilter
                    loading={isLoading}
                    onReset={() => {
                        setFilters({
                            title: "",
                        });

                        refetch();
                    }}
                    onSearch={() => refetch()}
                >
                    <TextField
                        label="Tiêu đề"
                        value={filters.title}
                        onChange={(value) =>
                            handleFilterChange("title", value)
                        }
                    />
                </SearchFilter>
            </div>

            {/* TABLE */}
            <div className="flex-1 min-h-0 min-w-0">
                <DynamicTable
                    title="Quản lý bài viết"
                    description="Quản lý bài viết trên hệ thống"
                    data={data?.list ?? []}
                    columns={blogsColumns}
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
