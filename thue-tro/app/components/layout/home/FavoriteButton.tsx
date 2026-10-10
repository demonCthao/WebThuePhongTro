import { useState } from "react";
import { Heart } from "lucide-react";

interface FavoriteButtonProps {
  defaultActive?: boolean;
  onToggle?: (active: boolean) => void;
}

export default function FavoriteButton({ defaultActive = false, onToggle }: FavoriteButtonProps) {
  const [active, setActive] = useState(defaultActive);

  const handleClick = () => {
    const next = !active;
    setActive(next);
    onToggle?.(next);
  };

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Bỏ lưu tin" : "Lưu tin"}
      onClick={handleClick}
      className="text-[#f4511e]"
    >
      <Heart size={22} fill={active ? "currentColor" : "none"} />
    </button>
  );
}
