import { useState } from "react";
import PricingTable from "./PricingTable";
import { VAT_RATE } from "app/helper/price";
import Switch from "app/components/common/Switch";

export default function PricingView() {
  const [includeVat, setIncludeVat] = useState(true);
  const vatLabel = `Giá bao gồm ${Math.round(VAT_RATE * 100)}% VAT`;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1300px] px-4 py-8">
        <h1 className="sr-only">Bảng giá dịch vụ</h1>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-base text-neutral-500">{vatLabel}</span>
          <Switch checked={includeVat} onChange={setIncludeVat} label={vatLabel} />
        </div>

        {/* Màn hình nhỏ: bảng cuộn ngang thay vì bị bóp méo */}
        <div className="overflow-x-auto">
          <PricingTable includeVat={includeVat} />
        </div>
      </div>
    </div>
  );
}
