import { cn } from "app/helper/cn";
import { useState } from "react";

interface ImageWithFallbackProps {
  src?: string;
  alt?: string;
  className?: string;
  fit?: "cover" | "contain";
}

export default function ImageWithFallback({ src, alt = "", className, fit = "cover" }: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt || "Chưa có ảnh"}
        className="grid place-items-center bg-neutral-200/70 text-neutral-300"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-10">
          <path d="M12 3 2 12h3v8h5v-5h4v5h5v-8h3L12 3Z" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn(fit === "contain" ? "object-contain" : "object-cover", className)}
    />
  );
}
