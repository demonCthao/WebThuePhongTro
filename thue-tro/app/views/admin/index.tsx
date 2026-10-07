import { Outlet } from "react-router";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside>
        <nav>
          {/* Admin sidebar */}
        </nav>
      </aside>

      <div className="admin-content">
        <header>
          Admin Header
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}