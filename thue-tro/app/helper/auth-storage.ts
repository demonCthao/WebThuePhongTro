import type { AuthSession } from "app/types/auth";
import type { Users } from "app/types/prisma-models";

const STORAGE_KEY = "thue_tro_session";

interface StoredSession {
  access_token: string;
  expires_at: number; // mili giây
  user: Users;
}

interface JwtPayload {
  sub?: string;
  email?: string;
  full_name?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

// Lưu phiên đăng nhập (chỉ gọi ở trình duyệt, trong sự kiện bấm nút).
// Lưu ý: localStorage đọc được bằng JavaScript nên nếu trang bị XSS thì token có thể bị lấy.
// Khi lên sản phẩm thật nên chuyển sang cookie httpOnly do máy chủ đặt.
export function saveSession(session: AuthSession): void {
  console.log("🚀 ~ saveSession ~ session:", session)
  const data: StoredSession = {
    access_token: session.access_token,
    expires_at: Date.now() + session.expires_in * 1000,
    user: session.user,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // trình duyệt chặn localStorage (chế độ riêng tư...): bỏ qua, chỉ mất khả năng giữ đăng nhập
  }
}

// Trả về null nếu chưa đăng nhập hoặc token đã hết hạn (và tự xóa phiên hết hạn)
export function getSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as StoredSession;
    if (typeof session.expires_at !== "number" || session.expires_at <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export const getAccessToken = () => getSession()?.access_token ?? null;
export const getCurrentUser = () => getSession()?.user ?? null;

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // bỏ qua
  }
}

export function decodeAccessToken(
  token: string
): JwtPayload | null {
  try {
    const payload = token.split(".")[1];

    if (!payload) return null;

    const base64 = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const decoded = atob(base64);

    const json = decodeURIComponent(
      Array.from(decoded)
        .map((char) =>
          "%" + char.charCodeAt(0).toString(16).padStart(2, "0")
        )
        .join("")
    );

    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function isAdmin(): boolean {
  const session = getSession();

  if (!session?.access_token) return false;

  const payload = decodeAccessToken(session.access_token);

  return payload?.role?.toLowerCase() === "admin";
}
