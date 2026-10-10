import ContentLayout from "app/components/layout/home/ContentLayout";
import Header from "app/components/layout/home/HomeHeader";
import ListingCard from "app/components/layout/home/ListingCard";
import NewListings from "app/components/layout/home/NewListings";
import PageHeading from "app/components/layout/home/PageHeading";
import PriceAreaFilter from "app/components/layout/home/PriceAreaFilter";
import ProvinceList from "app/components/layout/home/ProvinceList";
import type { TabItem } from "app/components/layout/home/Tabs";
import Tabs from "app/components/layout/home/Tabs";
import {
  AREA_FILTERS,
  LISTINGS,
  NEW_LISTINGS,
  PRICE_FILTERS,
  PROVINCES,
} from "app/data/mock";
import { useState } from "react";

type TabKey = "suggested" | "latest" | "video";

const TABS: TabItem<TabKey>[] = [
  { key: "suggested", label: "Đề xuất" },
  { key: "latest", label: "Mới đăng" },
  { key: "video", label: "Có video" },
];

export default function HomeView() {
  const [tab, setTab] = useState<TabKey>("suggested");

  const listings =
    tab === "video" ? LISTINGS.filter((l) => l.hasVideo) : LISTINGS;

  return (
    <div>
      <header>
        <nav>
          <Header />
        </nav>
      </header>
      <ContentLayout
        main={
          <div className="space-y-5">
            <PageHeading
              title="Cho Thuê Nhà Nguyên Căn, Giá Rẻ, Chính Chủ, Mới Nhất 2026"
              description="Cho thuê nhà nguyên căn, nhà riêng: giá rẻ, chính chủ, đầy đủ tiện nghi 2026. Tìm thuê nhà với nhiều mức giá khác nhau, đa dạng loại diện tích. Đăng tin cho thuê nhà nhanh, hiệu quả tại Phongtro123.com"
            />
            <ProvinceList
              prefix="Cho thuê nhà"
              provinces={PROVINCES}
              allHref="/nha-nguyen-can"
            />
            <Tabs items={TABS} value={tab} onChange={setTab} />
            <div className="space-y-5">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        }
        sidebar={
          <div className="space-y-5">
            <PriceAreaFilter prices={PRICE_FILTERS} areas={AREA_FILTERS} />
            <NewListings items={NEW_LISTINGS} />
          </div>
        }
      />
    </div>
  );
}
