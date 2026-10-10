import type { Partner } from "app/data/footer.data";
import { cn } from "app/helper/cn";

interface FooterPartnersProps {
  partners: Partner[];
}

export default function FooterPartners({ partners }: FooterPartnersProps) {
  return (
    <div className="text-center">
      <p className="mb-3 text-sm text-neutral-800">Cùng hệ thống LBKCorp:</p>
      <ul className="flex flex-wrap justify-center gap-[18px]">
        {partners.map((partner) => (
          <li key={partner.href}>
            <a
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-[52px] w-[193px] place-items-center rounded-md bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {partner.logo ? (
                <img src={partner.logo} alt={partner.name} className="max-h-8 max-w-[150px] object-contain" />
              ) : (
                <span className={cn("text-lg font-extrabold", partner.textClass)}>{partner.name}</span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
