import { cn } from "app/helper/cn";
import { Check } from "lucide-react";

interface CheckBadgeProps {
  checked: boolean;
  label?: string;
  size?: "md" | "sm";
}

export default function CheckBadge({ checked, label, size = "md" }: CheckBadgeProps) {
  const small = size === "sm";
  return (
    <span
      role="img"
      aria-label={label ?? (checked ? "Có" : "Không")}
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-full text-white",
        small ? "size-[18px]" : "size-6",
        checked ? "bg-[#3fae49]" : "bg-neutral-200"
      )}
    >
      <Check size={small ? 11 : 14} strokeWidth={3} />
    </span>
  );
}
