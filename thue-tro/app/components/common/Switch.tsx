import { cn } from "app/helper/cn";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string; // đọc bởi trình đọc màn hình
}

export default function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-7 w-[54px] shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2ca34a]",
        checked ? "bg-[#2ca34a]" : "bg-neutral-300",
      )}
    >
      <span
        className={cn(
          "absolute left-0.5 top-0.5 size-6 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-[26px]",
        )}
      />
    </button>
  );
}
