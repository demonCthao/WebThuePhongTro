import type { ReactNode } from "react";
import { ShoppingBag } from "lucide-react";
import { cn } from "app/helper/cn";

interface Method {
  name: string;
  className: string;
  content: ReactNode;
}

// Badge vẽ bằng CSS cho nhanh, có logo thật thì thay content bằng <img />
const METHODS: Method[] = [
  {
    name: "Visa",
    className: "bg-white",
    content: <span className="text-xl font-black italic text-[#1a1f71]">VISA</span>,
  },
  {
    name: "Mastercard",
    className: "bg-white",
    content: (
      <span className="relative block h-6 w-9">
        <span className="absolute left-0 size-6 rounded-full bg-[#eb001b]" />
        <span className="absolute right-0 size-6 rounded-full bg-[#f79e1b]/90" />
      </span>
    ),
  },
  {
    name: "JCB",
    className: "bg-white",
    content: <span className="text-lg font-extrabold tracking-wide text-[#0b4ea2]">JCB</span>,
  },
  {
    name: "MoMo",
    className: "bg-[#c8105f] text-white",
    content: (
      <span className="text-center text-xs font-extrabold leading-[11px]">
        mo
        <br />
        mo
      </span>
    ),
  },
  {
    name: "ZaloPay",
    className: "bg-white",
    content: (
      <span className="text-center text-[11px] font-bold leading-3 text-[#0068ff]">
        Zalo
        <br />
        <span className="text-[#00b14f]">pay</span>
      </span>
    ),
  },
  {
    name: "ShopeePay",
    className: "bg-[#f05d2a] text-white",
    content: (
      <span className="flex items-center gap-1 text-xs font-bold">
        <ShoppingBag size={16} />
        Pay
      </span>
    ),
  },
];

export default function PaymentMethods() {
  return (
    <ul className="grid max-w-[215px] grid-cols-3 gap-1.5">
      {METHODS.map((method) => (
        <li
          key={method.name}
          title={method.name}
          className={cn("grid h-[37px] place-items-center rounded-md", method.className)}
        >
          {method.content}
        </li>
      ))}
    </ul>
  );
}
