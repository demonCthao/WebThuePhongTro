import { LIST_ROOMS_ROUTE } from "app/const/router";
import {
  buildFilterUrl,
  parseFilters,
  type FilterValues,
} from "app/helper/filters";
import { useFetch } from "app/hooks/useFetch";
import type { DataList } from "app/models/home/response.model";
import { useLocationStore } from "app/stores/location.store";
import type { Provinces, Wards } from "app/types/prisma-models";
import RegionDialog, {
  EMPTY_REGION,
  type RegionValue,
} from "app/views/home/RegionDialog";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import FilterModal from "./FilterModal";
import Logo from "./Logo";
import NavMenu, { type NavItem } from "./NavMenu";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import { getSession } from "app/helper/auth-storage";

const NAV_ITEMS: NavItem[] = [
  { label: "Phòng trọ", href: "/phong-tro" },
  { label: "Nhà nguyên căn", href: "/nha-nguyen-can" },
  { label: "Căn hộ chung cư", href: "/can-ho-chung-cu" },
  { label: "Căn hộ mini", href: "/can-ho-mini" },
  { label: "Căn hộ dịch vụ", href: "/can-ho-dich-vu" },
  { label: "Ở ghép", href: "/o-ghep" },
  { label: "Mặt bằng", href: "/mat-bang" },
  { label: "Blog", href: "/blog" },
  { label: "Hỏi đáp", href: "/hoi-dap" },
  { label: "Bảng giá dịch vụ", href: "/bang-gia-dich-vu" },
];

export default function Header() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [provinceSelected, setProvinceSelected] = useState<string[]>([]);
  const setLocationFromRegion = useLocationStore(
    (s) => s.setLocationFromRegion,
  );
  const [region, setRegion] = useState<RegionValue>(EMPTY_REGION);

  const { data } = useFetch<DataList<Provinces>>({
    url: "/provinces/all",
    key: ["provinces/all"],
  });

  const { data: dataWards } = useFetch<DataList<Wards>>({
    url: "/wards",
    key: ["wards"],
  });

  const handleApply = (values: FilterValues) => {
    setFilterOpen(false);
    navigate(buildFilterUrl(values));
  };

  return (
    <header className="bg-white text-sm text-neutral-900 relative z-10 bg-white text-sm text-neutral-900 shadow-md">
      <div className="mx-auto max-w-[1300px] px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 py-2.5 lg:h-[58px] lg:flex-nowrap lg:py-0">
          <div className="flex items-center gap-9">
            <Logo />
            <SearchBar
              onFilterClick={() => setFilterOpen(true)}
              onFilterProvince={() => setOpen(true)}
            />
          </div>
          <UserMenu />
        </div>
        <NavMenu items={NAV_ITEMS} activeHref={pathname} />
      </div>

      <FilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        initial={parseFilters(pathname, search)}
        onApply={handleApply}
      />

      <RegionDialog
        open={open}
        onClose={() => setOpen(false)}
        value={region}
        onChange={(v) => {
          navigate(`${LIST_ROOMS_ROUTE}?province=${v.province?.code}&ward=${v.ward?.code}`)
          console.log("🚀 ~ Header ~ LIST_ROOMS_ROUTE:", LIST_ROOMS_ROUTE)
          setRegion(v); // để dialog tick đúng dòng đã chọn
          setLocationFromRegion(v); // lưu full_name vào store
        }}
        provinces={data?.list}
        wards={dataWards?.list}
        onProvinceOpen={(p) => {}}
      />
    </header>
  );
}
