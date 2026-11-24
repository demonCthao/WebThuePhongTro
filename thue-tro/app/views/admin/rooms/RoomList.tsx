import { DynamicTable } from "app/components/common/DynamicTable";
import Loading from "app/components/common/Loading";
import { useFetch } from "app/hooks/useFetch";
import type { DataList } from "app/models/home/response.model";
import type {
    Amenities,
    Provinces,
    RoomCategories,
    Rooms,
    Wards,
} from "app/types/prisma-models";
import { roomsColumns } from "./RoomTable";
import Button from "app/components/common/Button";
import { useMemo, useState } from "react";
import RoomModal, {
    type RoomFormData,
} from "./RoomModal";
import type { Option } from "app/data/mock";

export default function RoomList() {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [rooms, setRooms] = useState<RoomFormData | null>(null);
    const { data, isLoading, refetch } = useFetch<DataList<Rooms>>({
        url: `/rooms`,
        key: ["rooms/all"],
    });
    const { data: dataProvinces } = useFetch<DataList<Provinces>>({
        url: "/provinces/all",
        key: ["provinces/all"],
    });

    const { data: dataWards } = useFetch<DataList<Wards>>({
        url: "/wards",
        key: ["wards"],
    });

    const { data: dataCategories } = useFetch<DataList<RoomCategories>>({
        url: "/room-categories/all",
        key: ["/room-categories/all"],
    });

    const { data: dataAmenities } = useFetch<DataList<Amenities>>({
        url: "/amenities/all",
        key: ["/amenities/all"],
    });

    const provinceOptions: Option[] = useMemo(
        () =>
            (dataProvinces?.list ?? []).map((province) => ({
                value: String(province.id),
                label: `${province.full_name} (${province.code})`,
            })),
        [dataProvinces],
    );

    const wardOptions: Option[] = useMemo(
        () =>
            (dataWards?.list ?? []).map((province) => ({
                value: String(province.id),
                label: `${province.full_name} (${province.code})`,
            })),
        [dataWards],
    );

    const categoriesOptions: Option[] = useMemo(
        () =>
            (dataCategories?.list ?? []).map((province) => ({
                value: String(province.id),
                label: `${province.name} (${province.code})`,
            })),
        [dataCategories],
    );

    const amenitiesOptions: Option[] = useMemo(
        () =>
            (dataAmenities?.list ?? []).map((province) => ({
                value: String(province.id),
                label: `${province.name} (${province.code})`,
            })),
        [dataAmenities],
    );

    const mapRoomToFormData = (room: Rooms): RoomFormData => {
        return {
            id: room.id,

            category_id: String(room.category_id),
            title: room.title,
            slug: room.slug,
            description: room.description,

            price_monthly: room.price_monthly,
            deposit: room.deposit ?? "",
            electricity_price: String(room.electricity_price ?? ""),
            water_price: String(room.water_price ?? ""),
            area_m2: room.area_m2,
            max_people: String(room.max_people ?? ""),
            floor_no: String(room.floor_no ?? ""),
            available_from: room.available_from ?? "",

            province_id: String(room.province_id),
            ward_id: String(room.ward_id),
            street_address: room.street_address,
            full_address: room.full_address,

            latitude: room.latitude ?? "",
            longitude: room.longitude ?? "",

            contact_name: room.contact_name,
            contact_phone: room.contact_phone,
            zalo_phone: room.zalo_phone ?? "",
            zalo_url: room.zalo_url ?? "",

            amenity_ids:
                room.room_amenities?.map((item) => item.amenity_id) ?? [],

            room_media:
                room.room_media?.map((media) => ({
                    id: media.id,
                    room_id: media.room_id,
                    kind: media.kind,
                    url: media.url,
                    thumb_url: media.thumb_url ?? "",
                    sort_order: media.sort_order,
                    is_cover: media.is_cover,
                    cover_key: media.cover_key,
                    created_at: media.created_at,
                })) ?? [],
        };
    };

    const handleChoose = (room: Rooms) => {
        console.log("🚀 ~ handleChoose ~ room:", mapRoomToFormData(room));
        setRooms(mapRoomToFormData(room));
        setIsOpenModal(true);
    };

    const handleAdd = () => {
        setIsOpenModal(true);
    };

    const onCloseForm = () => {
        setIsOpenModal(false);
        setRooms(null);
    };
    mapRoomToFormData;

    return (
        <div className="flex h-full min-h-0 flex-col gap-3">
            {/* ADD BUTTON */}
            <div className="flex shrink-0 justify-end">
                <Button
                    type="button"
                    onClick={handleAdd}
                    className="w-auto rounded-lg px-4 text-sm font-medium"
                >
                    + Thêm bài đăng phòng
                </Button>
            </div>
            {isLoading ? (
                <Loading />
            ) : (
                <DynamicTable
                    title="Quản lý bài đăng phòng"
                    description="Quản lý bài đăng phòng"
                    data={data?.list ?? []}
                    columns={roomsColumns}
                    onChoose={handleChoose}
                    useCanMutation={true}
                    pageSize={data?.total}
                    getRowId={(ward) => ward.id}
                />
            )}

            <RoomModal
                open={isOpenModal}
                onClose={onCloseForm}
                categories={categoriesOptions}
                provinces={provinceOptions}
                wards={wardOptions}
                amenities={amenitiesOptions}
                initialData={rooms}
                refetch={refetch}
            />
        </div>
    );
}
