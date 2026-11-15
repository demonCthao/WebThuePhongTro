import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
type ClassValue = string | false | null | undefined;

// Ghép class có điều kiện: cn("a", isActive && "b")
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
