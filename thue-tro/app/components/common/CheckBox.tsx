export function Checkbox({ checked }: { checked: boolean }) {
    return (
        <span
            aria-hidden
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border transition-colors ${
                checked
                    ? "border-[#ff5a1f] bg-[#ff5a1f]"
                    : "border-gray-500 bg-white"
            }`}
        >
            {checked && (
                <svg
                    viewBox="0 0 12 12"
                    className="h-3 w-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M2.5 6.2 5 8.7l4.5-5" />
                </svg>
            )}
        </span>
    );
}
