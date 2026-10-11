import { cn } from "app/helper/cn";
import type { AuthorProfile } from "app/models/home/listing";

interface AuthorMetaProps {
  author: AuthorProfile;
  align?: "center" | "left";
}

export default function AuthorMeta({ author, align = "center" }: AuthorMetaProps) {
  const status = (
    <span className="inline-flex items-center gap-1.5 text-sm text-neutral-500">
      <span className={cn("size-1.5 rounded-full", author.online ? "bg-[#2ca34a]" : "bg-neutral-400")} />
      {author.online ? "Đang hoạt động" : "Ngoại tuyến"}
    </span>
  );

  const stats = (
    <p className="text-sm text-neutral-700">
      {author.listingCount} tin đăng
      <span className="mx-1.5 text-neutral-400">•</span>
      Tham gia từ: {author.joinedAt}
    </p>
  );

  if (align === "center") {
    return (
      <div className="mt-3 space-y-1 text-center">
        <p className="text-xl font-medium text-neutral-900">{author.name}</p>
        {status}
        {stats}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-lg font-medium text-neutral-900">{author.name}</p>
        {status}
      </div>
      {stats}
    </div>
  );
}
