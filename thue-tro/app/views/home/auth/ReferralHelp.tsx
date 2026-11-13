import Modal from "app/components/common/Modal";
import { useState } from "react";

// Dòng "Tìm hiểu thêm" dưới ô số điện thoại người giới thiệu; bấm thì mở giải thích ngắn
export default function ReferralHelp() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-1.5 flex items-center gap-1.5 text-md italic text-[#1a5fd1] hover:underline"
      >
        <span
          aria-hidden="true"
          className="grid size-[18px] place-items-center rounded-full border border-neutral-900 text-[11px] font-bold not-italic leading-none text-neutral-900"
        >
          ?
        </span>
        Tìm hiểu thêm
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Người giới thiệu">
        <p className="text-[15px] leading-7 text-neutral-800">
          Nếu bạn được người quen giới thiệu, hãy nhập số điện thoại của họ vào ô này. Thông tin này không bắt buộc,
          bạn có thể bỏ trống và vẫn tạo tài khoản bình thường.
        </p>
      </Modal>
    </>
  );
}
