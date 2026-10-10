import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "app/helper/cn";

interface FavoriteButtonProps {
  defaultActive?: boolean;
  onToggle?: (active: boolean) => void;
  variant?: "outline" | "soft";
}

export default function FavoriteButton({
  defaultActive = false,
  onToggle,
  variant = "outline",
}: FavoriteButtonProps) {
  const [active, setActive] = useState(defaultActive);

  const handleClick = () => {
    const next = !active;
    setActive(next);
    onToggle?.(next);
  };

  const soft = variant === "soft";

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Bỏ lưu tin" : "Lưu tin"}
      onClick={handleClick}
      className={cn(
        "transition-colors",
        soft && !active
          ? "text-neutral-300 hover:text-neutral-400"
          : "text-[#f4511e]",
      )}
    >
      <Heart
        size={soft ? 24 : 22}
        fill={active || soft ? "currentColor" : "none"}
        strokeWidth={soft ? 0 : 2}
      />
    </button>
  );
}
