import { CalendarCheck } from "lucide-react";

interface BookingButtonProps {
    onClick: () => void;
}

export default function BookingButton({ onClick }: BookingButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
        flex h-11 w-full items-center justify-center gap-2
        rounded-xl bg-[#ff5722] px-4
        text-sm font-semibold text-white
        shadow-sm transition-all duration-200
        hover:bg-[#e64d1d] hover:shadow-md
        active:scale-[0.98]
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-[#ff5722] focus-visible:ring-offset-2 cursor-pointer
      "
        >
            <CalendarCheck size={18} />
            Đặt lịch xem phòng
        </button>
    );
}
