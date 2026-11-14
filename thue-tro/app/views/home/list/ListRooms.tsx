import Loading from "app/components/common/Loading";
import ContentLayout from "app/components/layout/home/ContentLayout";
import ListingRowCard from "app/components/layout/home/footer/ListingRowCard";
import Pagination from "app/components/layout/home/footer/Pagination";
import NewListings from "app/components/layout/home/NewListings";
import PriceAreaFilter from "app/components/layout/home/PriceAreaFilter";
import { AREA_FILTERS, PRICE_FILTERS } from "app/data/mock";
import { useFetch } from "app/hooks/useFetch";
import type { DataList } from "app/models/home/response.model";
import { useLocationStore } from "app/stores/location.store";
import type { Rooms } from "app/types/prisma-models";
import { useSearchParams } from "react-router";

export default function ListRooms() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { location } = useLocationStore()
    const page = Number(searchParams.get("page")) || 1;
    const maxPrice = searchParams.get("maxPrice")?? "0";
    const minPrice = searchParams.get("minPrice")?? "0"
    const province = searchParams.get("province");
    const ward = searchParams.get("ward");
    const areaM2 = searchParams.get("areaM2");

    const { data, isLoading } = useFetch<DataList<Rooms>>({
        url: `/rooms/by-price?pageIndex=${page}&minPrice=${minPrice}&maxPrice=${maxPrice}&province=${province?? ""}&ward=${ward?? ""}`,
        key: [
            "/rooms/by-price",
            page.toString(),
            minPrice,
            maxPrice,
            ward?? "",
            province?? "",
            areaM2?? ""
        ],
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
                    <div className="space-y-4">
                        {data?.list.map((room) => (
                            <ListingRowCard key={room.id} room={room} />
                        ))}
                    </div>
                    <Pagination
                        page={Number(page)}
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
