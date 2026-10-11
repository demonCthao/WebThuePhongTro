import type { AuthorProfile } from "app/models/home/listing";
import AuthorMeta from "./AuthorMeta";
import Avatar from "app/components/common/Avatar";
import ContactButtons from "app/components/layout/home/ContactButtons";

interface ContactSectionProps {
  author: AuthorProfile;
}

export default function ContactSection({ author }: ContactSectionProps) {
  return (
    <div className="flex items-center gap-4">
      <Avatar size={96} src={author.avatarUrl} alt={author.name} />
      <div className="min-w-0 space-y-2.5">
        <AuthorMeta author={author} align="left" />
        <ContactButtons phone={author.phone} layout="inline" />
      </div>
    </div>
  );
}
