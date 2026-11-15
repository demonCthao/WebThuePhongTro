import Button from "app/components/common/Button";
import { cn } from "app/helper/cn";
import { RotateCcw, Search } from "lucide-react";
import type { ReactNode } from "react";

interface SearchFilterProps {
    children: ReactNode;
    onSearch: () => void;
    onReset: () => void;
    loading?: boolean;
}

const SearchFilter = ({
    children,
    onSearch,
    onReset,
    loading = false,
}: SearchFilterProps) => {
    return (
        <div className="rounded-xl border border-neutral-200 bg-white px-5 py-2 shadow-sm">
            {/* Filter content */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {children}
            </div>

            {/* Actions */}
            <div className="mt-1 flex items-center justify-end gap-2.5 border-t border-neutral-100 pt-3">
                <Button
                    type="button"
                    onClick={onReset}
                    disabled={loading}
                    className={cn(
                        "h-9 w-auto border border-neutral-200 bg-white px-3.5",
                        "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800",
                    )}
                >
                    <RotateCcw size={14} />
                    Đặt lại
                </Button>

                <Button
                    type="button"
                    onClick={onSearch}
                    loading={loading}
                    disabled={loading}
                    className={cn(
                        "h-9 w-auto px-4",
                        "bg-[#dc3b2f] hover:bg-[#c83227]",
                    )}
                >
                    <Search size={14} />
                    {loading ? "Đang tìm..." : "Tìm kiếm"}
                </Button>
            </div>
        </div>
    );
};

export default SearchFilter;
