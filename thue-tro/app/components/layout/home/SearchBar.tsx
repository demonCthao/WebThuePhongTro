import { MapPin, Filter } from "lucide-react";

interface SearchBarProps {
  onFilterClick?: () => void;
  onFilterPlaceClick?: () => void;
}

export default function SearchBar({ onFilterClick, onFilterPlaceClick }: SearchBarProps) {
  return (
    <div className="flex items-center gap-1.5">
      <label className="flex h-9 w-[238px] items-center gap-2 rounded-full bg-[#eef1f4] px-3.5 text-neutral-500" onClick={onFilterPlaceClick}>
        <MapPin size={16} />
        <input
          type="text"
          placeholder="Tìm theo khu vực"
          className="min-w-0 flex-1 bg-transparent text-neutral-900 outline-none placeholder:text-neutral-500"
        />
      </label>
      <button
        type="button"
        onClick={onFilterClick}
        className="flex h-[34px] items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3.5 hover:bg-neutral-50 cursor-pointer"
      >
        <Filter size={14} />
        <span>Bộ lọc</span>
      </button>
    </div>
  );
}
