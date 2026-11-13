import Card from "app/components/common/Card";
import { useFetch } from "app/hooks/useFetch";
import type { DataList } from "app/models/home/response.model";
import type { Rooms } from "app/types/prisma-models";
import ListingMiniItem from "./ListingMiniItem";

export default function NewListings() {
  const { data } = useFetch<Rooms[]>({
    url: `/rooms/new`,
    key: ["rooms/new"],
  });

  return (
    <Card className="p-3.5">
      <h3 className="mb-3 text-[15px] font-medium text-neutral-900">
        Tin mới đăng
      </h3>
      <ul className="divide-y divide-neutral-200">
        {data?.map((item) => (
          <li key={item.id} className="py-3 first:pt-0 last:pb-0">
            <ListingMiniItem item={item} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
