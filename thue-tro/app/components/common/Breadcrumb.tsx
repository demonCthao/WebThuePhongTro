import { cn } from "app/helper/cn";
import type { BreadcrumbItem } from "app/models/home/listing";
import { Link } from "react-router";

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center whitespace-nowrap text-base">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className={cn("flex items-center", last && "min-w-0")}>
              {item.to && !last ? (
                <Link to={item.to} className="text-[#1a5fd1] hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="truncate text-neutral-900">
                  {item.label}
                </span>
              )}
              {!last && <span className="mx-2 text-neutral-500">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
