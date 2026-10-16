import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "app/helper/cn";

interface OptionChipProps {
  selected: boolean;
  onClick: () => void;
  icon?: ReactNode; // có icon thì xếp dọc (icon trên, chữ dưới)
  children: ReactNode;
}

// Nút chọn dạng viên thuốc; khi chọn: viền + chữ cam, góc phải có dấu tích
export default function OptionChip({ selected, onClick, icon, children }: OptionChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-white text-sm shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-colors",
        icon ? "flex min-w-[70px] flex-col items-center gap-1 px-3.5 py-2" : "px-4 py-1.5",
        selected ? "border-[#ff5722] text-[#ff5722]" : "border-neutral-200 text-neutral-800 hover:border-neutral-300"
      )}
    >
      {icon}
      {children}
      {selected && (
        <span aria-hidden="true" className="absolute right-0 top-0 size-[22px]">
          <span className="absolute -right-[11px] -top-[11px] size-[22px] rotate-45 bg-[#ff5722]" />
          <Check size={11} strokeWidth={3} className="absolute right-[2px] top-[2px] text-white" />
        </span>
      )}
    </button>
  );
}
