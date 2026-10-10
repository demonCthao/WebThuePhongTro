type ClassValue = string | false | null | undefined;

// Ghép class có điều kiện: cn("a", isActive && "b")
export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}
