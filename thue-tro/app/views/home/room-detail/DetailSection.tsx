import type { ReactNode } from "react";

interface DetailSectionProps {
  title: string;
  children: ReactNode;
}

// Một khối có đường kẻ ngang phía trên và tiêu đề
export default function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <section className="mt-6 border-t border-neutral-200 pt-6">
      <h2 className="mb-3 text-xl font-medium text-neutral-900">{title}</h2>
      {children}
    </section>
  );
}
