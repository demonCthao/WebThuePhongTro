import { cn } from "app/helper/cn";
import type { ImgHTMLAttributes } from "react";

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    fallback?: string;
    containerClassName?: string;
}

export default function Image({
    src,
    alt = "",
    fallback,
    className,
    containerClassName,
    ...props
}: ImageProps) {
    return (
        <div
            className={cn(
                "relative h-full w-full overflow-hidden bg-gray-100",
                containerClassName,
            )}
        >
            <img
                src={`http://localhost:3000${src || fallback}`}
                alt={alt}
                className={cn("block h-full w-full object-cover", className)}
                onError={(event) => {
                    if (fallback && event.currentTarget.src !== fallback) {
                        event.currentTarget.src = fallback;
                    }
                }}
                loading="lazy"
                {...props}
            />
        </div>
    );
}
