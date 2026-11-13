export const MIN_PASSWORD_LENGTH = 8; // khớp với API NestJS

// Số điện thoại di động VN: 10 số, bắt đầu bằng 0
export const isValidPhone = (value: string) => /^0\d{9}$/.test(value);

// Email: đúng định dạng tên@domain.com
export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// Chỉ cho phép quay lại đường dẫn trong site (chặn ?redirect=https://trang-khac.com)
export function safeRedirectPath(value: string | null): string {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return "/";
}
