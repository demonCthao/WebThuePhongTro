import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { Building2, DoorOpen, House, Store, Users } from "lucide-react";

import OptionChip from "app/components/common/OptionChip";
import Modal from "app/components/common/Modal";
import SelectField from "app/components/common/SelectField";
import Button from "app/components/common/Button";

import type { FilterValues } from "app/helper/filters";

import {
  AMENITIES,
  AREA_OPTIONS,
  CATEGORIES,
  PRICE_OPTIONS,
  PROVINCES,
  type Category,
  type Option,
} from "app/data/mock";

const CATEGORY_ICONS: Record<
  Category["icon"],
  ComponentType<{ size?: number; strokeWidth?: number }>
> = {
  door: DoorOpen,
  house: House,
  users: Users,
  store: Store,
  building: Building2,
};

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  initial: FilterValues;
  onApply: (values: FilterValues) => void;
}

interface FilterSectionProps {
  title: string;
  children: ReactNode;
}

function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <section className="mt-8 first:mt-0">
      <h3 className="mb-3 text-xl text-neutral-800">{title}</h3>

      {children}
    </section>
  );
}

interface ChipGroupProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  single?: boolean;
}

function ChipGroup({
  options,
  value,
  onChange,
  single = true,
}: ChipGroupProps) {
  const handleClick = (optionValue: string) => {
    if (single) {
      onChange(value.includes(optionValue) ? [] : [optionValue]);
      return;
    }

    const nextValue = value.includes(optionValue)
      ? value.filter((item) => item !== optionValue)
      : [...value, optionValue];

    onChange(nextValue);
  };

  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((option) => (
        <OptionChip
          key={option.value}
          selected={value.includes(option.value)}
          onClick={() => handleClick(option.value)}
        >
          {option.label}
        </OptionChip>
      ))}
    </div>
  );
}

// Chuyển khoảng giá thành giá trị option tương ứng
function getPriceOptionValue(maxPrice: string, minPrice: string): string {
  return (
    PRICE_OPTIONS.find((option) => {
      const params = new URLSearchParams(option.value);

      return (
        (params.get("maxPrice") ?? "") === maxPrice &&
        (params.get("minPrice") ?? "") === minPrice
      );
    })?.value ?? ""
  );
}

// Chuyển giá trị option thành maxPrice và minPrice
function parsePriceOption(value: string) {
  const params = new URLSearchParams(value);

  return {
    maxPrice: params.get("maxPrice") ?? "",
    minPrice: params.get("minPrice") ?? "",
  };
}

export default function FilterModal({
  open,
  onClose,
  initial,
  onApply,
}: FilterModalProps) {
  const [draft, setDraft] = useState<FilterValues>(initial);

  // Đồng bộ dữ liệu filter khi mở modal
  useEffect(() => {
    if (open) {
      setDraft({
        ...initial,
        amenities: [...initial.amenities],
      });
    }
  }, [open, initial]);

  // Cập nhật từng phần filter
  const update = (patch: Partial<FilterValues>) => {
    setDraft((current) => ({
      ...current,
      ...patch,
    }));
  };

  // Danh sách quận huyện theo tỉnh đã chọn
  const districts =
    PROVINCES.find((province) => province.value === draft.province)
      ?.districts ?? [];

  // Xử lý chọn khoảng giá
  const handlePriceChange = (values: string[]) => {
    update(parsePriceOption(values[0] ?? ""));
  };

  // Áp dụng bộ lọc
  const handleApply = () => {
    onApply(draft);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Bộ lọc"
      size="xl"
      footer={
        <Button
          type="button"
          onClick={handleApply}
          className="h-11 text-base font-medium text-white transition-[filter] hover:brightness-95"
        >
          Áp dụng
        </Button>
      }
    >
      {/* Danh mục */}
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

      {/* Khu vực */}
      <FilterSection title="Lọc theo khu vực">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-[176px_176px]">
          <SelectField
            label="Tỉnh thành"
            placeholder="Tất cả"
            value={draft.province}
            options={PROVINCES}
            onChange={(province) =>
              update({
                province,
                district: "",
              })
            }
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

      {/* Khoảng giá */}
      <FilterSection title="Khoảng giá">
        <ChipGroup
          single
          options={PRICE_OPTIONS}
          value={[getPriceOptionValue(draft.maxPrice, draft.minPrice)]}
          onChange={handlePriceChange}
        />
      </FilterSection>

      {/* Khoảng diện tích */}
      <FilterSection title="Khoảng diện tích">
        <ChipGroup
          single
          options={AREA_OPTIONS}
          value={[draft.area]}
          onChange={(areas) =>
            update({
              area: areas[0] ?? "",
            })
          }
        />
      </FilterSection>

      {/* Tiện ích */}
      <FilterSection title="Đặc điểm nổi bật">
        <ChipGroup
          single={false}
          options={AMENITIES}
          value={draft.amenities}
          onChange={(amenities) => update({ amenities })}
        />
      </FilterSection>
    </Modal>
  );
}
