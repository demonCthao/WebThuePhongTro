import { MessageCircle, ChevronUp } from "lucide-react";

const buttonClass =
  "grid size-10 place-items-center rounded-full bg-white text-[#f4511e] shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:bg-neutral-50";

interface FloatingActionsProps {
  onChatClick?: () => void;
}

export default function FloatingActions({ onChatClick }: FloatingActionsProps) {
  return (
    <div className="fixed bottom-16 right-5 z-40 flex flex-col gap-2">
      <button type="button" aria-label="Chat" onClick={onChatClick} className={buttonClass}>
        <MessageCircle size={20} />
      </button>
      <button
        type="button"
        aria-label="Lên đầu trang"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={buttonClass}
      >
        <ChevronUp size={22} />
      </button>
    </div>
  );
}
