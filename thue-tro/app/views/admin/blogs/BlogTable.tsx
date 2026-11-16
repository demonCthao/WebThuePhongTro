import type { DynamicColumn } from "app/components/common/DynamicTable";
import { formatDate } from "app/helper/date";
import type { BlogPosts } from "app/types/prisma-models";

export const blogsColumns: DynamicColumn<BlogPosts>[] = [
    {
        key: "id",
        title: "ID",
        width: "80px",
        align: "center",
        render: (blog) => (
            <span className="font-medium text-neutral-700">{blog.id}</span>
        ),
    },
    {
        key: "title",
        title: "Tiêu đề",
        width: "280px",
        render: (blog) => (
            <span className="font-semibold text-neutral-800 line-clamp-2">
                {blog.title}
            </span>
        ),
    },
    {
        key: "slug",
        title: "Slug",
        width: "240px",
        render: (blog) => (
            <span className="text-xs text-neutral-500">{blog.slug}</span>
        ),
    },
    {
        key: "category_id",
        title: "Danh mục",
        width: "110px",
        align: "center",
        render: (blog) => (
            <span className="font-medium text-neutral-600">
                {blog.category_id}
            </span>
        ),
    },
    {
        key: "cover_url",
        title: "Ảnh đại diện",
        width: "120px",
        align: "center",
        render: (blog) =>
            blog.cover_url ? (
                <img
                    src={blog.cover_url}
                    alt={blog.title}
                    className="mx-auto size-14 rounded-md object-cover"
                />
            ) : (
                <span className="text-xs text-neutral-400">Chưa có ảnh</span>
            ),
    },
    {
        key: "status",
        title: "Trạng thái",
        width: "140px",
        align: "center",
        render: (blog) => {
            const statusConfig = {
                draft: {
                    label: "Bản nháp",
                    className: "bg-neutral-100 text-neutral-600",
                },
                pending: {
                    label: "Chờ duyệt",
                    className: "bg-yellow-50 text-yellow-600",
                },
                published: {
                    label: "Đã xuất bản",
                    className: "bg-green-50 text-green-600",
                },
                archived: {
                    label: "Đã lưu trữ",
                    className: "bg-red-50 text-red-500",
                },
            };

            const status = statusConfig[blog.status];

            return (
                <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                >
                    {status.label}
                </span>
            );
        },
    },
    {
        key: "view_count",
        title: "Lượt xem",
        width: "100px",
        align: "center",
        render: (blog) => (
            <span className="font-medium text-neutral-600">
                {blog.view_count.toLocaleString("vi-VN")}
            </span>
        ),
    },
    {
        key: "published_at",
        title: "Ngày xuất bản",
        width: "160px",
        align: "center",
        render: (blog) => (
            <span className="text-sm text-neutral-500">
                {blog.published_at
                    ? formatDate(blog.published_at, "datetime")
                    : "-"}
            </span>
        ),
    },
    {
        key: "created_at",
        title: "Ngày tạo",
        width: "160px",
        align: "center",
        render: (blog) => (
            <span className="text-sm text-neutral-500">
                {formatDate(blog.created_at, "datetime")}
            </span>
        ),
    },
];
