import Sidebar from "app/components/layout/admin/SideBar";
import { clearSession } from "app/helper/auth-storage";
import { Outlet } from "react-router";

export default function AdminLayout() {
  const handleLogout = () => {
    clearSession();
    window.location.href = "/dang-nhap-hoac-dang-ky";
  };
  return (
    <div className="admin-layout">
      <div className="flex min-h-screen bg-[#f8f9fb]">
        <Sidebar onLogout={handleLogout} />

        <main className="flex-1 min-h-0 overflow-hidden p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
