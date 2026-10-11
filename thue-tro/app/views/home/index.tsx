import Footer from "app/components/layout/home/footer/Footer";
import Header from "app/components/layout/home/HomeHeader";
import { Outlet } from "react-router";

export default function HomeLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fff8f8]">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
