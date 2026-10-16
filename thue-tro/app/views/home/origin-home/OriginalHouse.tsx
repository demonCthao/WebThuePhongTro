import ContentLayout from "app/components/layout/home/ContentLayout";
import ListingRowCard from "app/components/layout/home/footer/ListingRowCard";
import Pagination from "app/components/layout/home/footer/Pagination";
import ListingCard from "app/components/layout/home/ListingCard";
import NewListings from "app/components/layout/home/NewListings";
import PageHeading from "app/components/layout/home/PageHeading";
import PriceAreaFilter from "app/components/layout/home/PriceAreaFilter";
import ProvinceList from "app/components/layout/home/ProvinceList";
import Tabs, { type TabItem } from "app/components/layout/home/Tabs";
import {
  AREA_FILTERS,
  LISTINGS,
  NEW_LISTINGS,
  PRICE_FILTERS,
  PROVINCE_OPTIONS,
  ROOMS,
} from "app/data/mock";
import { useState } from "react";
import { useSearchParams } from "react-router";

const TOTAL_PAGES = 12; // demo, lấy từ API khi có backend
type TabKey = "suggested" | "latest" | "video";

const TABS: TabItem<TabKey>[] = [
  { key: "suggested", label: "Đề xuất" },
  { key: "latest", label: "Mới đăng" },
  { key: "video", label: "Có video" },
];

export default function RoomsView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.min(
    Math.max(1, Number(searchParams.get("page")) || 1),
    TOTAL_PAGES,
  );

  const [tab, setTab] = useState<TabKey>("suggested");

  const listings =
    tab === "video" ? LISTINGS.filter((l) => l.hasVideo) : LISTINGS;

  // Giữ nguyên các query khác (?gia=, ?dt=...), chỉ đổi page
  const handlePageChange = (next: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(next));
      return prev;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ContentLayout
      main={
        <div className="space-y-5">
          <PageHeading title="Cho Thuê Nhà Nguyên Căn, Giá Rẻ, Chính Chủ, Mới Nhất 2026" />
          <ProvinceList
            prefix="Cho thuê nhà"
            provinces={PROVINCE_OPTIONS}
            allHref="/nha-nguyen-can"
          />
          <Tabs items={TABS} value={tab} onChange={setTab} />
          <div className="space-y-5">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="space-y-4">
            {ROOMS.map((room) => (
              <ListingRowCard key={room.id} listing={room} />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={TOTAL_PAGES}
            onChange={handlePageChange}
          />
        </div>
      }
      sidebar={
        <div className="space-y-5">
          <PriceAreaFilter prices={PRICE_FILTERS} areas={AREA_FILTERS} />
          <NewListings items={NEW_LISTINGS} />
        </div>
      }
    />
  );
}
