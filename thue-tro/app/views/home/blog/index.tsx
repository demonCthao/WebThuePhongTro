import ContentLayout from "app/components/layout/home/ContentLayout";
import PageHeading from "app/components/layout/home/PageHeading";
import { useFetch } from "app/hooks/useFetch";
import type { DataList } from "app/models/home/response.model";
import type { BlogPosts } from "app/types/prisma-models";
import { useSearchParams } from "react-router";
import BlogCard from "./BlogCard";
import Pagination from "app/components/layout/home/footer/Pagination";
import NewListings from "app/components/layout/home/NewListings";
import PriceAreaFilter from "app/components/layout/home/PriceAreaFilter";
import { AREA_FILTERS, PRICE_FILTERS } from "app/data/mock";
import Loading from "app/components/common/Loading";

export default function BlogListView() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const { data, isLoading, error, refetch } = useFetch<DataList<BlogPosts>>({
        url: `/blog-posts?pageIndex=${page}`,
        key: ["/blog-posts", searchParams.get("page") ?? ""],
    });

    const handlePageChange = (next: number) => {
        setSearchParams((prev) => {
            prev.set("page", String(next));
            return prev;
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <ContentLayout
            main={
                <div className="space-y-5">
                    <PageHeading title="Cẩm nang thuê trọ" />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {data?.list?.map((blog) => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))}
                    </div>

                    <Pagination
                        page={page}
                        totalPages={data?.totalPages ?? 1}
                        onChange={handlePageChange}
                    />
                </div>
            }
            sidebar={
                <div className="space-y-5">
                    <PriceAreaFilter
                        prices={PRICE_FILTERS}
                        areas={AREA_FILTERS}
                    />
                    <NewListings />
                </div>
            }
        />
    );
}
