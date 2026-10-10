import { Link } from "react-router";
import FooterSection from "./FooterSection";
import type { LinkItem } from "../FilterLinkList";

interface FooterLinkColumnProps {
  title: string;
  links: LinkItem[];
}

export default function FooterLinkColumn({ title, links }: FooterLinkColumnProps) {
  return (
    <FooterSection title={title}>
      <ul>
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="block py-[5px] text-[15px] leading-6 text-neutral-900 hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </FooterSection>
  );
}
