import type { ReactNode } from "react";
import { Play } from "lucide-react";
import { cn } from "app/helper/cn";

interface Social {
  name: string;
  href: string;
  className: string;
  icon: ReactNode;
}

// Icon đơn giản để chạy ngay; muốn đúng logo hãy thay bằng react-icons (FaFacebook, FaYoutube...)
const SOCIALS: Social[] = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    className: "bg-[#1877f2] text-white",
    icon: <span className="text-[22px] font-bold leading-none">f</span>,
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    className: "bg-[#ff0000] text-white",
    icon: <Play size={15} fill="white" strokeWidth={0} />,
  },
  {
    name: "Zalo",
    href: "https://zalo.me",
    className: "border-2 border-[#0068ff] bg-white text-[#0068ff]",
    icon: <span className="text-[10px] font-bold">Zalo</span>,
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    className: "bg-[#1da1f2] text-white",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com",
    className: "bg-black text-white",
    icon: <span className="text-base leading-none">♪</span>,
  },
];

export default function SocialLinks() {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {SOCIALS.map((social) => (
        <li key={social.name}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className={cn("grid size-[37px] place-items-center rounded-full hover:opacity-90", social.className)}
          >
            {social.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}
