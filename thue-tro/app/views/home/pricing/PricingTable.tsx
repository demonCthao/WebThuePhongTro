import StarRating from "app/components/layout/home/StarRating";
import { FEATURE_ROWS, PLANS } from "app/data/mock";
import { cn } from "app/helper/cn";
import PriceCell from "./PriceCell";
import PlanRow from "./PlanRow";
import CheckBadge from "../../../components/common/CheckBadge";


interface PricingTableProps {
  includeVat: boolean;
}

export default function PricingTable({ includeVat }: PricingTableProps) {
  return (
    <table className="w-full min-w-[960px] border-collapse border border-neutral-200">
      <thead>
        <tr>
          <th className="w-[20%] border border-neutral-200 bg-[#f7f7f7]" />
          {PLANS.map((plan) => (
            <th
              key={plan.id}
              scope="col"
              className={cn("h-20 border border-white/20 px-3 text-center align-middle text-white", plan.headerClass)}
            >
              <div className="text-[17px] font-bold">{plan.name}</div>
              {plan.stars > 0 && (
                <div className="mt-1">
                  <StarRating count={plan.stars} size={14} />
                </div>
              )}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        <PlanRow
          label="Giá 5 ngày"
          plans={PLANS}
          render={(p) => <PriceCell base={p.prices.d5} includeVat={includeVat} />}
        />
        <PlanRow
          label="Giá 10 ngày"
          plans={PLANS}
          render={(p) => <PriceCell base={p.prices.d10} includeVat={includeVat} />}
        />
        <PlanRow
          label="Giá 15 ngày"
          plans={PLANS}
          render={(p) => <PriceCell base={p.prices.d15} includeVat={includeVat} />}
        />
        <PlanRow
          label="Giá 30 ngày"
          plans={PLANS}
          render={(p) => (
            <PriceCell base={p.prices.d30} includeVat={includeVat} discountPercent={p.discount30} />
          )}
        />
        <PlanRow
          label="Giá đẩy tin"
          plans={PLANS}
          render={(p) => <PriceCell base={p.prices.push} includeVat={includeVat} />}
        />

        <PlanRow
          label="Màu sắc tiêu đề"
          plans={PLANS}
          render={(p) => <span className={p.titleClass}>{p.titleStyle}</span>}
        />
        <PlanRow
          label="Kích thước tin"
          plans={PLANS}
          render={(p) => <span className="text-neutral-700">{p.size}</span>}
        />

        {FEATURE_ROWS.map((row) => (
          <PlanRow
            key={row.key}
            label={row.label}
            plans={PLANS}
            render={(p) => <CheckBadge checked={p.features[row.key]} />}
          />
        ))}
      </tbody>
    </table>
  );
}
