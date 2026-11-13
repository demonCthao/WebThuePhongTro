import { cn } from "app/helper/cn";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean; // đang gửi: hiện vòng quay và khoá nút
}

export default function Button({ loading, disabled, className, children, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        "flex h-[53px] w-full items-center justify-center gap-2.5 rounded-2xl bg-[#ff5722] text-xl text-white transition-[filter] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70",
        className
      )}
      {...props}
    >
      {loading && (
        <span aria-hidden="true" className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {children}
    </button>
  );
}
