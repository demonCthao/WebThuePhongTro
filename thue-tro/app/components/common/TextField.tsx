import { cn } from "app/helper/cn";
import { useId, type InputHTMLAttributes } from "react";

interface TextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "placeholder"
> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function TextField({
  label,
  value,
  onChange,
  error,
  className,
  ...props
}: TextFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <input
          {...props}
          id={id}
          value={value}
          placeholder=" "
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "peer h-10 w-full rounded-lg border bg-white px-3 py-0",
            "text-sm leading-normal text-neutral-900 outline-none",
            "transition-colors duration-200",
            "placeholder:text-transparent",
            error
              ? "border-red-500 focus:border-red-500"
              : "border-neutral-300 focus:border-[#ff5722]",
          )}
        />

        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-3 top-1/2 z-10",
            "-translate-y-1/2 origin-left",
            "bg-white px-1 text-sm text-neutral-500",
            "transition-all duration-200",

            // Focus
            "peer-focus:top-0",
            "peer-focus:-translate-y-[60%]",
            "peer-focus:scale-90",
            "peer-focus:text-[#ff5722]",

            // Has value
            "peer-[:not(:placeholder-shown)]:top-0",
            "peer-[:not(:placeholder-shown)]:-translate-y-[60%]",
            "peer-[:not(:placeholder-shown)]:scale-90",
          )}
        >
          {label}
        </label>
      </div>

      {error && (
        <p id={errorId} role="alert" className="mt-1 px-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
