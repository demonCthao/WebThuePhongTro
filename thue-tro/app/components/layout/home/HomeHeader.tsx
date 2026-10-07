import Logo from "./Logo";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import NavMenu, { type NavItem } from "./NavMenu";

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
  return (
    <header className="bg-white text-sm text-neutral-900 relative z-10 bg-white text-sm text-neutral-900 shadow-md">
      <div className="mx-auto max-w-[1300px] px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 py-2.5 lg:h-[58px] lg:flex-nowrap lg:py-0">
          <div className="flex items-center gap-9">
            <Logo />
            <SearchBar />
          </div>
          <UserMenu userName="a dep trai" />
        </div>
        <NavMenu items={NAV_ITEMS} activeHref="/phong-tro" />
      </div>
    </header>
  );
}
