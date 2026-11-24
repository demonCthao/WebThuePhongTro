import AdsList from "app/views/admin/ads/AdsList";

export function meta() {
    return [{ title: "Danh sách phòng trọ" }];
}

export default function AdsRoute() {
    return <AdsList />;
}
