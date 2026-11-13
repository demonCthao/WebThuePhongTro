import { Checkbox } from "app/components/common/CheckBox";
import type { Provinces, Wards } from "app/types/prisma-models";
import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ kiểu dữ liệu */

/** Giá trị khu vực: chỉ 1 tỉnh và (tuỳ chọn) 1 xã/phường thuộc tỉnh đó. */
export interface RegionValue {
  province: Provinces | null; // null = Toàn quốc
  ward: Wards | null; // null = tất cả xã/phường của tỉnh
}

export const EMPTY_REGION: RegionValue = { province: null, ward: null };

/**
 * Chỗ DUY NHẤT cần sửa nếu tên field Prisma của bạn khác.
 * Mặc định theo schema MySQL: wards.full_name ("Phường Ba Đình"), provinces.name ("Hà Nội").
 * Nếu Prisma map sang camelCase thì đổi `w.full_name` thành `w.fullName`.
 */
const provinceLabel = (p: Provinces) => p.name;
const wardLabel = (w: Wards) => w.full_name;

/** "Phường Ba Đình, Hà Nội" | "Hà Nội" | "Toàn quốc" */
export function formatRegion(v: RegionValue): string {
  if (!v.province) return "Toàn quốc";
  const province = provinceLabel(v.province);
  return v.ward ? `${wardLabel(v.ward)}, ${province}` : province;
}

/* ------------------------------------------------------------------ icon & ô nhập */

const ORANGE = "#ff5a1f";

function ChevronRight() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill="none"
      stroke={ORANGE}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m7.5 4 6 6-6 6" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 shrink-0"
      fill={ORANGE}
      aria-hidden
    >
      <path d="M10 1.5a6 6 0 0 0-6 6c0 4.2 5.1 10.2 5.4 10.5a.8.8 0 0 0 1.2 0C10.9 17.7 16 11.7 16 7.5a6 6 0 0 0-6-6Zm0 8.3a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6Z" />
    </svg>
  );
}

/** Ô hiển thị khu vực đã chọn (bấm để mở dialog). */
export function RegionInput({
  value,
  label,
  onClick,
  className = "",
}: {
  /** Truyền `label` (ví dụ lấy từ store) hoặc `value`; có `label` thì ưu tiên `label`. */
  value?: RegionValue;
  label?: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex max-w-full items-center gap-2 rounded-full bg-[#f1f5f5] px-4 py-2.5 text-left text-sm text-[#ff5a1f] outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a1f]/50 ${className}`}
    >
      <PinIcon />
      <span className="truncate">
        {label ?? (value ? formatRegion(value) : "Toàn quốc")}
      </span>
    </button>
  );
}

interface RowProps {
  label: string;
  checked: boolean;
  onSelect: () => void;
  /** Có onOpen thì hiện mũi tên ">" bên phải. */
  onOpen?: () => void;
  openLabel?: string;
}

function Row({ label, checked, onSelect, onOpen, openLabel }: RowProps) {
  return (
    <li className="flex h-11 items-center border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={onSelect}
        className={`flex h-full flex-1 items-center gap-3 text-left text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a1f]/50 ${
          checked ? "text-[#ff5a1f]" : "text-gray-800"
        }`}
      >
        <Checkbox checked={checked} />
        <span className="truncate">{label}</span>
      </button>
      {onOpen && (
        <button
          type="button"
          onClick={onOpen}
          aria-label={openLabel}
          className="flex h-full w-10 items-center justify-end outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a1f]/50"
        >
          <ChevronRight />
        </button>
      )}
    </li>
  );
}

/* ------------------------------------------------------------------ dialog */

interface RegionDialogProps {
  open: boolean;
  onClose: () => void;
  value: RegionValue;
  /** Gọi khi người dùng chốt lựa chọn (dialog tự đóng ngay sau đó). */
  onChange: (value: RegionValue) => void;
  provinces?: Provinces[];
  /**
   * Danh sách xã/phường của tỉnh đang xem (tỉnh vừa bấm mũi tên).
   * Cha cần tải khi nhận `onProvinceOpen` và truyền vào đây.
   */
  wards?: Wards[];
  /** true trong lúc cha đang tải xã/phường -> dialog hiện khung chờ thay vì danh sách cũ. */
  wardsLoading?: boolean;
  /** Bấm mũi tên ">" của một tỉnh: cha tải xã/phường của tỉnh đó. */
  onProvinceOpen?: (province: Provinces) => void;
}

export default function RegionDialog({
  open,
  onClose,
  value,
  onChange,
  provinces = [],
  wards = [],
  wardsLoading = false,
  onProvinceOpen,
}: RegionDialogProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  /** Tỉnh đang xem danh sách xã/phường; null = đang ở bước chọn tỉnh. */
  const [browsing, setBrowsing] = useState<Provinces | null>(null);

  // Mỗi lần mở lại dialog luôn bắt đầu ở bước chọn tỉnh
  useEffect(() => {
    if (open) setBrowsing(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const commit = (next: RegionValue) => {
    onChange(next);
    onClose();
  };

  const openProvince = (p: Provinces) => {
    setBrowsing(p);
    onProvinceOpen?.(p);
  };

  const sameProvince = !!browsing && value.province?.code === browsing.code;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="region-dialog-title"
        className="flex max-h-full w-full max-w-[620px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ height: 720 }}
      >
        {/* Header */}
        <div className="relative z-10 flex shrink-0 items-center justify-between py-5 pl-8 pr-6 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
          <div className="flex min-w-0 items-center gap-4">
            {browsing && (
              <button
                type="button"
                onClick={() => setBrowsing(null)}
                aria-label="Quay lại danh sách tỉnh"
                className="-ml-1 rounded-full p-1 text-gray-900 outline-none hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-[#ff5a1f]/50"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M20 12H4m6-6-6 6 6 6" />
                </svg>
              </button>
            )}
            <h2
              id="region-dialog-title"
              className="truncate text-xl font-normal text-gray-800"
            >
              {browsing ? provinceLabel(browsing) : "Tìm theo khu vực"}
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-full p-2 text-gray-900 outline-none hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-[#ff5a1f]/50"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M5 5l14 14M19 5 5 19" />
            </svg>
          </button>
        </div>

        {/* Nội dung (key để reset vị trí cuộn khi đổi bước) */}
        <div
          key={browsing?.code ?? "provinces"}
          className="min-h-0 flex-1 overflow-y-auto px-8 pb-2 pt-3
            [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400"
        >
          {/* Bước 1: chọn tỉnh (chỉ 1 tỉnh) */}
          {!browsing && (
            <ul>
              <Row
                label="Toàn quốc"
                checked={!value.province}
                onSelect={() => commit(EMPTY_REGION)}
              />
              {provinces.map((p) => (
                <Row
                  key={p.code}
                  label={provinceLabel(p)}
                  checked={value.province?.code === p.code}
                  // chọn tỉnh: chỉ giữ 1 tỉnh, bỏ xã/phường cũ (nếu có)
                  onSelect={() => commit({ province: p, ward: null })}
                  onOpen={() => openProvince(p)}
                  openLabel={`Chọn xã/phường của ${provinceLabel(p)}`}
                />
              ))}
            </ul>
          )}

          {/* Bước 2: chọn xã/phường của tỉnh vừa bấm mũi tên */}
          {browsing && wardsLoading && (
            <ul aria-busy="true" aria-label="Đang tải">
              {Array.from({ length: 10 }).map((_, i) => (
                <li
                  key={i}
                  className="flex h-11 items-center gap-3 border-b border-gray-200 last:border-b-0"
                >
                  <span className="h-4 w-4 rounded-[3px] bg-gray-200" />
                  <span
                    className="h-3 rounded bg-gray-200"
                    style={{ width: `${40 + ((i * 17) % 35)}%` }}
                  />
                </li>
              ))}
            </ul>
          )}

          {browsing && !wardsLoading && (
            <ul>
              <Row
                label="Tất cả"
                checked={sameProvince && !value.ward}
                onSelect={() => commit({ province: browsing, ward: null })}
              />
              {wards.map((w) => (
                <Row
                  key={w.code}
                  label={wardLabel(w)}
                  checked={sameProvince && value.ward?.code === w.code}
                  onSelect={() => commit({ province: browsing, ward: w })}
                />
              ))}
              {wards.length === 0 && (
                <li className="py-10 text-center text-[15px] text-gray-500">
                  Chưa có dữ liệu xã/phường.
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ ví dụ dùng */

/**
 * Ví dụ ghép ô nhập + dialog. Cha chịu trách nhiệm tải xã/phường:
 *
 *   const [wards, setWards] = useState<Wards[]>([]);
 *   const [loading, setLoading] = useState(false);
 *   const loadWards = async (p: Provinces) => {
 *     setWards([]); setLoading(true);
 *     setWards(await fetch(`/api/wards?province=${p.code}`).then(r => r.json()));
 *     setLoading(false);
 *   };
 *   <RegionPicker provinces={provinces} wards={wards} wardsLoading={loading} onProvinceOpen={loadWards} />
 *
 * (Với React Router/Remix có thể dùng useFetcher thay cho fetch.)
 */
export function RegionPicker({
  provinces = [],
  wards = [],
  wardsLoading = false,
  onProvinceOpen,
  onRegionChange,
}: {
  provinces?: Provinces[];
  wards?: Wards[];
  wardsLoading?: boolean;
  onProvinceOpen?: (province: Provinces) => void;
  /** Gọi mỗi khi khu vực thay đổi, ví dụ để cập nhật bộ lọc tìm phòng. */
  onRegionChange?: (value: RegionValue) => void;
}) {
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState<RegionValue>(EMPTY_REGION);

  return (
    <>
      <RegionInput value={region} onClick={() => setOpen(true)} />
      <RegionDialog
        open={open}
        onClose={() => setOpen(false)}
        value={region}
        onChange={(v) => {
          setRegion(v);
          onRegionChange?.(v);
        }}
        provinces={provinces}
        wards={wards}
        wardsLoading={wardsLoading}
        onProvinceOpen={onProvinceOpen}
      />
    </>
  );
}
