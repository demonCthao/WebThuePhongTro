import {
  ABOUT_COLUMNS,
  CATEGORY_COLUMNS,
  PARTNERS,
} from "app/data/footer.data";
import FooterLinkColumn from "./FooterLinkColumn";
import FooterPartners from "./FooterPartners";
import FooterSection from "./FooterSection";
import PaymentMethods from "./PaymentMethods";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="bg-[#fee39b] text-neutral-900">
      <div className="mx-auto max-w-[1300px] px-4 py-10">
        {/* Hàng 1: danh mục theo tỉnh thành */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORY_COLUMNS.map((column) => (
            <FooterLinkColumn
              key={column.title}
              title={column.title}
              links={column.links}
            />
          ))}
        </div>

        <hr className="my-8 border-black/10" />
        <FooterPartners partners={PARTNERS} />
        <hr className="my-8 border-black/10" />

        {/* Hàng 2: thông tin, thanh toán, mạng xã hội */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_COLUMNS.map((column) => (
            <FooterLinkColumn
              key={column.title}
              title={column.title}
              links={column.links}
            />
          ))}
          <FooterSection title="Phương thức thanh toán">
            <PaymentMethods />
          </FooterSection>
          <FooterSection title="Theo dõi Phongtro123.com">
            <SocialLinks />
          </FooterSection>
        </div>
      </div>
    </footer>
  );
}
