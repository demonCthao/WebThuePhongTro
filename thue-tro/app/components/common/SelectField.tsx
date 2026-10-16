import type { Option } from "app/data/mock";
import { cn } from "app/helper/cn";
import { ChevronDown } from "lucide-react";

interface SelectFieldProps {
  label: string;
  value: string;
  options: Option[];
  placeholder: string; // chữ hiện khi chưa chọn (value rỗng)
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function SelectField({
  label,
  value,
  options,
  placeholder,
  onChange,
  disabled,
}: SelectFieldProps) {
  const selected = value !== "";

  return (
    <label className="block">
      <span className="mb-1 block text-sm text-neutral-700">{label}</span>
      <span className="relative block">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-10 w-full appearance-none rounded-xl border bg-white pl-3 pr-9 text-sm outline-none transition-colors",
            selected
              ? "border-[#ff5722] text-[#ff5722]"
              : "border-neutral-300 text-neutral-500",
            "disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400",
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className={cn(
            "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2",
            selected ? "text-[#ff5722]" : "text-neutral-500",
          )}
        />
      </span>
    </label>
  );
}
