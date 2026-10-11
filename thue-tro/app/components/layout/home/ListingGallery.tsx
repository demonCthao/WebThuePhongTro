import { Camera, Play } from "lucide-react";
import ImageWithFallback from "../../common/ImageWithFallback";

interface ListingGalleryProps {
  title: string;
  images: string[];
  imageCount: number;
  hasVideo?: boolean;
}

// 1 ảnh lớn bên trái + 3 ảnh nhỏ bên phải, ảnh thiếu sẽ hiện ô xám
export default function ListingGallery({ title, images, imageCount, hasVideo }: ListingGalleryProps) {
  const [first, second, third, fourth] = images;

  return (
    <div className="grid h-[260px] grid-cols-[3fr_2fr] gap-px overflow-hidden rounded-sm">
      <div className="relative">
        <ImageWithFallback src={first} alt={title} className="size-full" />
        {hasVideo && (
          <span className="absolute inset-0 grid place-items-center">
            <Play size={30} fill="white" strokeWidth={0} className="drop-shadow" />
          </span>
        )}
        <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/55 px-1.5 py-0.5 text-[11px] text-white">
          <Camera size={12} />
          {imageCount}
        </span>
      </div>

      <div className="grid grid-rows-2 gap-px">
        <ImageWithFallback src={second} className="size-full" />
        <div className="grid grid-cols-2 gap-px">
          <ImageWithFallback src={third} className="size-full" />
          <ImageWithFallback src={fourth} className="size-full" />
        </div>
      </div>
    </div>
  );
}
