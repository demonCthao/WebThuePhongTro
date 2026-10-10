import type { Plan } from "app/data/mock";
import type { ReactNode } from "react";

interface PlanRowProps {
  label: string;
  plans: Plan[];
  render: (plan: Plan) => ReactNode; // nội dung ô cho từng gói
}

// Một dòng của bảng: ô nhãn bên trái + 1 ô cho mỗi gói
export default function PlanRow({ label, plans, render }: PlanRowProps) {
  return (
    <tr>
      <th
        scope="row"
        className="border border-neutral-200 bg-[#f7f7f7] px-4 py-3 text-left text-base font-normal text-neutral-600"
      >
        {label}
      </th>
      {plans.map((plan) => (
        <td
          key={plan.id}
          className="border border-neutral-200 px-3 py-3 text-center text-base text-neutral-900"
        >
          {render(plan)}
        </td>
      ))}
    </tr>
  );
}
