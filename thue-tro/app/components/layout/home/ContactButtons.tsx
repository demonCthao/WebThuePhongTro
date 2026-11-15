import { cn } from "app/helper/cn";
import { MessageCircle, Phone } from "lucide-react";

interface ContactButtonsProps {
  phone: string;
  layout?: "stack" | "inline"; // stack: 2 nút to xếp dọc (sidebar) | inline: 2 nút nhỏ cạnh nhau
}

export default function ContactButtons({
  phone,
  layout = "stack",
}: ContactButtonsProps) {
  const digits = phone.replace(/\D/g, "");
  const stack = layout === "stack";

  const base = cn(
    "inline-flex items-center justify-center gap-2 font-medium text-white transition-[filter] hover:brightness-95",
    stack
      ? "h-[52px] w-full rounded-xl text-xl"
      : "h-[34px] rounded-full px-4 text-sm",
  );
  const iconSize = stack ? 20 : 16;

  return (
    <div className={cn("flex", stack ? "flex-col gap-2.5" : "flex-wrap gap-2")}>
      {/* CALL */}
      <a
        href={`tel:${digits}`}
        className={cn(
          base,
          "h-11 rounded-xl bg-[#10b981] px-4 text-sm font-semibold",
          "shadow-sm transition-all duration-200",
          "hover:bg-[#059669] hover:shadow-md",
          "active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[#10b981] focus-visible:ring-offset-2",
        )}
      >
        <Phone size={iconSize} fill="currentColor" strokeWidth={0} />
        Gọi điện
      </a>

      {/* ZALO */}
      <a
        href={`https://zalo.me/${digits}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          base,
          "h-11 rounded-xl bg-[#0d6efd] px-4 text-sm font-semibold",
          "shadow-sm transition-all duration-200",
          "hover:bg-[#0b5ed7] hover:shadow-md",
          "active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[#0d6efd] focus-visible:ring-offset-2",
        )}
      >
        <MessageCircle size={iconSize} />
        Nhắn Zalo
      </a>
    </div>
  );
}
