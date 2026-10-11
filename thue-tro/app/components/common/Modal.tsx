import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

// Dùng thẻ <dialog> gốc: tự khoá cuộn nền, tự xử lý phím Esc và focus
export default function Modal({ open, title, onClose, children }: ModalProps) {
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
      className="m-auto w-[min(480px,92vw)] rounded-xl p-0 shadow-xl backdrop:bg-black/50"
    >
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-neutral-900">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Đóng" className="text-neutral-500 hover:text-neutral-900">
            <X size={20} />
          </button>
        </div>
        {open ? children : null}
      </div>
    </dialog>
  );
}
