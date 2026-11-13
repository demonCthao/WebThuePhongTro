import { LOGIN_ROUTE } from "app/const/router";
import { clearSession, getSession } from "app/helper/auth-storage";
import { ChevronDown, FolderOpen, Heart, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

interface UserMenuProps {
  avatarUrl?: string;
}

export default function UserMenu({ avatarUrl }: UserMenuProps) {
  const navigate = useNavigate();
  const authenSession = getSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    clearSession();
    setIsDropdownOpen(false);

    window.location.href = "/";
  };

  const goToLogin = () => {
    navigate(LOGIN_ROUTE);
  };

  return (
    <div className="flex items-center gap-3">
      <a
        href="/tin-da-luu"
        className="flex items-center gap-1.5 hover:text-[#f4511e]"
      >
        <Heart size={18} />
        <span>Tin đã lưu</span>
      </a>
      {authenSession ? (
        <div className="flex gap-3 items-center">
          <a
            href="/admin"
            className="flex items-center gap-1.5 hover:text-[#f4511e]"
          >
            <FolderOpen size={18} />
            <span>Quản lý</span>
          </a>

          {/* User dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 hover:text-[#f4511e] transition-colors"
            >
              <span className="grid size-8 place-items-center overflow-hidden rounded-full bg-[#eef1f4] text-neutral-400">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <User size={16} />
                )}
              </span>

              <span>{authenSession?.user?.full_name}</span>

              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <>
                {/* Click bên ngoài để đóng */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />

                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                  {/* User info */}
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {authenSession?.user?.full_name}
                    </p>
                    <p className="text-xs text-gray-500">Tài khoản của bạn</p>
                  </div>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-600 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <LogOut size={17} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div
          className="flex cursor-pointer items-center gap-1 hover:text-[#f4511e]"
          onClick={goToLogin}
        >
          <LogIn size={16} />
          Đăng nhập
        </div>
      )}
    </div>
  );
}
