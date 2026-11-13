import AuthView from "app/views/home/auth";

export function meta() {
    return [{ title: "Danh sách phòng trọ" }];
}

export default function AuthRoute() {
    return <AuthView />;
}
