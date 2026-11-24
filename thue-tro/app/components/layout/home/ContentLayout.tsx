import { useFetch } from "app/hooks/useFetch";
import type { Ads } from "app/types/prisma-models";
import AdBanner from "./AdBanner";
import FloatingActions from "./FloatingActions";

interface ContentLayoutProps {
  main: React.ReactNode;
  sidebar?: React.ReactNode;
}

export default function ContentLayout({ main, sidebar }: ContentLayoutProps) {
  const { data, isLoading, error } = useFetch<Ads[]>({
    url: "/ads",
    key: ["/ads"],
  });

  // Lấy tối đa 2 quảng cáo thuộc placement_id = 2
  const sidebarAds = (data ?? [])
    .filter((ad) => ad.ad_placements?.id === 2 && ad.status === "active")
    .slice(0, 2);

  return (
    <div>
      <div className="mx-auto flex max-w-[1400px] items-start justify-center gap-5 px-4 py-5">
        {/* Banner bên trái */}
        <aside className="sticky top-4 hidden w-[120px] shrink-0 xl:ml-0 xl:mr-6 xl:block">
          {sidebarAds[0] && (
            <AdBanner
              src={sidebarAds[0].image_url}
              href={sidebarAds[0].link_url}
              alt={sidebarAds[0].alt_text || sidebarAds[0].title}
            />
          )}
        </aside>

        {/* Nội dung chính */}
        <div className="flex min-w-0 flex-1 flex-col gap-5 lg:max-w-[1000px] lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">{main}</div>

          {sidebar && (
            <aside className="w-full shrink-0 lg:w-[320px]">{sidebar}</aside>
          )}
        </div>

        {/* Banner bên phải */}
        <aside className="sticky top-4 hidden w-[120px] shrink-0 xl:ml-6 xl:block">
          {sidebarAds[1] && (
            <AdBanner
              src={sidebarAds[1].image_url}
              href={sidebarAds[1].link_url}
              alt={sidebarAds[1].alt_text || sidebarAds[1].title}
            />
          )}
        </aside>
      </div>

      <FloatingActions />
    </div>
  );
}
