import ProvincesList from "app/views/admin/provinces/ProvincesList";

export function meta() {
    return [{ title: "Danh sách phòng trọ" }];
}

export default function ProvincesRoute() {
    return <ProvincesList />;
}
