/* eslint-disable @typescript-eslint/consistent-type-definitions */
type QueryParams = Record<string, string | number | boolean>;
export interface ApiRequestOptions extends RequestInit {
    queryParams?: QueryParams;
}

export class ApiClient {
    protected baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private prepareBody(body: BodyInit | null | undefined, headers: Headers): BodyInit | null {
        if (!body) return null;

        if (body instanceof FormData) {
            return body;
        }

        if (typeof body === "object") {
            headers.set("Content-Type", "application/json");
            return JSON.stringify(body);
        }

        return body;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}, queryParams?: QueryParams): Promise<T> {
        const url = new URL(endpoint, this.baseUrl);
        const params = new URLSearchParams(
            Object.entries(queryParams || {}).map(([key, value]) => [key, String(value)]),
        );
        url.search = params.toString();

        const headers = new Headers(options.headers);
        const body = this.prepareBody(options.body, headers);

        if (!headers.has("Accept")) {
            headers.set("Accept", "application/json");
        }

        const response = await fetch(url, { ...options, headers, body });

        if (!response.ok) {
            throw new HttpError(response);
        }

        if (response.status === 204 || response.headers.get("Content-Length") === "0") {
            return undefined as T;
        }

        return (await response.json()) as T;
    }

    public get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: "GET" }, options?.queryParams);
    }

    public post<T>(endpoint: string, body: BodyInit, options?: ApiRequestOptions): Promise<T> {
        return this.request<T>(
            endpoint,
            {
                ...options,
                method: "POST",
                body,
            },
            options?.queryParams,
        );
    }
}

class HttpError extends Error {
    status: number;
    statusText: string;
    response: Response;

    constructor(response: Response) {
        super(`HTTP error! Status: ${response.status}`);
        this.name = "HttpError";
        this.status = response.status;
        this.statusText = response.statusText;
        this.response = response;
    }
}
