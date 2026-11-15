import Breadcrumb from "app/components/common/Breadcrumb";
import Card from "app/components/common/Card";
import Loading from "app/components/common/Loading";
import ImageCarousel from "app/components/layout/home/ImageCarousel";
import { LIST_ROOMS_ROUTE } from "app/const/router";
import { useFetch } from "app/hooks/useFetch";
import type { AuthorProfile, BreadcrumbItem } from "app/models/home/listing";
import type { Amenities, Rooms } from "app/types/prisma-models";
import AmenityList from "./AmenityList";
import AuthorCard from "./AuthorCard";
import ContactSection from "./ContactSection";
import DetailSection from "./DetailSection";
import ListingHeader from "./ListingHeader";
import MapEmbed from "./MapEmbed";
import { useState } from "react";
import BookingButton from "./BookingButton";

interface ListingDetailViewProps {
  id: string;
}

export default function ListingDetailView({ id }: ListingDetailViewProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { data, isLoading } = useFetch<Rooms>({
    url: `/rooms/${id}`,
    key: ["roon-id", id],
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="bg-[#fdf3ed]">
      <div className="mx-auto max-w-[1300px] px-4 py-3 pb-8">
        <Breadcrumb
          items={
            [
              {
                label: data?.provinces?.full_name,
                to: `${LIST_ROOMS_ROUTE}?province=${data?.provinces?.code}`,
              },
              {
                label: data?.wards?.full_name,
                to: `${LIST_ROOMS_ROUTE}?ward=${data?.wards?.code}`,
              },
              {
                label: data?.title,
                to: "",
              },
            ] as BreadcrumbItem[]
          }
        />

        <div className="mt-3 grid gap-[27px] lg:grid-cols-[minmax(0,1fr)_398px] lg:items-start">
          <div className="min-w-0 space-y-5">
            <ImageCarousel
              images={data?.room_media?.map((item) => item.url) ?? []}
              alt={data?.description ?? ""}
            />

            <Card className="p-6">
              {data && <ListingHeader detail={data} />}

              <DetailSection title="Thông tin mô tả">
                <p className="whitespace-pre-line text-[15px] leading-7 text-neutral-900">
                  {data?.description}
                </p>
              </DetailSection>

              <DetailSection title="Nổi bật">
                <AmenityList
                  items={
                    data?.room_amenities
                      ?.map((item) => item.amenities)
                      .filter(
                        (item): item is Amenities => item !== undefined,
                      ) ?? []
                  }
                />
              </DetailSection>

              <DetailSection title="Vị trí & bản đồ">
                <MapEmbed address={data?.full_address ?? ""} />
              </DetailSection>

              <DetailSection title="Thông tin liên hệ">
                {data && (
                  <ContactSection
                    author={
                      {
                        name: data?.contact_name,
                        phone: data?.contact_phone,
                        online: true,
                      } as AuthorProfile
                    }
                  />
                )}
              </DetailSection>
            </Card>
          </div>

          <aside className="lg:sticky lg:top-4">
            <AuthorCard
              author={
                {
                  name: data?.contact_name,
                  phone: data?.contact_phone,
                  online: true,
                } as AuthorProfile
              }
              title={data?.title ?? ""}
              listingCode={data?.id ?? ""}
            />
            <Card className="space-y-3 p-4">
              <div>
                <h3 className="text-sm font-semibold text-neutral-800">
                  Muốn xem phòng trực tiếp?
                </h3>
                <p className="mt-1 text-xs leading-5 text-neutral-500">
                  Đặt lịch hẹn để chủ phòng sắp xếp thời gian đón bạn.
                </p>
              </div>

              <BookingButton onClick={() => setIsBookingOpen(true)} />

              <p className="text-center text-[11px] text-neutral-400">
                Miễn phí đặt lịch xem phòng
              </p>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
