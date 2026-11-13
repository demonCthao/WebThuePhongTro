import UserList from "app/views/admin/users/UserList";

export function meta() {
    return [{ title: "Danh sách phòng trọ" }];
}

export default function UsersRoute() {
    return <UserList />;
}
