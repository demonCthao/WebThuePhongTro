import { cn } from "app/helper/cn";
import { Star } from "lucide-react";

interface StarRatingProps {
  count?: number;
  size?: number;
  className?: string
}

export default function StarRating({ count = 5, size = 12, className = "" }: StarRatingProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-px align-[-1px] text-[#f5a623]", className)}
      aria-label={`${count} sao`}
    >
      {Array.from({ length: count }, (_, i) => (
        <Star key={i} size={size} fill="currentColor" strokeWidth={0} />
      ))}
    </span>
  );
}
