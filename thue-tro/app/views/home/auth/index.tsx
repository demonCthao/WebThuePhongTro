import { Link, useSearchParams } from "react-router";
import AuthTabs from "./AuthTabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { safeRedirectPath } from "app/helper/validators";
import { useState } from "react";

interface AuthView {
  mode: "login" | "register";
}

const linkClass = "text-[#1a5fd1] underline underline-offset-2 hover:no-underline";

export default function AuthView() {
  const [searchParams] = useSearchParams();
  const [authView, setAuthView] = useState<AuthView>({mode: "login"})
  const redirectTo = safeRedirectPath(searchParams.get("redirect"));

  return (
    <div className="bg-[#fdf3ed] px-4 py-12">
      <div className="mx-auto w-full max-w-[718px] rounded-3xl bg-white px-5 py-10 shadow-[0_2px_10px_rgba(0,0,0,0.05)] sm:px-[53px] sm:py-12">
        <AuthTabs mode={authView.mode} onChangeMode={(value) => setAuthView({ mode: value})} />

        <div className="mt-12">
          {authView.mode === "login" ? <LoginForm redirectTo={redirectTo} /> : <RegisterForm redirectTo={redirectTo} onChangeMode={() => setAuthView({ mode: "login" })} />}
        </div>

        <p className="mt-9 text-sm leading-[21px] text-neutral-900">
          Qua việc đăng nhập hoặc tạo tài khoản, bạn đồng ý với các
          <Link to="/quy-dinh-su-dung" className={linkClass}>
            quy định sử dụng
          </Link>
          cũng như
          <Link to="/chinh-sach-bao-mat" className={linkClass}>
            chính sách bảo mật
          </Link>
          của chúng tôi
        </p>
        <p className="mt-4 text-sm text-neutral-900">Bản quyền © 2015 - {new Date().getFullYear()} Phongtro123.com</p>
      </div>
    </div>
  );
}
