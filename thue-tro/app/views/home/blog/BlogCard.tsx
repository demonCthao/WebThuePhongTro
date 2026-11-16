import { Link } from "react-router";
import { Eye, CalendarDays, ArrowUpRight } from "lucide-react";

import Card from "app/components/common/Card";
import ImageWithFallback from "app/components/common/ImageWithFallback";
import type { BlogPosts } from "app/types/prisma-models";
import { formatDate } from "app/helper/date";

interface BlogCardProps {
    blog: BlogPosts;
}

export default function BlogCard({ blog }: BlogCardProps) {
    const { title, slug, excerpt, cover_url, published_at, view_count } = blog;

    return (
        <Card className="group overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <Link
                to={`/blog/${slug}`}
                className="relative block aspect-[16/10] overflow-hidden"
            >
                <ImageWithFallback
                    src={cover_url ?? undefined}
                    alt={title}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </Link>

            <div className="flex flex-col p-4">
                <div className="mb-3 flex items-center gap-3 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                        <CalendarDays size={14} />
                        {published_at
                            ? formatDate(published_at, "date")
                            : "Chưa xuất bản"}
                    </span>

                    <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {view_count.toLocaleString("vi-VN")} lượt xem
                    </span>
                </div>

                <Link to={`/blog/${slug}`}>
                    <h2 className="line-clamp-2 min-h-14 text-base font-semibold leading-7 text-neutral-900 transition-colors group-hover:text-[#1a4fb0]">
                        {title}
                    </h2>
                </Link>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-500">
                    {excerpt}
                </p>

                <Link
                    to={`/blog/${slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#1a4fb0] hover:gap-2"
                >
                    Đọc tiếp
                    <ArrowUpRight size={16} />
                </Link>
            </div>
        </Card>
    );
}
