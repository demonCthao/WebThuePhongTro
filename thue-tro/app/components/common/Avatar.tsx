import { cn } from "app/helper/cn";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
}

export default function Avatar({
  src,
  alt = "",
  size = 40,
  className,
}: AvatarProps) {
  return (
    <span
      style={{ width: size, height: size }}
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 text-neutral-400",
        className,
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="size-full object-cover" />
      ) : (
        <User size={size * 0.5} />
      )}
    </span>
  );
}
