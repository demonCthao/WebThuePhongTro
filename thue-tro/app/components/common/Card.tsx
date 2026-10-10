import { cn } from "app/helper/cn";
import type { ComponentPropsWithoutRef } from "react";

export default function Card({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "rounded-lg bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]",
        className,
      )}
      {...props}
    />
  );
}
