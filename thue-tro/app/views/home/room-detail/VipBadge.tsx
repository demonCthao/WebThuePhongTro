import StarRating from "app/components/layout/home/StarRating";
import { cn } from "app/helper/cn";

interface VipBadgeProps {
  label: string;
  stars: number;
  className?: string; // màu nền, ví dụ "bg-[#1b5cf3]"
}

export default function VipBadge({ label, stars, className }: VipBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium uppercase text-white",
        className
      )}
    >
      <StarRating count={stars} size={13} className="text-[#ffd21f]" />
      {label}
    </span>
  );
}
