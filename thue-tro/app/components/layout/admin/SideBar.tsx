import {
    BookOpenText,
    ChevronLeft,
    ChevronRight,
    Club,
    FileSpreadsheet,
    Home,
    LayoutDashboard,
    LogOut,
    MapPinHouse,
    Users
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";

const menuItems = [
    {
        label: "Tổng quan",
        path: "/admin",
        icon: LayoutDashboard,
    },
    {
        label: "Quản lý tỉnh thành",
        path: "/admin/tinh-thanh",
        icon: MapPinHouse,
    },
    {
        label: "Quản lý phường",
        path: "/admin/phuong",
        icon: Club,
    },
    {
        label: "Người dùng",
        path: "/admin/nguoi-dung",
        icon: Users,
    },
    {
        label: "Bài đăng phòng",
        path: "/admin/bai-dang",
        icon: BookOpenText,
    },
    {
        label: "Blog",
        path: "/admin/blog",
        icon: FileSpreadsheet,
    },
];

interface SidebarProps {
    onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    return (
        <aside
            className={`relative flex h-screen flex-col border-r border-neutral-100 bg-white transition-all duration-300 ${
                isCollapsed ? "w-[76px]" : "w-[250px]"
            }`}
        >
            {/* Logo */}
            <div className="flex h-[72px] items-center justify-between border-b border-neutral-100 px-4">
                {!isCollapsed && (
                    <Link
                        to="/admin"
                        className="text-lg font-bold text-[#dc3b2f]"
                    >
                        ADMIN
                    </Link>
                )}

                <button
                    type="button"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="grid size-9 place-items-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-[#f4511e]"
                >
                    {isCollapsed ? (
                        <ChevronRight size={19} />
                    ) : (
                        <ChevronLeft size={19} />
                    )}
                </button>
            </div>

            {/* Menu */}
            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            title={isCollapsed ? item.label : undefined}
                            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all ${
                                isActive
                                    ? "bg-[#fff1ed] font-medium text-[#dc3b2f]"
                                    : "text-neutral-600 hover:bg-neutral-50 hover:text-[#f4511e]"
                            }`}
                        >
                            <Icon size={19} className="shrink-0" />

                            {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom actions */}
            <div className="border-t border-neutral-100 p-3">
                <Link
                    to="/"
                    title={isCollapsed ? "Về trang chủ" : undefined}
                    className="mb-1 flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-neutral-600 transition hover:bg-neutral-50 hover:text-[#f4511e]"
                >
                    <Home size={19} className="shrink-0" />
                    {!isCollapsed && <span>Về trang chủ</span>}
                </Link>

                <button
                    type="button"
                    onClick={onLogout}
                    title={isCollapsed ? "Đăng xuất" : undefined}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-neutral-600 transition hover:bg-red-50 hover:text-red-500"
                >
                    <LogOut size={19} className="shrink-0" />
                    {!isCollapsed && <span>Đăng xuất</span>}
                </button>
            </div>
        </aside>
    );
}
