import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import type { LinkItem } from "./FilterLinkList";

interface ProvinceListProps {
  prefix: string;
  provinces: LinkItem[];
  allHref: string;
}

const chipClass =
  "rounded-md bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-md";

export default function ProvinceList({ prefix, provinces, allHref }: ProvinceListProps) {
  return (
    <section>
      <h2 className="mb-2 text-xs font-medium uppercase text-neutral-800">Tỉnh thành</h2>
      <ul className="flex flex-wrap gap-2.5">
        {provinces.map((province) => (
          <li key={province.to}>
            <Link to={province.to} className={`${chipClass} block px-3 py-1.5 leading-tight`}>
              <span className="block text-xs text-[#1a7fd0]">{prefix}</span>
              <span className="block text-sm font-medium text-[#1a5fd1]">{province.label}</span>
            </Link>
          </li>
        ))}
        <li>
          <Link
            to={allHref}
            className={`${chipClass} flex h-full items-center gap-0.5 px-3 text-xs text-[#1a5fd1]`}
          >
            Tất cả
            <ChevronRight size={12} />
          </Link>
        </li>
      </ul>
    </section>
  );
}
