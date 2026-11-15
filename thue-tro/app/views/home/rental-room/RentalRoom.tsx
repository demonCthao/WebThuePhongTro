import Loading from "app/components/common/Loading";
import ContentLayout from "app/components/layout/home/ContentLayout";
import ListingRowCard from "app/components/layout/home/footer/ListingRowCard";
import Pagination from "app/components/layout/home/footer/Pagination";
import ListingCard from "app/components/layout/home/ListingCard";
import NewListings from "app/components/layout/home/NewListings";
import PageHeading from "app/components/layout/home/PageHeading";
import PriceAreaFilter from "app/components/layout/home/PriceAreaFilter";
import ProvinceList from "app/components/layout/home/ProvinceList";
import Tabs, { type TabItem } from "app/components/layout/home/Tabs";
import { AREA_FILTERS, PRICE_FILTERS, PROVINCE_OPTIONS } from "app/data/mock";
import { useFetch } from "app/hooks/useFetch";
import type { DataList } from "app/models/home/response.model";
import type { Rooms } from "app/types/prisma-models";
import { useState } from "react";
import { useSearchParams } from "react-router";

const TOTAL_PAGES = 12; // demo, lấy từ API khi có backend
type TabKey = "suggested" | "latest" | "video";

const TABS: TabItem<TabKey>[] = [
    { key: "suggested", label: "Đề xuất" },
    { key: "latest", label: "Mới đăng" },
    { key: "video", label: "Có video" },
];

const category = "phong-tro";

export default function RentalRoom() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [tab, setTab] = useState<TabKey>("suggested");
    const page = Number(searchParams.get("page")) || 1;
    const { data, isLoading, error, refetch } = useFetch<DataList<Rooms>>({
        url: `/rooms?pageIndex=${page}&category=${category}`,
        key: ["/rooms", searchParams.get("page") ?? ""],
    });

    const { data: dataRecommended, isLoading: isLoadingRecommended } = useFetch<
        Rooms[]
    >({
        url: `/rooms/recommended?category=${category}`,
        key: ["/rooms/recommended"],
    });

    // Giữ nguyên các query khác (?gia=, ?dt=...), chỉ đổi page
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
                    <PageHeading title="Cho Thuê Phòng Trọ Nhà Trọ, Tìm Phòng Trọ" />
                    <ProvinceList
                        prefix="Cho thuê nhà"
                        provinces={PROVINCE_OPTIONS}
                    />
                    <Tabs items={TABS} value={tab} onChange={setTab} />
                    <div className="space-y-5">
                        {dataRecommended?.map((recommended) => (
                            <ListingCard
                                key={recommended?.id}
                                room={recommended}
                            />
                        ))}
                    </div>
                    <div className="space-y-4">
                        {data?.list.map((room) => (
                            <ListingRowCard key={room.id} room={room} />
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
