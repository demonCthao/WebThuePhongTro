import { cn } from "app/helper/cn";
import ImageWithFallback from "./ImageWithFallback";

interface AdBannerProps {
  src?: string;
  href?: string;
  alt?: string;
  className?: string;
}

export default function AdBanner({
  src,
  href = "#",
  alt = "Quảng cáo",
  className,
}: AdBannerProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={cn(
        "block h-[300px] w-[120px] overflow-hidden rounded-sm",
        className,
      )}
    >
      <ImageWithFallback src={src} alt={alt} className="size-full" />
    </a>
  );
}
