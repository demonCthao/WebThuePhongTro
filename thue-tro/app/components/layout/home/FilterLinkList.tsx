import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

export interface LinkItem {
  label: string;
  to: string;
}

interface FilterLinkListProps {
  title: string;
  items: LinkItem[];
}

// Dùng cho "Xem theo khoảng giá", "Xem theo diện tích"... (lưới 2 cột)
export default function FilterLinkList({ title, items }: FilterLinkListProps) {
  return (
    <section>
      <h3 className="mb-3 text-[15px] font-medium text-neutral-900">{title}</h3>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {items.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="flex items-center gap-1 text-[13px] text-[#1a5fd1] hover:underline"
            >
              <ChevronRight size={12} className="shrink-0 text-[#f4511e]" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
