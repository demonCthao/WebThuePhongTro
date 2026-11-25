
import { cn } from "app/helper/cn";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
    default:
        "bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-500/10",

    destructive:
        "bg-red-600 text-white hover:bg-red-500 shadow-md shadow-red-500/10",

    outline:
        "border border-white/10 bg-transparent text-white hover:bg-white/5 hover:border-white/20",

    secondary:
        "bg-white/10 text-white hover:bg-white/15 border border-white/5",

    ghost:
        "bg-transparent text-white hover:bg-white/5",

    link:
        "bg-transparent text-emerald-400 underline-offset-4 hover:underline px-0 shadow-none",
};

export default function Button({
    loading = false,
    disabled,
    className,
    children,
    variant = "default",
    type = "button",
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            aria-busy={loading}
            className={cn(
                "inline-flex items-center justify-center gap-1.5",
                "rounded-lg px-4 py-2",
                "text-[13px] font-medium",
                "transition-colors duration-200",
                "cursor-pointer",
                "disabled:cursor-not-allowed disabled:opacity-60",
                "w-full",
                variantClasses[variant],
                className,
            )}
            {...props}
        >
            {loading && (
                <span
                    aria-hidden="true"
                    className="size-3.5 animate-spin rounded-full border-2 border-current/40 border-t-current"
                />
            )}

            {children}
        </button>
    );
}
