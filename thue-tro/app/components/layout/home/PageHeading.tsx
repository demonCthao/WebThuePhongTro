interface PageHeadingProps {
  title: string;
  description?: string;
}

export default function PageHeading({ title, description }: PageHeadingProps) {
  return (
    <header>
      <h1 className="text-[22px] font-medium leading-tight text-neutral-900">{title}</h1>
      {description && (
        <p className="mt-2 text-[13px] leading-6 text-neutral-700">{description}</p>
      )}
    </header>
  );
}
