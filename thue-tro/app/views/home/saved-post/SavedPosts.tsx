import Loading from "app/components/common/Loading";
import { getSession } from "app/helper/auth-storage";
import { useFetch } from "app/hooks/useFetch";
import type { RoomLikeList } from "app/types/prisma-models";
import { ArrowRight, Heart, Plus } from "lucide-react";
import { Link } from "react-router";
import ListingGridCard from "./ListingGridCard";

export default function SavedPosts() {
    const authenSession = getSession();
    console.log("🚀 ~ SavedPosts ~ authenSession:", authenSession);

    // Thay bằng danh sách phòng đã lưu từ API của bạn
    const { data, isLoading, error, refetch } = useFetch<RoomLikeList>({
        url: `room-likes/user/${authenSession?.user?.id}`,
        key: ["/get-rooms-likes-by-user", authenSession?.user?.id ?? ""],
    });

    if (isLoading) {
        <Loading />;
    }

    return (
        <div className="space-y-6 my-5">
            {/* HEADER */}
            {(data?? [])?.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-orange-50">
                            <Heart className="size-5 text-[#ff5722]" />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-neutral-800">
                                Tin đã lưu
                            </h1>
                            <p className="mt-1 text-sm text-neutral-500">
                                Quản lý những phòng trọ bạn yêu thích
                            </p>
                        </div>
                    </div>

                    {(data?? [])?.length > 0 && (
                        <span className="rounded-full bg-orange-50 px-3 py-1.5 text-sm font-semibold text-[#ff5722]">
                            {(data?? []).length} tin đã lưu
                        </span>
                    )}
                </div>
            )}

            {/* LIST */}
            {(data?? [])?.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-4 px-5">
                    {(data?? []).map((item) => (
                        <ListingGridCard key={item.room_id} room={item.rooms} />
                    ))}
                </div>
            ) : (
                /* EMPTY STATE */
                <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white px-6 py-12 text-center shadow-sm">
                    <div className="relative">
                        <div className="grid size-24 place-items-center rounded-full bg-orange-50">
                            <div className="grid size-16 place-items-center rounded-full bg-orange-100">
                                <Heart
                                    className="size-8 text-[#ff5722]"
                                    strokeWidth={1.7}
                                />
                            </div>
                        </div>

                        <span className="absolute -right-1 -top-1 grid size-8 place-items-center rounded-full border-4 border-white bg-neutral-100">
                            <Plus className="size-3.5 text-neutral-500" />
                        </span>
                    </div>

                    <h2 className="mt-6 text-lg font-bold text-neutral-800">
                        Chưa có tin đăng yêu thích
                    </h2>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
                        Những phòng trọ bạn lưu sẽ xuất hiện tại đây. Hãy khám
                        phá và tìm cho mình một nơi ở phù hợp nhé!
                    </p>

                    <Link
                        to="/danh-sach"
                        className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#ff5722] px-6 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#e64d1d] hover:shadow-md"
                    >
                        Khám phá phòng trọ
                        <ArrowRight className="size-4" />
                    </Link>

                    <p className="mt-4 text-xs text-neutral-400">
                        Lưu tin đăng để dễ dàng tìm lại sau này
                    </p>
                </div>
            )}
        </div>
    );
}
