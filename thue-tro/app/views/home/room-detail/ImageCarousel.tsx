import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageWithFallback from "app/components/common/ImageWithFallback";
import { cn } from "app/helper/cn";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  fastRent?: boolean;
}

const arrowClass =
  "absolute top-1/2 grid h-[50px] w-[50px] -translate-y-1/2 place-items-center bg-[#495057]/90 text-white hover:bg-[#343a40]";

// Ảnh lớn nền tối + nút trước/sau + dải ảnh nhỏ. Hỗ trợ phím ← → khi đang focus vào ảnh
export default function ImageCarousel({ images, alt, fastRent }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const count = Math.max(images.length, 1);
  const go = (next: number) => setIndex((next + count) % count);

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <div
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label={alt}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") go(index - 1);
          if (e.key === "ArrowRight") go(index + 1);
        }}
        className="relative bg-[#212529] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/60"
      >
        <ImageWithFallback
          src={images[index]}
          alt={`${alt} - ảnh ${index + 1}`}
          className="h-[300px] w-full sm:h-[450px]"
        />

        {fastRent && (
          <div className="pointer-events-none absolute left-0 top-0 size-[115px] overflow-hidden">
            <div className="absolute -left-[40px] top-[28px] w-[170px] -rotate-45 bg-[#f43f5e] py-1 text-center text-[10px] font-bold uppercase leading-[13px] text-white shadow">
              Cho thuê
              <br />
              <span className="text-[17px] leading-[17px]">Nhanh</span>
            </div>
          </div>
        )}

        {count > 1 && (
          <>
            <button type="button" aria-label="Ảnh trước" onClick={() => go(index - 1)} className={cn(arrowClass, "left-0")}>
              <ChevronLeft size={30} strokeWidth={1.5} />
            </button>
            <button type="button" aria-label="Ảnh sau" onClick={() => go(index + 1)} className={cn(arrowClass, "right-0")}>
              <ChevronRight size={30} strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>

      <div className="overflow-x-auto">
        <ul className="mx-auto flex w-max gap-2 p-2.5">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                aria-label={`Xem ảnh ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "block size-[78px] overflow-hidden rounded-md border-2 transition-opacity",
                  i === index ? "border-[#ff7a45]" : "border-transparent opacity-80 hover:opacity-100"
                )}
              >
                <ImageWithFallback src={src} className="size-full" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
