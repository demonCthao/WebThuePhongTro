import Card from "app/components/common/Card";

function ListingCardSkeleton() {
    return (
        <Card className="animate-pulse p-3.5">
            {/* Gallery */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-200">
                <div className="absolute bottom-3 left-3 flex gap-2">
                    <div className="h-6 w-12 rounded-md bg-neutral-300" />
                    <div className="h-6 w-12 rounded-md bg-neutral-300" />
                </div>
            </div>

            {/* Title */}
            <div className="mt-3 space-y-2">
                <div className="h-4 w-[85%] rounded bg-neutral-200" />
                <div className="h-4 w-[55%] rounded bg-neutral-200" />
            </div>

            {/* Price / Area / Location */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="h-4 w-20 rounded bg-neutral-200" />
                <div className="h-3 w-1 rounded bg-neutral-200" />
                <div className="h-4 w-12 rounded bg-neutral-200" />
                <div className="h-3 w-1 rounded bg-neutral-200" />
                <div className="h-4 w-28 rounded bg-neutral-200" />
            </div>

            {/* Description */}
            <div className="mt-3 space-y-2">
                <div className="h-3 w-full rounded bg-neutral-200" />
                <div className="h-3 w-[75%] rounded bg-neutral-200" />
            </div>

            {/* Author */}
            <div className="mt-3 flex items-center gap-2.5">
                <div className="size-9 shrink-0 rounded-full bg-neutral-200" />

                <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3 w-28 rounded bg-neutral-200" />
                    <div className="h-3 w-20 rounded bg-neutral-200" />
                </div>

                {/* Phone button */}
                <div className="size-9 shrink-0 rounded-full bg-neutral-200" />

                {/* Favorite button */}
                <div className="size-9 shrink-0 rounded-full bg-neutral-200" />
            </div>
        </Card>
    );
}

export default ListingCardSkeleton;
