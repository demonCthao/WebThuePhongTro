import { decodeAccessToken, getSession } from "app/helper/auth-storage";
import AdminLayout from "app/views/admin";
import { redirect } from "react-router";

export function clientLoader() {
  const session = getSession();

  if (!session?.access_token) {
    return redirect("/dang-nhap-hoac-dang-ky");
  }

  const payload = decodeAccessToken(session.access_token);

  if (payload?.role?.toLowerCase() !== "admin") {
    return redirect("/");
  }

  return null;
}

export default function AdminRoute() {
  return <AdminLayout />;
}
