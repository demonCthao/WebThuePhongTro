import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "app/helper/cn";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode; // cố định ở đáy, thân modal cuộn riêng
  size?: "md" | "lg";
}

// Dùng thẻ <dialog> gốc: tự khoá cuộn nền, tự xử lý phím Esc và focus
export default function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  size = "md",
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose(); // bấm ra ngoài thì đóng
      }}
      className={cn(
        "m-auto rounded-xl p-0 shadow-xl backdrop:bg-black/50",
        size === "lg" ? "w-[min(600px,94vw)]" : "w-[min(480px,92vw)]",
      )}
    >
      <div className="flex max-h-[90vh] flex-col">
        <div className="flex shrink-0 items-center justify-between px-6 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl text-neutral-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="text-neutral-700 hover:text-neutral-900 cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {open ? children : null}
        </div>

        {open && footer && (
          <div className="shrink-0 border-t border-neutral-100 p-4">
            {footer}
          </div>
        )}
      </div>
    </dialog>
  );
}
