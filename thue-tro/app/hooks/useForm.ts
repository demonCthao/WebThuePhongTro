import { useState } from "react";

type Errors<T> = Partial<Record<keyof T, string>>;

// Quản lý giá trị + lỗi của form. `validate` chỉ trả về các trường bị lỗi.
export function useForm<T extends Record<string, string>>(
  initial: T,
  validate: (values: T) => Errors<T>
) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Errors<T>>({});

  // Gõ lại thì xoá lỗi của chính trường đó
  const setField = (name: keyof T, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  // Kiểm tra 1 trường khi rời khỏi ô nhập (onBlur)
  const validateField = (name: keyof T) => {
    const message = validate(values)[name];
    setErrors((e) => ({ ...e, [name]: message }));
  };

  // Kiểm tra toàn bộ khi bấm gửi; true nếu hợp lệ
  const validateAll = () => {
    const next = validate(values);
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  return { values, errors, setField, validateField, validateAll };
}
