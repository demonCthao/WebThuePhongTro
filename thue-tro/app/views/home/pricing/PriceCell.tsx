import { applyDiscount, formatVnd, priceWithVat } from "app/helper/price";

interface PriceCellProps {
  base: number; // giá chưa VAT
  includeVat: boolean;
  discountPercent?: number; // có thì hiện giá gốc gạch ngang + nhãn "Giảm x%"
}

export default function PriceCell({ base, includeVat, discountPercent }: PriceCellProps) {
  if (!discountPercent) {
    return <span className="font-semibold">{formatVnd(priceWithVat(base, includeVat))}</span>;
  }

  const original = priceWithVat(base, includeVat);
  const sale = priceWithVat(applyDiscount(base, discountPercent), includeVat);

  return (
    <div className="flex flex-col items-center leading-tight">
      <s className="text-sm text-neutral-400">{formatVnd(original)}</s>
      <span className="my-1 text-xs text-[#2ca34a]">Giảm {discountPercent}%</span>
      <span className="font-semibold">{formatVnd(sale)}</span>
    </div>
  );
}
