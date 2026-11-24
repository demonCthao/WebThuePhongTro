import Image from "app/components/common/Image";
import { cn } from "app/helper/cn";

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
      <Image src={src} alt={alt} className="size-full" />
    </a>
  );
}
