import ky, { HTTPError } from "ky";

export const api = ky.create({
    prefix: import.meta.env.VITE_API_URL,
    timeout: 20000,

    retry: {
        limit: 2,
        methods: ["get", "post", "put", "delete", "patch"],
        statusCodes: [408, 413, 429, 500, 502, 503, 504],
    },

    hooks: {
        beforeRequest: [
            ({ request }) => {
                const url = new URL(request.url);
                for (const [key, value] of url.searchParams.entries()) {
                    if (value.trim() === "") {
                        url.searchParams.delete(key);
                    }
                }
                const jwt = localStorage.getItem("jwt");

                if (jwt) {
                    try {
                        const token = JSON.parse(jwt)?.access_token;

                        if (token) {
                            request.headers.set(
                                "Authorization",
                                `Bearer ${token}`,
                            );
                        }
                    } catch (error) {
                        console.error("JWT parse error:", error);
                    }
                }
            },
        ],

        afterResponse: [
            async ({ request, response }) => {
                const url = new URL(request.url);

                if (
                    response.status === 401 &&
                    !url.pathname.includes("/dang-nhap-hoac-dang-ky") &&
                    !window.location.pathname.includes("/dang-nhap-hoac-dang-ky")
                ) {
                    localStorage.clear();
                    const currentUrl =
                        window.location.pathname + window.location.search;
                    const loginUrl = new URL(
                        "/dang-nhap-hoac-dang-ky",
                        window.location.origin,
                    );
                    loginUrl.searchParams.set("redirect", currentUrl);
                    window.location.href = loginUrl.toString();
                }
            },
        ],

        beforeError: [
            async ({ error }) => {
                if (error instanceof HTTPError) {
                    try {
                        const data = await error.response.clone().json() as {
                            message?: string | string[];
                        };

                        if (data.message) {
                            error.message = Array.isArray(data.message)
                                ? data.message.join(", ")
                                : data.message;
                        }
                    } catch {
                        // Giữ nguyên error message
                    }
                }

                return error;
            },
        ],
    },
});
