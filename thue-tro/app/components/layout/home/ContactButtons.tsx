import { cn } from "app/helper/cn";
import { MessageCircle, Phone } from "lucide-react";

interface ContactButtonsProps {
  phone: string;
  layout?: "stack" | "inline"; // stack: 2 nút to xếp dọc (sidebar) | inline: 2 nút nhỏ cạnh nhau
}

export default function ContactButtons({ phone, layout = "stack" }: ContactButtonsProps) {
  const digits = phone.replace(/\D/g, "");
  const stack = layout === "stack";

  const base = cn(
    "inline-flex items-center justify-center gap-2 font-medium text-white transition-[filter] hover:brightness-95",
    stack ? "h-[52px] w-full rounded-xl text-xl" : "h-[34px] rounded-full px-4 text-sm"
  );
  const iconSize = stack ? 20 : 16;

  return (
    <div className={cn("flex", stack ? "flex-col gap-2.5" : "flex-wrap gap-2")}>
      <a href={`tel:${digits}`} className={cn(base, "bg-[#10b981]")}>
        <Phone size={iconSize} fill="currentColor" strokeWidth={0} />
        {phone}
      </a>
      <a
        href={`https://zalo.me/${digits}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(base, "bg-[#0d6efd]")}
      >
        <MessageCircle size={iconSize} />
        Nhắn Zalo
      </a>
    </div>
  );
}
