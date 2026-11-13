import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { api } from "app/configs/ky-config";
import { ApiError, type ApiErrorData, type ApiResponse } from "app/types/api-error";
import { HTTPError } from "ky";

type Method = "get" | "post" | "put" | "delete"

type ResponseType = "json" | "blob";

const checkApiResponse = <T>(response: ApiResponse<T>): T => {
  const data = response.data as ApiErrorData;

  if (data?.status >= 400) {
    throw new ApiError(data.message, data.status);
  }

  if (!response.success) {
    throw new ApiError(response.message || "Có lỗi xảy ra");
  }

  return response.data;
};

export const useMutationRequest = <TData, TVariables = unknown>({
  key,
  url: defaultUrl,
  method: defaultMethod = "post",
  responseType = "json",
  options,
}: {
  key: string[];
  url: string;
  method: Exclude<Method, "get">;
  responseType?: ResponseType;
  options?: UseMutationOptions<TData, ApiError, TVariables>;
}) => {
  return useMutation<TData, ApiError, TVariables>({
    mutationKey: key,

    mutationFn: async (variables: TVariables): Promise<TData> => {
      try {
        const isFormData = variables instanceof FormData;

        const response = await api(defaultUrl, {
          method: defaultMethod,
          body: isFormData ? variables : undefined,
          json: isFormData ? undefined : variables,
        });

        if (responseType === "blob") {
          return await response.blob() as TData;
        }

        const result = await response.json<ApiResponse<TData>>();

        return checkApiResponse(result);
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }

        if (error instanceof HTTPError) {
          const body = await error.response.clone().json() as {
            message?: string;
            data?: { message?: string };
          };

          throw new ApiError(
            body.data?.message ?? body.message ?? error.message,
            error.response.status,
          );
        }

        throw new ApiError(
          error instanceof Error ? error.message : "Có lỗi xảy ra",
        );
      }
    },

    ...options,
  });
};