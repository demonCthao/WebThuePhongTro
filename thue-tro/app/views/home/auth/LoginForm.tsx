import Button from "app/components/common/Button";
import TextField from "app/components/common/TextField";
import { saveSession } from "app/helper/auth-storage";
import { isValidPhone } from "app/helper/validators";
import { useForm } from "app/hooks/useForm";
import { useMutationRequest } from "app/hooks/useMutation";
import type { ApiError } from "app/types/api-error";
import type { AuthSession } from "app/types/auth";
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";

type LoginValues = { phone: string; password: string };

function validate(values: LoginValues) {
  const errors: Partial<Record<keyof LoginValues, string>> = {};
  if (!values.phone) errors.phone = "Vui lòng nhập số điện thoại";
  else if (!isValidPhone(values.phone))
    errors.phone = "Số điện thoại gồm 10 số và bắt đầu bằng 0";
  if (!values.password) errors.password = "Vui lòng nhập mật khẩu";
  return errors;
}

interface LoginFormProps {
  redirectTo: string; // trang quay lại sau khi đăng nhập
}

export default function LoginForm({ redirectTo }: LoginFormProps) {
  console.log("🚀 ~ LoginForm ~ redirectTo:", redirectTo)
  const navigate = useNavigate();
  const { search } = useLocation();
  const { values, errors, setField, validateField, validateAll } =
    useForm<LoginValues>({ phone: "", password: "" }, validate);
  const [formError, setFormError] = useState("");

  const { mutate, isPending } = useMutationRequest({
    key: ["users/login"],
    url: `users/login`,
    method: "post",
    options: {
      onSuccess: (data: AuthSession) => {
        saveSession(data);
        navigate(redirectTo);
      },
      onError: (error: ApiError) => {
        setFormError(error.message?? "");
      },
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    setFormError("");
    try {
      mutate({
        username: values.phone,
        password: values.password,
      });
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <TextField
        label="Số điện thoại"
        type="tel"
        name="phone"
        inputMode="numeric"
        autoComplete="tel"
        autoFocus
        value={values.phone}
        onChange={(v) => setField("phone", v.replace(/\D/g, "").slice(0, 10))}
        onBlur={() => validateField("phone")}
        error={errors.phone}
      />
      <TextField
        label="Mật khẩu"
        type="password"
        name="password"
        autoComplete="current-password"
        value={values.password}
        onChange={(v) => setField("password", v)}
        onBlur={() => validateField("password")}
        error={errors.password}
      />

      <div className="-mt-1 text-right">
        <Link
          to="/quen-mat-khau"
          className="text-sm text-[#1a5fd1] underline underline-offset-2 hover:no-underline"
        >
          Bạn quên mật khẩu?
        </Link>
      </div>

      {formError && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {formError}
        </p>
      )}

      <Button type="submit" loading={isPending}>
        Đăng nhập
      </Button>
    </form>
  );
}
