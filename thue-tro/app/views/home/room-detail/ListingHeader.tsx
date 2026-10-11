import type { Plan } from "app/data/mock";
import type { ListingDetail } from "app/models/home/listing";
import type { ReactNode } from "react";
import { Link } from "react-router";
import VipBadge from "./VipBadge";
import { cn } from "app/helper/cn";

interface ListingHeaderProps {
  detail: ListingDetail;
  plan?: Plan; // gói tin: quyết định nhãn VIP và màu tiêu đề
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <dt className="text-neutral-500">{label}</dt>
      <dd className="text-neutral-900">{children}</dd>
    </>
  );
}

const linkClass = "text-[#1a5fd1] underline underline-offset-2 hover:no-underline";

export default function ListingHeader({ detail, plan }: ListingHeaderProps) {
  return (
    <header>
      {plan && plan.stars > 0 && (
        <VipBadge label={plan.name} stars={plan.stars} className={plan.headerClass} />
      )}

      <h1 className={cn("mt-2 text-[26px] leading-9", plan?.titleClass ?? "font-bold text-[#1a5fd1]")}>
        {detail.title}
      </h1>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-[22px] font-bold text-[#17b169]">{detail.price}</span>
          <span className="text-neutral-300">•</span>
          <span className="text-[15px] text-neutral-900">{detail.area}</span>
        </div>
        <span className="text-sm text-neutral-700">Cập nhật: {detail.updatedAt}</span>
      </div>

      <dl className="mt-5 grid grid-cols-[110px_1fr] gap-x-3 gap-y-3.5 text-[15px] sm:grid-cols-[130px_1fr]">
        <InfoRow label="Quận huyện:">
          <Link to={detail.district.to} className={linkClass}>
            {detail.district.label}
          </Link>
        </InfoRow>
        <InfoRow label="Tỉnh thành:">
          <Link to={detail.province.to} className={linkClass}>
            {detail.province.label}
          </Link>
        </InfoRow>
        <InfoRow label="Địa chỉ:">{detail.address}</InfoRow>
        <InfoRow label="Mã tin:">{detail.code}</InfoRow>
        <InfoRow label="Ngày đăng:">{detail.postedAt}</InfoRow>
        <InfoRow label="Ngày hết hạn:">{detail.expiresAt}</InfoRow>
      </dl>
    </header>
  );
}
