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
import BookingModal from "./BookingModal";
import { getSession } from "app/helper/auth-storage";
import { redirect, useLocation, useNavigate } from "react-router";
import Button from "app/components/common/Button";
import RoomContractModal from "./RoomContractModal";
import { ContactRoundIcon } from "lucide-react";

interface ListingDetailViewProps {
  id: string;
}

export default function ListingDetailView({ id }: ListingDetailViewProps) {
  const session = getSession();
  const location = useLocation();
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showContract, setShowContract] = useState(false);

  const { data, isLoading } = useFetch<Rooms>({
    url: `/rooms/${id}`,
    key: ["roon-id", id],
  });

  const {
    data: hasAppointment,
    isLoading: isCheckingAppointment,
    refetch,
  } = useFetch<boolean>({
    url: `/viewing-appointments/check/${id}`,
    key: ["check-viewing-appointment", id],
  });

  if (isLoading) {
    return <Loading />;
  }

  const onCloseBooking = () => {
    setIsBookingOpen(false);
  };

  const onBooking = () => {
    console.log("haha");

    if (!session?.access_token) {
      const currentUrl = location.pathname + location.search + location.hash;

      navigate(
        `/dang-nhap-hoac-dang-ky?redirect=${encodeURIComponent(currentUrl)}`,
      );
      return;
    }

    setIsBookingOpen(true);
  };

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
            <Card className="space-y-3 p-4 mt-2">
              <div>
                <h3 className="text-sm font-semibold text-neutral-800">
                  Muốn xem phòng trực tiếp?
                </h3>
                <p className="mt-1 text-xs leading-5 text-neutral-500">
                  Đặt lịch hẹn để chủ phòng sắp xếp thời gian đón bạn.
                </p>
              </div>
              {hasAppointment ? (
                <p>Bạn đã đặt lịch xem phòng này.</p>
              ) : (
                <BookingButton onClick={onBooking} />
              )}
              <p className="text-center text-[11px] text-neutral-400">
                Miễn phí đặt lịch xem phòng
              </p>
              <Button onClick={() => setShowContract(true)} className="py-3">
                <ContactRoundIcon size={18} />
                Xem thông tin hợp đồng
              </Button>

              <RoomContractModal
                isOpen={showContract}
                onClose={() => setShowContract(false)}
                room={data}
                user={session?.user}
              />
            </Card>
          </aside>
        </div>
      </div>

      {isBookingOpen && (
        <BookingModal
          onClose={onCloseBooking}
          room={data}
          open
          onSuccess={refetch}
        />
      )}
    </div>
  );
}
