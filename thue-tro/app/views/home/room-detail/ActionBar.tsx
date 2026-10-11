import { useState, type ReactNode } from "react";
import { Heart, Share2, TriangleAlert } from "lucide-react";
import ReportDialog from "./ReportDialog";

interface ActionBarProps {
  title: string;
  listingCode: string;
}

interface ActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  pressed?: boolean;
}

function ActionButton({ icon, label, onClick, pressed }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className="flex items-center gap-2 text-[15px] text-neutral-900 transition-colors hover:text-[#f4511e]"
    >
      {icon}
      {label}
    </button>
  );
}

// Lưu tin | Chia sẻ | Báo xấu
export default function ActionBar({ title, listingCode }: ActionBarProps) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url }); // điện thoại: mở bảng chia sẻ của hệ điều hành
        return;
      }
      await navigator.clipboard.writeText(url); // máy tính: sao chép liên kết
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // người dùng huỷ chia sẻ hoặc trình duyệt chặn clipboard
    }
  };

  return (
    <>
      <div className="flex items-center justify-around">
        <ActionButton
          icon={<Heart size={20} fill={saved ? "#f4511e" : "none"} className={saved ? "text-[#f4511e]" : ""} />}
          label={saved ? "Đã lưu" : "Lưu tin"}
          pressed={saved}
          onClick={() => setSaved((v) => !v)}
        />
        <ActionButton icon={<Share2 size={20} />} label={copied ? "Đã sao chép" : "Chia sẻ"} onClick={handleShare} />
        <ActionButton icon={<TriangleAlert size={20} />} label="Báo xấu" onClick={() => setReportOpen(true)} />
      </div>

      <ReportDialog open={reportOpen} onClose={() => setReportOpen(false)} listingCode={listingCode} />
    </>
  );
}
