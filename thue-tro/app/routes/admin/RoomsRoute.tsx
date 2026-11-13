import RoomList from "app/views/admin/rooms/RoomList";

export function meta() {
    return [{ title: "Danh sách phòng trọ" }];
}

export default function c() {
    return <RoomList />;
}
