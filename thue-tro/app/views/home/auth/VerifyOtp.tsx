import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useMutationRequest } from "app/hooks/useMutation";
import type { ApiError } from "app/types/api-error";
import type { AuthSession } from "app/types/auth";
import { saveSession } from "app/helper/auth-storage";
import { safeRedirectPath } from "app/helper/validators";

const linkClass = "font-medium text-[#e64b2f] hover:text-[#c83d25]";

export default function VerifyOtp() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectTo = safeRedirectPath(searchParams.get("redirect"));

    const email = searchParams.get("email") || "";
    const phone = searchParams.get("phone") || "";

    const destination = email || phone;

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [countdown, setCountdown] = useState(60);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const { mutate, isPending } = useMutationRequest({
        key: ["users/verify-otp"],
        url: `users/verify-otp`,
        method: "post",
        options: {
            onSuccess: (data: AuthSession) => {
                saveSession(data);
                navigate(redirectTo);
            },
            onError: (error: ApiError) => {},
        },
    });

    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setTimeout(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown]);

    const handleChange = (index: number, value: string) => {
        const number = value.replace(/\D/g, "").slice(-1);

        const newOtp = [...otp];
        newOtp[index] = number;
        setOtp(newOtp);

        if (number && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();

        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (!pasted) return;

        const newOtp = [...otp];

        pasted.split("").forEach((char, index) => {
            newOtp[index] = char;
        });

        setOtp(newOtp);

        inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    };

    const handleVerify = async () => {
        const otpCode = otp.join("");

        if (otpCode.length !== 6) return;

        try {
            setIsLoading(true);

            // TODO: Gọi API verify OTP tại đây
            console.log("OTP:", otpCode);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0 || isResending) return;

        try {
            setIsResending(true);

            // TODO: Gọi API gửi lại OTP tại đây

            setOtp(["", "", "", "", "", ""]);
            setCountdown(60);
            inputRefs.current[0]?.focus();
        } catch (error) {
            console.error(error);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fdf3ed] px-4 py-12">
            <div className="mx-auto w-full max-w-[718px] rounded-3xl bg-white px-5 py-10 shadow-[0_2px_10px_rgba(0,0,0,0.05)] sm:px-[53px] sm:py-12">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#fff0e9]">
                        <ShieldCheck className="size-8 text-[#e64b2f]" />
                    </div>

                    <h1 className="mt-6 text-2xl font-bold text-neutral-900">
                        Xác thực tài khoản
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-neutral-600">
                        Chúng tôi đã gửi mã xác thực gồm 6 chữ số đến
                    </p>

                    <p className="mt-1 break-all font-semibold text-neutral-900">
                        {destination || "Thông tin liên hệ của bạn"}
                    </p>
                </div>

                {/* OTP Input */}
                <div className="mt-10">
                    <label className="mb-3 block text-sm font-medium text-neutral-800">
                        Nhập mã xác thực OTP
                    </label>

                    <div className="flex justify-center gap-2 sm:gap-4">
                        {otp.map((value, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={1}
                                value={value}
                                onChange={(e) =>
                                    handleChange(index, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className="h-12 w-10 rounded-xl border border-neutral-200 bg-neutral-50 text-center text-xl font-bold text-neutral-900 outline-none transition focus:border-[#e64b2f] focus:bg-white focus:ring-2 focus:ring-[#e64b2f]/10 sm:h-14 sm:w-14"
                            />
                        ))}
                    </div>
                </div>

                {/* Resend OTP */}
                <div className="mt-6 text-center text-sm text-neutral-600">
                    Bạn chưa nhận được mã?
                    {countdown > 0 ? (
                        <p className="mt-2">
                            Gửi lại mã sau{" "}
                            <span className="font-semibold text-[#e64b2f]">
                                {`00:${String(countdown).padStart(2, "0")}`}
                            </span>
                        </p>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={isResending}
                            className="ml-1 font-semibold text-[#e64b2f] hover:text-[#c83d25] disabled:opacity-50"
                        >
                            {isResending ? "Đang gửi..." : "Gửi lại mã"}
                        </button>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="button"
                    onClick={handleVerify}
                    disabled={otp.join("").length !== 6 || isLoading}
                    className="mt-9 flex h-12 w-full items-center justify-center rounded-lg bg-[#e64b2f] text-sm font-semibold text-white transition hover:bg-[#cf4027] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isLoading ? "Đang xác thực..." : "Xác nhận"}
                </button>

                {/* Back */}
                <div className="mt-6 text-center">
                    <Link
                        to="/dang-nhap-hoac-dang-ky"
                        className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-[#e64b2f]"
                    >
                        <ArrowLeft className="size-4" />
                        Quay lại đăng nhập
                    </Link>
                </div>

                {/* Footer */}
                <p className="mt-9 text-sm leading-[21px] text-neutral-900">
                    Qua việc xác thực tài khoản, bạn đồng ý với các{" "}
                    <Link to="/quy-dinh-su-dung" className={linkClass}>
                        quy định sử dụng
                    </Link>{" "}
                    cũng như{" "}
                    <Link to="/chinh-sach-bao-mat" className={linkClass}>
                        chính sách bảo mật
                    </Link>{" "}
                    của chúng tôi
                </p>

                <p className="mt-4 text-sm text-neutral-900">
                    Bản quyền © 2015 - {new Date().getFullYear()}{" "}
                    Phongtro123.com
                </p>
            </div>
        </div>
    );
}
