import Modal from "app/components/common/Modal";
import { useState, type FormEvent } from "react";

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  listingCode: string;
}

const REASONS = [
  "Tin không đúng sự thật",
  "Thông tin liên hệ sai hoặc không liên lạc được",
  "Phòng đã cho thuê",
  "Tin trùng lặp",
  "Lý do khác",
];

export default function ReportDialog({ open, onClose, listingCode }: ReportDialogProps) {
  const [reason, setReason] = useState(REASONS[0]);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  const handleClose = () => {
    onClose();
    setSent(false);
    setNote("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: gửi lên API, ví dụ POST /api/reports { listingCode, reason, note }
    console.log("Báo xấu", { listingCode, reason, note });
    setSent(true);
  };

  return (
    <Modal open={open} title={`Báo xấu tin ${listingCode}`} onClose={handleClose}>
      {sent ? (
        <div className="space-y-4 text-center">
          <p className="text-[15px] text-neutral-700">Cảm ơn bạn đã báo cáo. Chúng tôi sẽ kiểm tra tin này sớm nhất.</p>
          <button type="button" onClick={handleClose} className="rounded-lg bg-[#f4511e] px-5 py-2 font-medium text-white hover:brightness-95">
            Đóng
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset className="space-y-2">
            <legend className="sr-only">Lý do báo xấu</legend>
            {REASONS.map((item) => (
              <label key={item} className="flex cursor-pointer items-center gap-2 text-[15px]">
                <input
                  type="radio"
                  name="reason"
                  value={item}
                  checked={reason === item}
                  onChange={() => setReason(item)}
                  className="accent-[#f4511e]"
                />
                {item}
              </label>
            ))}
          </fieldset>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Mô tả thêm (không bắt buộc)"
            className="w-full resize-none rounded-lg border border-neutral-300 p-3 text-[15px] outline-none focus:border-[#f4511e]"
          />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={handleClose} className="rounded-lg border border-neutral-300 px-4 py-2 hover:bg-neutral-50">
              Huỷ
            </button>
            <button type="submit" className="rounded-lg bg-[#f4511e] px-4 py-2 font-medium text-white hover:brightness-95">
              Gửi báo cáo
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
