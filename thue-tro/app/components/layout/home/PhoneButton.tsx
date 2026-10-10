interface PhoneButtonProps {
  phone: string;
}

export default function PhoneButton({ phone }: PhoneButtonProps) {
  return (
    <a
      href={`tel:${phone.replace(/\s/g, "")}`}
      className="rounded-full bg-[#17b169] px-3.5 py-1.5 text-xs font-medium text-white hover:brightness-95"
    >
      {phone}
    </a>
  );
}
