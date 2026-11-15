import { LIST_ROOMS_ROUTE } from "app/const/router";
import { PLANS } from "app/data/mock";
import { cn } from "app/helper/cn";
import { formatDate } from "app/helper/date";
import { formatPrice } from "app/helper/price";
import type { Rooms } from "app/types/prisma-models";
import type { ReactNode } from "react";
import { Link } from "react-router";
import VipBadge from "./VipBadge";

interface ListingHeaderProps {
  detail?: Rooms;
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <dt className="text-neutral-500">{label}</dt>
      <dd className="text-neutral-900">{children}</dd>
    </>
  );
}

const linkClass =
  "text-[#1a5fd1] underline underline-offset-2 hover:no-underline";

export default function ListingHeader({ detail }: ListingHeaderProps) {
  const plan = PLANS.find(p => p.stars === detail?.vip_level)?? PLANS[5]

  return (
    <header>
      {plan && <VipBadge label={plan?.name} stars={plan.stars} className={plan.headerClass} />}
      <h1 className={cn("mt-2 text-[26px] leading-9", plan?.titleClass ?? "font-bold text-[#1a5fd1]")}>
        {detail?.title}
      </h1>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-[22px] font-bold text-[#17b169]">
            {formatPrice(Number(detail?.price_monthly ?? 0))}
          </span>
          <span className="text-neutral-300">•</span>
          <span className="text-[15px] text-neutral-900">
            {detail?.street_address}, {detail?.wards?.full_name},{" "}
            {detail?.provinces?.full_name}
          </span>
        </div>
        <span className="text-sm text-neutral-700">
          Cập nhật: {formatDate(detail?.created_at ?? "", "datetime")}
        </span>
      </div>

      <dl className="mt-5 grid grid-cols-[110px_1fr] gap-x-3 gap-y-3.5 text-[15px] sm:grid-cols-[130px_1fr]">
        <InfoRow label="Phường:">
          <Link to={`${LIST_ROOMS_ROUTE}?ward=${detail?.wards?.code}`} className={linkClass}>
            {detail?.wards?.full_name}
          </Link>
        </InfoRow>
        <InfoRow label="Tỉnh thành:">
          <Link to={`${LIST_ROOMS_ROUTE}?province=${detail?.provinces?.code}`} className={linkClass}>
            {detail?.provinces?.full_name}
          </Link>
        </InfoRow>
        <InfoRow label="Địa chỉ:">
          {detail?.street_address}, {detail?.wards?.full_name},{" "}
          {detail?.provinces?.full_name}
        </InfoRow>
        <InfoRow label="Ngày đăng:">
          {formatDate(detail?.created_at ?? "", "datetime")}
        </InfoRow>
        <InfoRow label="Ngày hết hạn:">
          {formatDate(detail?.expires_at ?? "", "datetime")}
        </InfoRow>
      </dl>
    </header>
  );
}
