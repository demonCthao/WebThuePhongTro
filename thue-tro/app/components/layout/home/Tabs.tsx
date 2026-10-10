import { cn } from "app/helper/cn";

export interface TabItem<T extends string = string> {
  key: T;
  label: string;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (key: T) => void;
}

export default function Tabs<T extends string>({ items, value, onChange }: TabsProps<T>) {
  return (
    <div role="tablist" className="flex gap-5">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.key)}
            className={cn(
              "border-b-2 pb-1.5 text-[15px] transition-colors",
              active
                ? "border-neutral-900 font-medium text-neutral-900"
                : "border-transparent text-neutral-700 hover:text-neutral-900"
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
