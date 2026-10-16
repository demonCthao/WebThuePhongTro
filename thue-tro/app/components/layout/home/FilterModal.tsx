import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { Building2, DoorOpen, House, Store, Users } from "lucide-react";
import OptionChip from "app/components/common/OptionChip";
import Modal from "app/components/common/Modal";
import SelectField from "app/components/common/SelectField";
import type { FilterValues } from "app/helper/filters";
import { AREA_OPTIONS, CATEGORIES, PRICE_OPTIONS, PROVINCES, type Category, type Option } from "app/data/mock";

const CATEGORY_ICONS: Record<Category["icon"], ComponentType<{ size?: number; strokeWidth?: number }>> = {
  door: DoorOpen,
  house: House,
  users: Users,
  store: Store,
  building: Building2,
};

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  initial: FilterValues; // bộ lọc đang áp dụng (lấy từ URL)
  onApply: (values: FilterValues) => void;
}

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h3 className="mb-3 text-xl text-neutral-800">{title}</h3>
      {children}
    </section>
  );
}

function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((option) => (
        <OptionChip key={option.value} selected={value === option.value} onClick={() => onChange(option.value)}>
          {option.label}
        </OptionChip>
      ))}
    </div>
  );
}

export default function FilterModal({ open, onClose, initial, onApply }: FilterModalProps) {
  const [draft, setDraft] = useState(initial);

  // Mỗi lần mở lại thì nạp bộ lọc đang áp dụng; đóng mà không bấm "Áp dụng" thì bỏ thay đổi
  useEffect(() => {
    if (open) setDraft(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const update = (patch: Partial<FilterValues>) => setDraft((d) => ({ ...d, ...patch }));
  const districts = PROVINCES.find((p) => p.value === draft.province)?.districts ?? [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Bộ lọc"
      size="lg"
      footer={
        <button
          type="button"
          onClick={() => onApply(draft)}
          className="h-11 w-full rounded-full bg-[#ff5722] text-base font-medium text-white transition-[filter] hover:brightness-95"
        >
          Áp dụng
        </button>
      }
    >
      <FilterSection title="Danh mục cho thuê">
        <div className="flex flex-wrap gap-2.5">
          {CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category.icon];
            return (
              <OptionChip
                key={category.value}
                selected={draft.category === category.value}
                onClick={() => update({ category: category.value })}
                icon={<Icon size={20} strokeWidth={1.5} />}
              >
                {category.label}
              </OptionChip>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Lọc theo khu vực">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-[176px_176px]">
          <SelectField
            label="Tỉnh thành"
            placeholder="Tất cả"
            value={draft.province}
            options={PROVINCES}
            // đổi tỉnh thì quận cũ không còn đúng nên xoá đi
            onChange={(province) => update({ province, district: "" })}
          />
          <SelectField
            label="Quận huyện"
            placeholder="Tất cả"
            value={draft.district}
            options={districts}
            disabled={!draft.province}
            onChange={(district) => update({ district })}
          />
        </div>
      </FilterSection>

      <FilterSection title="Khoảng giá">
        <ChipGroup options={PRICE_OPTIONS} value={draft.price} onChange={(price) => update({ price })} />
      </FilterSection>

      <FilterSection title="Khoảng diện tích">
        <ChipGroup options={AREA_OPTIONS} value={draft.area} onChange={(area) => update({ area })} />
      </FilterSection>
    </Modal>
  );
}
