import { useNavigate } from "react-router";
import type { LinkItem } from "./FilterLinkList";

interface ProvinceListProps {
  prefix: string;
  provinces: LinkItem[];
}

const chipClass =
  "rounded-md bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-md";

export default function ProvinceList({ prefix, provinces }: ProvinceListProps) {
  const navigate = useNavigate();

  const goToLink = (url: string) => {
    navigate(url);
  };

  return (
    <section>
      <h2 className="mb-2 text-xs font-medium uppercase text-neutral-800">
        Tỉnh thành
      </h2>
      <ul className="flex flex-wrap gap-2.5">
        {provinces.map((province) => (
          <li key={province.to}>
            <div
              onClick={() => goToLink(province.to)}
              className={`${chipClass} block px-3 py-1.5 leading-tight`}
            >
              <span className="block text-xs text-[#1a7fd0]">{prefix}</span>
              <span className="block text-sm font-medium text-[#1a5fd1]">
                {province.label}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
