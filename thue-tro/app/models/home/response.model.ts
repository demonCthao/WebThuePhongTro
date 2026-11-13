export interface DataList<T> {
    list: T[];
    pageIndex: number;
    pageSize: number;
    total: number;
    totalPages: number;
}