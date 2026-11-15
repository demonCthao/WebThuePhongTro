import { cn } from "app/helper/cn";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function Button({
  loading,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        "inline-flex px-4 py-2 cursor-pointer items-center justify-center gap-1.5",
        "rounded-lg bg-[#ff5722] px-3",
        "text-[13px] font-medium text-white",
        "transition-colors hover:bg-[#e64d1d]",
        "disabled:cursor-not-allowed disabled:opacity-60 w-full",
        className,
      )}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
        />
      )}

      {children}
    </button>
  );
}
