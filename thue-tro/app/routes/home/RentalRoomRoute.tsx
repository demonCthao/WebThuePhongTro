import RentalRoom from "app/views/home/rental-room/RentalRoom";

export function meta() {
    return [{ title: "Danh sách phòng trọ" }];
}

export default function RentalRoomRoute() {
    return <RentalRoom />;
}
