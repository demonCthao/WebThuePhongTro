import * as React from "react";
import {
    Edit,
    Trash2,
    Inbox,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { cn } from "app/helper/cn";

// ==========================================
// TYPES
// ==========================================

export type TableAction = "edit" | "delete";

export interface DynamicColumn<TData> {
    key: keyof TData | string;
    title: string;
    render?: (data: TData, index: number) => React.ReactNode;
    align?: "left" | "center" | "right";
    width?: string;
    hidden?: boolean;
}

interface DynamicTableProps<TData> {
    title: string;
    data: TData[];
    columns: DynamicColumn<TData>[];

    onChoose?: (data: TData, type: TableAction) => void;

    useCanMutation?: boolean;

    pageSize?: number;
    totalItems?: number;
    currentPage?: number;

    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;

    isLoading?: boolean;
    emptyMessage?: string;
    description?: string;

    getRowId?: (data: TData) => string | number;
}

// ==========================================
// TABLE COMPONENTS
// ==========================================

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
    ({ className, ...props }, ref) => (
        <table
            ref={ref}
            className={cn("w-full caption-bottom text-sm", className)}
            {...props}
        />
    ),
);

Table.displayName = "Table";

const TableHeader = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));

TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tbody
        ref={ref}
        className={cn("[&_tr:last-child]:border-0", className)}
        {...props}
    />
));

TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn(
            "border-b border-neutral-100 transition-colors",
            className,
        )}
        {...props}
    />
));

TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={cn(
            "h-12 px-4 text-center align-middle font-medium",
            className,
        )}
        {...props}
    />
));

TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={cn("px-4 py-4 align-middle", className)}
        {...props}
    />
));

TableCell.displayName = "TableCell";

// ==========================================
// DYNAMIC TABLE
// ==========================================

export const DynamicTable = <TData extends object>({
    title,
    data,
    columns,

    onChoose,
    useCanMutation = true,

    pageSize: initialPageSize = 10,
    totalItems,
    currentPage: externalPage,

    onPageChange,
    onPageSizeChange,

    isLoading = false,
    emptyMessage = "Không có dữ liệu",
    description = "Danh sách dữ liệu hệ thống",

    getRowId,
}: DynamicTableProps<TData>) => {
    const [internalPage, setInternalPage] = React.useState(1);

    const [internalPageSize, setInternalPageSize] =
        React.useState(initialPageSize);

    const currentPage = externalPage ?? internalPage;
    const pageSize = internalPageSize;

    const visibleColumns = React.useMemo(
        () => columns.filter((column) => !column.hidden),
        [columns],
    );

    const hasActions = Boolean(onChoose && useCanMutation);

    const total = totalItems ?? data.length;

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const displayedData = React.useMemo(() => {
        if (totalItems !== undefined) {
            return data;
        }

        const start = (currentPage - 1) * pageSize;

        return data.slice(start, start + pageSize);
    }, [data, currentPage, pageSize, totalItems]);

    const startIndex = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;

    const endIndex = Math.min(currentPage * pageSize, total);

    const handlePageChange = (page: number) => {
        const nextPage = Math.max(1, Math.min(page, totalPages));

        if (onPageChange) {
            onPageChange(nextPage);
        } else {
            setInternalPage(nextPage);
        }
    };

    const handlePageSizeChange = (size: number) => {
        setInternalPageSize(size);

        if (!onPageChange) {
            setInternalPage(1);
        }

        onPageSizeChange?.(size);
        onPageChange?.(1);
    };

    const getCellValue = (item: TData, key: keyof TData | string) => {
        return (item as Record<string, unknown>)[String(key)];
    };

    const getAlignment = (align?: "left" | "center" | "right") => {
        switch (align) {
            case "center":
                return "text-center";
            case "right":
                return "text-right";
            default:
                return "text-left";
        }
    };

    return (
        <div
            className={cn(
                "flex w-full min-h-0 min-w-0 flex-1 flex-col",
                "overflow-hidden rounded-2xl",
                "border border-neutral-100 bg-white shadow-sm",
            )}
        >
            {/* ======================================
                HEADER
            ====================================== */}
            <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-5 py-4 sm:px-6">
                <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold tracking-tight text-neutral-800">
                        {title}
                    </h2>

                    <p className="mt-1 text-xs text-neutral-400">
                        {description}
                    </p>
                </div>
            </div>

            {/* ======================================
                TABLE CONTAINER
                Chỉ khu vực này được phép scroll
            ====================================== */}
            <div
                className={cn(
                    "relative min-h-0 min-w-0 flex-1",
                    "overflow-auto",
                    "overscroll-contain",
                )}
            >
                <Table className="w-full min-w-[800px] border-separate border-spacing-0">
                    {/* TABLE HEADER */}
                    <TableHeader className="sticky top-0 z-20 bg-[#fafafa]">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="sticky left-0 z-30 w-16 min-w-16 border-b border-neutral-100 bg-[#fafafa] text-center">
                                <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                                    STT
                                </span>
                            </TableHead>

                            {visibleColumns.map((column, index) => (
                                <TableHead
                                    key={`${String(column.key)}-${index}`}
                                    style={{ width: column.width }}
                                    className={cn(
                                        "whitespace-nowrap border-b border-neutral-100 bg-[#fafafa]",
                                        getAlignment(column.align),
                                    )}
                                >
                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                                        {column.title}
                                    </span>
                                </TableHead>
                            ))}

                            {hasActions && (
                                <TableHead className="sticky right-0 z-30 min-w-[110px] border-b border-neutral-100 bg-[#fafafa] text-center">
                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                                        Thao tác
                                    </span>
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>

                    {/* TABLE BODY */}
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: pageSize }).map((_, index) => (
                                <TableRow key={`loading-${index}`}>
                                    <TableCell className="sticky left-0 bg-white text-center">
                                        <div className="mx-auto h-3 w-5 animate-pulse rounded bg-neutral-200" />
                                    </TableCell>

                                    {visibleColumns.map((column, i) => (
                                        <TableCell
                                            key={`${String(column.key)}-${i}`}
                                        >
                                            <div
                                                className="h-3 animate-pulse rounded bg-neutral-200"
                                                style={{
                                                    width: `${55 + (i % 3) * 15}%`,
                                                }}
                                            />
                                        </TableCell>
                                    ))}

                                    {hasActions && (
                                        <TableCell className="sticky right-0 bg-white">
                                            <div className="mx-auto h-7 w-16 animate-pulse rounded bg-neutral-200" />
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : displayedData.length > 0 ? (
                            displayedData.map((item, index) => (
                                <TableRow
                                    key={
                                        getRowId
                                            ? getRowId(item)
                                            : String(
                                                  getCellValue(item, "id") ??
                                                      `${currentPage}-${index}`,
                                              )
                                    }
                                    className="group hover:bg-[#fffaf8]"
                                >
                                    {/* STT */}
                                    <TableCell className="sticky left-0 z-10 w-16 bg-white text-center text-xs font-medium text-neutral-400 transition-colors group-hover:bg-[#fffaf8]">
                                        {startIndex + index}
                                    </TableCell>

                                    {/* CELLS */}
                                    {visibleColumns.map(
                                        (column, columnIndex) => (
                                            <TableCell
                                                key={`${String(column.key)}-${columnIndex}`}
                                                className={cn(
                                                    "whitespace-nowrap text-[13px] text-neutral-600",
                                                    getAlignment(column.align),
                                                )}
                                            >
                                                {column.render
                                                    ? column.render(
                                                          item,
                                                          startIndex + index,
                                                      )
                                                    : String(
                                                          getCellValue(
                                                              item,
                                                              column.key,
                                                          ) ?? "-",
                                                      )}
                                            </TableCell>
                                        ),
                                    )}

                                    {/* ACTIONS */}
                                    {hasActions && (
                                        <TableCell className="sticky right-0 z-10 bg-white text-center transition-colors group-hover:bg-[#fffaf8]">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    type="button"
                                                    title="Chỉnh sửa"
                                                    onClick={() =>
                                                        onChoose?.(item, "edit")
                                                    }
                                                    className="grid size-8 place-items-center rounded-lg text-neutral-400 transition hover:bg-[#fff1ed] hover:text-[#dc3b2f]"
                                                >
                                                    <Edit size={16} />
                                                </button>

                                                <button
                                                    type="button"
                                                    title="Xóa"
                                                    onClick={() =>
                                                        onChoose?.(
                                                            item,
                                                            "delete",
                                                        )
                                                    }
                                                    className="grid size-8 place-items-center rounded-lg text-neutral-400 transition hover:bg-red-50 hover:text-red-500"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="hover:bg-transparent">
                                <TableCell
                                    colSpan={
                                        visibleColumns.length +
                                        1 +
                                        (hasActions ? 1 : 0)
                                    }
                                    className="h-64 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="grid size-14 place-items-center rounded-full bg-neutral-50">
                                            <Inbox
                                                size={26}
                                                className="text-neutral-300"
                                            />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-neutral-600">
                                                {emptyMessage}
                                            </p>

                                            <p className="mt-1 text-xs text-neutral-400">
                                                Hiện tại chưa có dữ liệu để hiển
                                                thị.
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ======================================
                PAGINATION
            ====================================== */}
            <div className="flex shrink-0 flex-col gap-3 border-t border-neutral-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-xs text-neutral-500">
                    Hiển thị{" "}
                    <span className="font-medium text-neutral-800">
                        {startIndex}–{endIndex}
                    </span>{" "}
                    trên{" "}
                    <span className="font-medium text-neutral-800">
                        {total}
                    </span>{" "}
                    kết quả
                </p>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <select
                        value={pageSize}
                        onChange={(event) =>
                            handlePageSizeChange(Number(event.target.value))
                        }
                        className="h-9 rounded-lg border border-neutral-200 bg-white px-2 text-xs text-neutral-600 outline-none transition focus:border-[#dc3b2f]"
                    >
                        {[5, 10, 20, 50].map((size) => (
                            <option key={size} value={size}>
                                {size} / trang
                            </option>
                        ))}
                    </select>

                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            disabled={currentPage <= 1}
                            onClick={() => handlePageChange(1)}
                            className="grid size-8 place-items-center rounded-lg text-neutral-500 transition hover:bg-[#fff1ed] hover:text-[#dc3b2f] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <ChevronsLeft size={16} />
                        </button>

                        <button
                            type="button"
                            disabled={currentPage <= 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="grid size-8 place-items-center rounded-lg text-neutral-500 transition hover:bg-[#fff1ed] hover:text-[#dc3b2f] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <span className="min-w-16 text-center text-xs font-medium text-neutral-700">
                            {currentPage} / {totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={currentPage >= totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="grid size-8 place-items-center rounded-lg text-neutral-500 transition hover:bg-[#fff1ed] hover:text-[#dc3b2f] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <ChevronRight size={16} />
                        </button>

                        <button
                            type="button"
                            disabled={currentPage >= totalPages}
                            onClick={() => handlePageChange(totalPages)}
                            className="grid size-8 place-items-center rounded-lg text-neutral-500 transition hover:bg-[#fff1ed] hover:text-[#dc3b2f] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <ChevronsRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
