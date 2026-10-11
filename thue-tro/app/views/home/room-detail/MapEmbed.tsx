import { MapPin } from "lucide-react";

interface MapEmbedProps {
  address: string;
}

// Google Maps nhúng bằng địa chỉ, không cần API key
export default function MapEmbed({ address }: MapEmbedProps) {
  const query = encodeURIComponent(address);

  return (
    <div>
      <p className="mb-3 flex flex-wrap items-center gap-x-2 text-[15px] text-neutral-900">
        <span className="flex items-center gap-1">
          <MapPin size={14} className="text-neutral-500" />
          Địa chỉ: {address}
        </span>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${query}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1a5fd1] underline underline-offset-2 hover:no-underline"
        >
          Xem bản đồ lớn
        </a>
      </p>
      <iframe
        title="Bản đồ vị trí"
        src={`https://www.google.com/maps?q=${query}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-[300px] w-full rounded-md border-0"
      />
    </div>
  );
}
