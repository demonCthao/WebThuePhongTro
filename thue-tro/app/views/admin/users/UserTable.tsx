import type { DynamicColumn } from "app/components/common/DynamicTable";
import type { Users } from "app/types/prisma-models";
import { UserRound } from "lucide-react";

export const usersColumns: DynamicColumn<Users>[] = [
    {
        key: "full_name",
        title: "Người dùng",
        width: "220px",
        render: (user) => (
            <div className="flex items-center gap-2.5">
                <div className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-[#fff1ed] text-[#dc3b2f]">
                    {user.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt={user.full_name}
                            className="size-full object-cover"
                        />
                    ) : (
                        <UserRound size={17} />
                    )}
                </div>

                <div className="min-w-0">
                    <p className="truncate font-semibold text-neutral-800">
                        {user.full_name || "Chưa cập nhật"}
                    </p>

                    <p className="text-xs text-neutral-400">ID: {user.id}</p>
                </div>
            </div>
        ),
    },
    {
        key: "phone",
        title: "Số điện thoại",
        width: "150px",
        render: (user) => (
            <div className="flex flex-col gap-1">
                <span className="font-medium text-neutral-700">
                    {user.phone}
                </span>

                {user.phone_verified_at ? (
                    <span className="text-[11px] font-medium text-green-600">
                        Đã xác thực
                    </span>
                ) : (
                    <span className="text-[11px] text-neutral-400">
                        Chưa xác thực
                    </span>
                )}
            </div>
        ),
    },
    {
        key: "email",
        title: "Email",
        width: "220px",
        render: (user) => (
            <div className="flex flex-col gap-1">
                <span className="text-neutral-600">{user.email || "-"}</span>

                {user.email_verified_at ? (
                    <span className="text-[11px] font-medium text-green-600">
                        Đã xác thực
                    </span>
                ) : (
                    <span className="text-[11px] text-neutral-400">
                        Chưa xác thực
                    </span>
                )}
            </div>
        ),
    },
    {
        key: "status",
        title: "Trạng thái",
        align: "center",
        width: "140px",
        render: (user) => {
            const statusConfig = {
                active: {
                    label: "Hoạt động",
                    className: "bg-green-50 text-green-600",
                },
                blocked: {
                    label: "Đã khóa",
                    className: "bg-red-50 text-red-500",
                },
                pending: {
                    label: "Chờ xác nhận",
                    className: "bg-amber-50 text-amber-600",
                },
            };

            const config = statusConfig[user.status] ?? {
                label: user.status,
                className: "bg-neutral-100 text-neutral-500",
            };

            return (
                <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
                >
                    {config.label}
                </span>
            );
        },
    },
    {
        key: "last_login_at",
        title: "Đăng nhập gần nhất",
        width: "180px",
        render: (user) => (
            <span className="text-xs text-neutral-500">
                {user.last_login_at
                    ? new Date(user.last_login_at).toLocaleString("vi-VN")
                    : "Chưa đăng nhập"}
            </span>
        ),
    },
    {
        key: "created_at",
        title: "Ngày đăng ký",
        width: "180px",
        render: (user) => (
            <span className="text-xs text-neutral-500">
                {new Date(user.created_at).toLocaleString("vi-VN")}
            </span>
        ),
    },
];
