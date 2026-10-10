import type { ReactNode } from "react";

interface FooterSectionProps {
  title: string;
  children: ReactNode;
}

// Tiêu đề in hoa + nội dung, dùng chung cho mọi cột trong footer
export default function FooterSection({ title, children }: FooterSectionProps) {
  return (
    <section>
      <h3 className="mb-2 text-base font-medium uppercase text-neutral-900">{title}</h3>
      {children}
    </section>
  );
}
