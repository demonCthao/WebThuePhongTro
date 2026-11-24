import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { api } from "app/configs/ky-config";
import { ApiError, type ApiErrorData, type ApiResponse } from "app/types/api-error";
import { HTTPError } from "ky";

type Method = "get" | "post" | "put" | "delete" | "patch"

type ResponseType = "json" | "blob";

const API_URL = import.meta.env.VITE_API_URL as string;

const getToken = (): string | undefined => {
  try {
    return JSON.parse(localStorage.getItem("jwt") || "{}")?.access_token;
  } catch {
    return undefined;
  }
};

const sendFormData = async (url: string, method: string, body: FormData) => {
  const token = getToken();
  const res = await fetch(
    `${API_URL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`,
    {
      method: method.toUpperCase(),
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }, // KHÔNG tự đặt Content-Type
      body,
    },
  );

  if (!res.ok) {
    const data = (await res.clone().json().catch(() => ({}))) as {
      message?: string | string[];
    };
    const message = Array.isArray(data.message)
      ? data.message.join(", ")
      : (data.message ?? res.statusText);
    throw new ApiError(message, res.status);
  }
  return res;
};

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
  url: string | ((variables: TVariables) => string);
  method: Exclude<Method, "get">;
  responseType?: ResponseType;
  options?: UseMutationOptions<TData, ApiError, TVariables>;
}) => {
  return useMutation<TData, ApiError, TVariables>({
    mutationKey: key,

    mutationFn: async (variables: TVariables): Promise<TData> => {
      try {
        const requestUrl =
          typeof defaultUrl === "function"
            ? defaultUrl(variables)
            : defaultUrl;

        const isFormData = variables instanceof FormData;

        let response;

        if (isFormData) {
          const res = await sendFormData(requestUrl, defaultMethod, variables);

          if (responseType === "blob") return (await res.blob()) as TData;
          return checkApiResponse((await res.json()) as ApiResponse<TData>);
        }

        response = await api(requestUrl, {
          method: defaultMethod,
          json: variables,
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
            message?: string | string[];
            data?: {
              message?: string;
            };
          };

          const message =
            body.data?.message ??
            (Array.isArray(body.message)
              ? body.message.join(", ")
              : body.message) ??
            error.message;

          throw new ApiError(
            message,
            error.response.status,
          );
        }

        throw new ApiError(
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra",
        );
      }
    },

    ...options,
  });
};

