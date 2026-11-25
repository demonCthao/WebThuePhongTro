import ViewingAppointmentList from "app/views/admin/viewing-appointment/ViewingAppointmentList";

export function meta() {
    return [{ title: "Danh sách phòng trọ" }];
}

export default function ViewingAppointmentRoute() {
    return <ViewingAppointmentList />;
}
