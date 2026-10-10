import { cn } from "app/helper/cn";
import type { ButtonHTMLAttributes } from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

interface PageButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const baseClass =
  "grid h-[38px] min-w-[38px] place-items-center rounded-md bg-white px-3.5 text-[15px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] transition-colors";

function PageButton({ active, className, ...props }: PageButtonProps) {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      className={cn(
        baseClass,
        active ? "bg-[#ff5722] font-medium text-white" : "hover:bg-neutral-50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

// « Trang trước | 1 2 3 4 | ... | »» | Trang sau »
export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = Math.min(Math.max(page - 1, 1), Math.max(totalPages - 3, 1));
  const end = Math.min(start + 3, totalPages);
  const numbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav aria-label="Phân trang" className="flex flex-wrap justify-center gap-2.5">
      <PageButton disabled={page === 1} onClick={() => onChange(page - 1)}>
        « Trang trước
      </PageButton>

      {start > 1 && (
        <PageButton aria-label="Trang đầu" onClick={() => onChange(1)}>
          ««
        </PageButton>
      )}

      {numbers.map((n) => (
        <PageButton key={n} active={n === page} onClick={() => onChange(n)}>
          {n}
        </PageButton>
      ))}

      {end < totalPages && (
        <>
          <span className={cn(baseClass, "cursor-default")}>…</span>
          <PageButton aria-label="Trang cuối" onClick={() => onChange(totalPages)}>
            »»
          </PageButton>
        </>
      )}

      <PageButton disabled={page === totalPages} onClick={() => onChange(page + 1)}>
        Trang sau »
      </PageButton>
    </nav>
  );
}
