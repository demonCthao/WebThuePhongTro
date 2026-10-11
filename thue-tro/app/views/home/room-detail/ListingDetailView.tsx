import Breadcrumb from "app/components/common/Breadcrumb";
import Card from "app/components/common/Card";
import ImageCarousel from "app/components/layout/home/ImageCarousel";
import { getListingDetail, PLANS } from "app/data/mock";
import ListingHeader from "./ListingHeader";
import DetailSection from "./DetailSection";
import AmenityList from "./AmenityList";
import MapEmbed from "./MapEmbed";
import ContactSection from "./ContactSection";
import AuthorCard from "./AuthorCard";


interface ListingDetailViewProps {
  id: string;
}

export default function ListingDetailView({ id }: ListingDetailViewProps) {
  const detail = getListingDetail(id);
  const plan = PLANS.find((p) => p.id === detail.planId);

  return (
    <div className="bg-[#fdf3ed]">
      <div className="mx-auto max-w-[1300px] px-4 py-3 pb-8">
        <Breadcrumb items={detail.breadcrumb} />

        <div className="mt-3 grid gap-[27px] lg:grid-cols-[minmax(0,1fr)_398px] lg:items-start">
          <div className="min-w-0 space-y-5">
            <ImageCarousel images={detail.images} alt={detail.title} fastRent={detail.fastRent} />

            <Card className="p-6">
              <ListingHeader detail={detail} plan={plan} />

              <DetailSection title="Thông tin mô tả">
                <p className="whitespace-pre-line text-[15px] leading-7 text-neutral-900">{detail.description}</p>
              </DetailSection>

              <DetailSection title="Nổi bật">
                <AmenityList items={detail.amenities} />
              </DetailSection>

              <DetailSection title="Vị trí & bản đồ">
                <MapEmbed address={detail.address} />
              </DetailSection>

              <DetailSection title="Thông tin liên hệ">
                <ContactSection author={detail.author} />
              </DetailSection>
            </Card>
          </div>

          <aside className="lg:sticky lg:top-4">
            <AuthorCard author={detail.author} title={detail.title} listingCode={detail.code} />
          </aside>
        </div>
      </div>
    </div>
  );
}
