import type { ReactNode } from "react";
import AdBanner from "./AdBanner";
import FloatingActions from "./FloatingActions";

interface ContentLayoutProps {
  main: ReactNode;
  sidebar?: ReactNode;
}

export default function ContentLayout({ main, sidebar }: ContentLayoutProps) {
  return (
    <div>
      <div className="mx-auto flex max-w-[1400px] items-start justify-center gap-5 px-4 py-5">
        <aside className="sticky top-4 hidden w-[120px] shrink-0 xl:ml-0 xl:mr-6 xl:block">
          <AdBanner />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-5 lg:max-w-[1000px] lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">{main}</div>
          {sidebar && (
            <aside className="w-full shrink-0 lg:w-[320px]">{sidebar}</aside>
          )}
        </div>

        <aside className="sticky top-4 hidden w-[120px] shrink-0 xl:ml-6 xl:block">
          <AdBanner />
        </aside>
      </div>

      <FloatingActions />
    </div>
  );
}
