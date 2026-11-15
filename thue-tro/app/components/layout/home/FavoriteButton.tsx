import { useState } from "react";
import { Heart } from "lucide-react";
import { getSession } from "app/helper/auth-storage";
import { useNotificationStore } from "app/stores/notification.store";

interface FavoriteButtonProps {
  defaultActive?: boolean;
  onToggle?: (active: boolean) => void;
}

export default function FavoriteButton({
  defaultActive = false,
  onToggle,
}: FavoriteButtonProps) {
  const authenSession = getSession();
  const notification = useNotificationStore();
  const [active, setActive] = useState(defaultActive);

  const handleClick = () => {
    if (!authenSession) {
      notification.updateState({
        message: "Vui lòng đăng nhập để lưu",
        type: "warning",
        open: true,
      });

      return;
    }

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
