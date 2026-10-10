import { cn } from "app/helper/cn";
import { Check } from "lucide-react";

interface CheckBadgeProps {
  checked: boolean;
  label?: string;
}

export default function CheckBadge({ checked, label }: CheckBadgeProps) {
  return (
    <span
      role="img"
      aria-label={label ?? (checked ? "Có" : "Không")}
      className={cn(
        "inline-grid size-6 place-items-center rounded-full text-white",
        checked ? "bg-[#3fae49]" : "bg-neutral-200"
      )}
    >
      <Check size={14} strokeWidth={3} />
    </span>
  );
}
