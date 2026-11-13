import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Gift } from "lucide-react";
import ReferralHelp from "./ReferralHelp";
import { isValidEmail, isValidPhone, MIN_PASSWORD_LENGTH } from "app/helper/validators";
import TextField from "app/components/common/TextField";
import Button from "app/components/common/Button";
import { useForm } from "app/hooks/useForm";
import { useMutationRequest } from "app/hooks/useMutation";
import type { AuthSession } from "app/types/auth";
import { saveSession } from "app/helper/auth-storage";
import type { ApiError } from "app/types/api-error";

type RegisterValues = {
  fullName: string;
  phone: string;
  password: string;
  email: string;
};

const ACCOUNT_TYPES = [
  { value: "seeker", label: "Tìm kiếm" },
  { value: "owner", label: "Chính chủ" },
  { value: "broker", label: "Môi giới" },
];

function validate(values: RegisterValues) {
  const errors: Partial<Record<keyof RegisterValues, string>> = {};
  if (values.fullName.trim().length < 2)
    errors.fullName = "Vui lòng nhập họ tên";
  if (!values.phone) errors.phone = "Vui lòng nhập số điện thoại";
  else if (!isValidPhone(values.phone))
    errors.phone = "Số điện thoại gồm 10 số và bắt đầu bằng 0";
  if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Mật khẩu tối thiểu ${MIN_PASSWORD_LENGTH} ký tự`;
  }
  // Người giới thiệu không bắt buộc, nhưng đã nhập thì phải đúng định dạng
  if (values.email && !isValidEmail(values.email)) {
    errors.email = "Không đúng định dạng email";
  }
  return errors;
}

interface RegisterFormProps {
  redirectTo: string;
  onChangeMode: Function
}

export default function RegisterForm({ redirectTo, onChangeMode }: RegisterFormProps) {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { values, errors, setField, validateField, validateAll } =
    useForm<RegisterValues>(
      {
        fullName: "",
        phone: "",
        password: "",
        email: "",
      },
      validate,
    );
  const [formError, setFormError] = useState("");

  const { mutate, isPending } = useMutationRequest({
    key: ["users/register"],
    url: `users/register`,
    method: "post",
    options: {
      onSuccess: (data: AuthSession) => {
        saveSession(data);
        navigate(redirectTo);
      },
      onError: (error: ApiError) => {
        setFormError(error.message ?? "");
      },
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    setFormError("");
    try {
      mutate({
        full_name: values.fullName,
        phone: values.phone,
        email: values.email,
        password: values.password,
      });
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <TextField
        label="Họ tên"
        name="fullName"
        autoComplete="name"
        autoFocus
        value={values.fullName}
        onChange={(v) => setField("fullName", v)}
        onBlur={() => validateField("fullName")}
        error={errors.fullName}
      />
      <TextField
        label="Số điện thoại"
        type="tel"
        name="phone"
        inputMode="numeric"
        autoComplete="tel"
        value={values.phone}
        onChange={(v) => setField("phone", v.replace(/\D/g, "").slice(0, 10))}
        onBlur={() => validateField("phone")}
        error={errors.phone}
      />
      <TextField
        label="Mật khẩu"
        type="password"
        name="password"
        autoComplete="new-password"
        value={values.password}
        onChange={(v) => setField("password", v)}
        onBlur={() => validateField("password")}
        error={errors.password}
      />

      <div>
        <TextField
          label="Email"
          type="text"
          name="email"
          inputMode="numeric"
          value={values.email}
          onChange={(v) =>
            setField("email", v)
          }
          onBlur={() => validateField("email")}
          error={errors.email}
        />
        <ReferralHelp />
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
        Tạo tài khoản
      </Button>

      <p className="pt-1 text-center text-md text-neutral-900 flex gap-1 justify-center">
        Bạn đã có tài khoản?
        <div
          onClick={() => onChangeMode()}
          className="text-[#1a5fd1] underline underline-offset-2 hover:no-underline cursor-pointer"
        >
          Đăng nhập
        </div>
        tại đây
      </p>
    </form>
  );
}
