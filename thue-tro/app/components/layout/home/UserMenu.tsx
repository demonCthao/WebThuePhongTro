import { Heart, FolderOpen, User, ChevronDown, SquarePen } from "lucide-react";

interface UserMenuProps {
  userName: string;
  avatarUrl?: string;
}

export default function UserMenu({ userName, avatarUrl }: UserMenuProps) {
  return (
    <div className="flex items-center gap-[26px]">
      <a href="/tin-da-luu" className="flex items-center gap-1.5 hover:text-[#f4511e]">
        <Heart size={18} />
        <span>Tin đã lưu</span>
      </a>

      <a href="/quan-ly" className="flex items-center gap-1.5 hover:text-[#f4511e]">
        <FolderOpen size={18} />
        <span>Quản lý</span>
      </a>

      <button type="button" className="flex items-center gap-1.5">
        <span className="grid size-8 place-items-center overflow-hidden rounded-full bg-[#eef1f4] text-neutral-400">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="size-full object-cover" />
          ) : (
            <User size={16} />
          )}
        </span>
        <span>{userName}</span>
        <ChevronDown size={14} />
      </button>

      <a
        href="/dang-tin"
        className="flex h-[34px] items-center gap-2 rounded-lg bg-[#f4511e] px-3.5 font-semibold text-white hover:brightness-95"
      >
        <SquarePen size={16} />
        <span>Đăng tin miễn phí</span>
      </a>
    </div>
  );
}
