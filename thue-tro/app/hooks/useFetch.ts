import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { api } from "app/configs/ky-config";
import { ApiError } from "app/types/api-error";

export interface DataResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: unknown
}

export const useFetch = <
    TQueryFnData,
    TData = TQueryFnData
>({
    url,
    key,
    options
}: {
    url: string
    key: string[]
    options?: Omit<
        UseQueryOptions<TQueryFnData, ApiError, TData>,
        "queryKey" | "queryFn"
    >
}) => {

    const fetchAPI = async (): Promise<TQueryFnData> => {
        const response: DataResponse<TQueryFnData> = await api.get(url).json();

        if (response.success) {
            return response.data as TQueryFnData;
        }

        throw new ApiError(response.message || "Request failed");
    };

    return useQuery<TQueryFnData, ApiError, TData>({
        queryKey: key,
        queryFn: fetchAPI,
        refetchOnWindowFocus: false,
        enabled: true,
        ...options,
    });
};