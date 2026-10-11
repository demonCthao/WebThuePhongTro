import type { AuthorProfile } from "app/models/home/listing";
import ActionBar from "./ActionBar";
import AuthorMeta from "./AuthorMeta";
import Card from "app/components/common/Card";
import Avatar from "app/components/common/Avatar";
import ContactButtons from "app/components/layout/home/ContactButtons";

interface AuthorCardProps {
  author: AuthorProfile;
  title: string;
  listingCode: string;
}

// Thẻ bên phải: người đăng + gọi/Zalo + lưu/chia sẻ/báo xấu
export default function AuthorCard({ author, title, listingCode }: AuthorCardProps) {
  return (
    <Card className="p-[17px]">
      <div className="flex flex-col items-center">
        <Avatar size={125} src={author.avatarUrl} alt={author.name} />
        <AuthorMeta author={author} align="center" />
      </div>
      <div className="mt-4">
        <ContactButtons phone={author.phone} layout="stack" />
      </div>
      <div className="mt-5">
        <ActionBar title={title} listingCode={listingCode} />
      </div>
    </Card>
  );
}
