import ListRooms from "app/views/home/list/ListRooms";

export function meta() {
    return [{ title: "Danh sách phòng trọ" }];
}

export default function ListRoute() {
    return <ListRooms />;
}
