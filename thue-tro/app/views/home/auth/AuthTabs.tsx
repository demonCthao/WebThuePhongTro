import { cn } from "app/helper/cn";
import { useLocation } from "react-router";

interface AuthTabsProps {
  mode: "login" | "register";
  onChangeMode: (mode: "login" | "register") => void 
}

const TABS = [
  { mode: "login", label: "Đăng nhập", to: "/dang-nhap" },
  { mode: "register", label: "Tạo tài khoản mới", to: "/dang-ky" },
] as const;

// Hai tab là hai đường dẫn riêng (/dang-nhap, /dang-ky), giữ nguyên ?redirect= khi chuyển
export default function AuthTabs({ mode, onChangeMode }: AuthTabsProps) {
  const { search } = useLocation();

  return (
    <nav aria-label="Đăng nhập hoặc đăng ký" className="flex">
      {TABS.map((tab) => {
        const active = tab.mode === mode;
        return (
          <div
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex-1 border-b-2 pb-4 text-center text-lg leading-9 transition-colors sm:text-[20px] cursor-pointer",
              active
                ? "border-[#ff5722] font-bold text-neutral-900"
                : "border-neutral-200 font-light text-neutral-500 hover:text-neutral-700"
            )}
            onClick={() => onChangeMode(tab.mode)}
          >
            {tab.label}
          </div>
        );
      })}
    </nav>
  );
}
