import ListingDetailView from "app/views/home/room-detail/ListingDetailView";
import { useParams } from "react-router";

export function meta() {
  return [{ title: "Chi tiết tin đăng" }];
}

export default function ListingDetailRoute() {
  const { id = "" } = useParams(); // lấy :id từ /phong-tro/:id
  return <ListingDetailView id={id} />;
}
