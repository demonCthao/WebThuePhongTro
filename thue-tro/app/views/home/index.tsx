import Header from "app/components/layout/home/HomeHeader";
import PriceList from "app/components/layout/home/PriceList";
import { Outlet } from "react-router";

export default function HomeLayout() {
    return (
        <div className="bg-[#fdf5ed] h-screen">
            <header>
                <nav>
                    <Header />
                </nav>
            </header>

            <main>
                <div className="grid grid-cols-3 gap-4 xl:max-w-[1020px] lg:max-w-[980px] mx-auto mt-10">
                    <div className="col-span-8 xl:col-span-2">
                        <Outlet />
                    </div>
                    <div className="col-span-8 xl:col-span-1">
                        <PriceList />
                    </div>
                </div>
            </main>

            <footer>Footer</footer>
        </div>
    );
}
