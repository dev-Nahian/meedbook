const getResolvedBaseUrl = (): string => {
  const raw = import.meta.env.VITE_API_BASE_URL;
  // If undefined, empty, or pointing to old dead domain, fallback to "/api"
  if (!raw || typeof raw !== "string" || raw.includes("softvencealpha.com")) {
    return "/api";
  }
  return raw;
};

export const API_BASE_URL = getResolvedBaseUrl();

export const normalizeUrl = (path: string): string => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const base = getResolvedBaseUrl().trim().replace(/\/+$/, "");
  const cleanPath = path.trim().replace(/^\/+/, "");
  return `${base}/${cleanPath}`;
};

export type ApiEnvelope<T> = {
  status: number;
  success: boolean;
  message: string;
  data: T;
};

export type ApiErrorBody = {
  message?: string;
  detail?: string;
  error?: string;
  errors?: Record<string, string[] | string>;
  success?: boolean;
  [key: string]: unknown;
};

export class ApiClientError extends Error {
  status?: number;
  details?: ApiErrorBody;

  constructor(message: string, status?: number, details?: ApiErrorBody) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.details = details;
  }
}

export const extractErrorMessage = (
  body: ApiErrorBody | string | null | undefined,
  status?: number,
  fallback = "Something went wrong. Please try again."
): string => {
  if (!body) {
    if (status === 400) return "Invalid request. Please check your information and try again.";
    if (status === 401) return "Invalid credentials or session expired. Please try again.";
    if (status === 404) return "Requested API endpoint not found (404). Please ensure the dev server proxy is active.";
    if (status === 403) return "Access forbidden (403). Please verify your account permissions.";
    if (status === 405) return "Method not allowed (405). The server rejected this HTTP method.";
    if (status && status >= 500) return `Backend service temporarily unavailable (${status}). Please try again shortly.`;
    return fallback;
  }

  if (typeof body === "string") {
    const text = body.trim();
    if (text.includes("<html") || text.includes("<!DOCTYPE")) {
      if (status === 200) {
        return "API endpoint returned an HTML page instead of JSON. Please ensure the dev server proxy is active.";
      }
      if (status === 404) return "Requested API endpoint not found (404). Please verify the server connection.";
      if (status === 403) return "Access forbidden (403).";
      if (status === 405) return "Method not allowed (405). The server rejected this HTTP method.";
      if (status && status >= 500) return `Backend service temporarily unavailable (${status}).`;
      return "Backend service returned an invalid HTML response. Please verify the API proxy.";
    }
    return text || fallback;
  }

  if (typeof body === "object") {
    if (body.message && typeof body.message === "string" && body.message.trim()) {
      return body.message;
    }
    if (body.detail && typeof body.detail === "string" && body.detail.trim()) {
      return body.detail;
    }
    if (body.error && typeof body.error === "string" && body.error.trim()) {
      return body.error;
    }

    // Nested in data: { data: { message: "..." } }
    if (body.data && typeof body.data === "object") {
      const d = body.data as Record<string, unknown>;
      if (typeof d.message === "string" && d.message.trim()) return d.message;
      if (typeof d.detail === "string" && d.detail.trim()) return d.detail;
      if (typeof d.error === "string" && d.error.trim()) return d.error;
    }

    // Nested in errors: { errors: { email: ["..."] } }
    if (body.errors && typeof body.errors === "object") {
      const firstError = Object.values(body.errors)[0];
      if (Array.isArray(firstError) && firstError.length > 0) return String(firstError[0]);
      if (typeof firstError === "string" && firstError.trim()) return firstError;
    }

    // DRF Serializer field errors: { email: ["..."], phone: ["..."], non_field_errors: ["..."] }
    for (const [key, value] of Object.entries(body)) {
      if (["status", "success", "field", "code", "token"].includes(key)) continue;
      if (Array.isArray(value) && value.length > 0) {
        const prefix = key === "non_field_errors" || key === "detail" ? "" : `${key}: `;
        return `${prefix}${value[0]}`;
      }
      if (typeof value === "string" && value.trim()) {
        const prefix = key === "non_field_errors" || key === "detail" ? "" : `${key}: `;
        return `${prefix}${value}`;
      }
    }
  }

  if (status === 400) return "Invalid request. Please check your information and try again.";
  if (status === 401) return "Invalid credentials or session expired. Please try again.";
  if (status === 404) return "Requested API endpoint not found (404).";
  if (status === 403) return "Access forbidden (403).";
  if (status && status >= 500) return `Backend service temporarily unavailable (${status}).`;

  return fallback;
};

type TokenRefreshHandler = () => Promise<string | null>;
let onTokenExpiredHandler: TokenRefreshHandler | null = null;
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const setTokenExpiredHandler = (handler: TokenRefreshHandler) => {
  onTokenExpiredHandler = handler;
};

const handleTokenRefresh = async (): Promise<string | null> => {
  if (!onTokenExpiredHandler) return null;
  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = onTokenExpiredHandler().finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

export type ParsedResponse<T> = {
  data: T | null;
  rawText: string;
};

export const parseResponseBody = async <T>(response: Response): Promise<ParsedResponse<T>> => {
  const text = await response.text();
  if (!text) return { data: null, rawText: "" };

  try {
    return { data: JSON.parse(text) as T, rawText: text };
  } catch {
    return { data: null, rawText: text };
  }
};

export const parseJson = async <T>(response: Response): Promise<T | null> => {
  const { data } = await parseResponseBody<T>(response);
  return data;
};

type RequestOptions = {
  accessToken?: string | null;
  params?: Record<string, string | number | undefined>;
  _isRetry?: boolean;
};

const executeFetch = async <T>(
  url: string,
  init: RequestInit,
  options?: RequestOptions,
  retryFn?: (newToken: string) => Promise<T>
): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (fetchErr) {
    const errText = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
    if (
      errText.includes("Failed to fetch") ||
      errText.includes("NetworkError") ||
      errText.includes("fetch failed")
    ) {
      throw new ApiClientError(
        "Unable to connect to the backend server. Please verify your network and ensure the local dev server is running.",
        undefined
      );
    }
    throw fetchErr;
  }

  if (response.status === 401 && options?.accessToken && !options._isRetry && retryFn) {
    const newToken = await handleTokenRefresh();
    if (newToken) {
      return await retryFn(newToken);
    }
  }

  const { data: body, rawText } = await parseResponseBody<T & ApiErrorBody>(response);

  if (!response.ok || (body && typeof body === "object" && "success" in body && body.success === false)) {
    const errorDetails = body ?? (rawText ? { raw: rawText } : undefined);
    throw new ApiClientError(
      extractErrorMessage(body ?? rawText, response.status),
      response.status,
      errorDetails
    );
  }

  if (!body) {
    if (response.ok && init.method === "DELETE") {
      return {} as T;
    }
    if (rawText && (rawText.includes("<!DOCTYPE") || rawText.includes("<html"))) {
      throw new ApiClientError(
        "API endpoint returned an HTML page instead of JSON. Please verify that the API proxy is running.",
        response.status
      );
    }
    throw new ApiClientError(extractErrorMessage(rawText || null, response.status), response.status);
  }

  return body as T;
};

export const apiGet = async <T>(
  path: string,
  options?: RequestOptions
): Promise<T> => {
  let url = normalizeUrl(path);

  if (options?.params) {
    const query = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.append(key, String(value));
      }
    });
    const queryString = query.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  return executeFetch<T>(
    url,
    {
      headers: options?.accessToken
        ? { Authorization: `Bearer ${options.accessToken}` }
        : undefined,
    },
    options,
    (newToken) => apiGet<T>(path, { ...options, accessToken: newToken, _isRetry: true })
  );
};

export const apiPostForm = async <T>(
  path: string,
  formData: FormData,
  options?: RequestOptions
): Promise<T> => {
  return executeFetch<T>(
    normalizeUrl(path),
    {
      method: "POST",
      headers: options?.accessToken
        ? { Authorization: `Bearer ${options.accessToken}` }
        : undefined,
      body: formData,
    },
    options,
    (newToken) => apiPostForm<T>(path, formData, { ...options, accessToken: newToken, _isRetry: true })
  );
};

export const apiPostJson = async <T>(
  path: string,
  data: unknown,
  options?: RequestOptions
): Promise<T> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options?.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  return executeFetch<T>(
    normalizeUrl(path),
    {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    },
    options,
    (newToken) => apiPostJson<T>(path, data, { ...options, accessToken: newToken, _isRetry: true })
  );
};

export const apiPutForm = async <T>(
  path: string,
  formData: FormData,
  options?: RequestOptions
): Promise<T> => {
  return executeFetch<T>(
    normalizeUrl(path),
    {
      method: "PUT",
      headers: options?.accessToken
        ? { Authorization: `Bearer ${options.accessToken}` }
        : undefined,
      body: formData,
    },
    options,
    (newToken) => apiPutForm<T>(path, formData, { ...options, accessToken: newToken, _isRetry: true })
  );
};

export const apiPutJson = async <T>(
  path: string,
  data: unknown,
  options?: RequestOptions
): Promise<T> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options?.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  return executeFetch<T>(
    normalizeUrl(path),
    {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    },
    options,
    (newToken) => apiPutJson<T>(path, data, { ...options, accessToken: newToken, _isRetry: true })
  );
};

export const apiPatchForm = async <T>(
  path: string,
  formData: FormData,
  options?: RequestOptions
): Promise<T> => {
  return executeFetch<T>(
    normalizeUrl(path),
    {
      method: "PATCH",
      headers: options?.accessToken
        ? { Authorization: `Bearer ${options.accessToken}` }
        : undefined,
      body: formData,
    },
    options,
    (newToken) => apiPatchForm<T>(path, formData, { ...options, accessToken: newToken, _isRetry: true })
  );
};

export const apiPatchJson = async <T>(
  path: string,
  data: unknown,
  options?: RequestOptions
): Promise<T> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options?.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  return executeFetch<T>(
    normalizeUrl(path),
    {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    },
    options,
    (newToken) => apiPatchJson<T>(path, data, { ...options, accessToken: newToken, _isRetry: true })
  );
};

export const apiDelete = async <T>(
  path: string,
  options?: RequestOptions
): Promise<T> => {
  return executeFetch<T>(
    normalizeUrl(path),
    {
      method: "DELETE",
      headers: options?.accessToken
        ? { Authorization: `Bearer ${options.accessToken}` }
        : undefined,
    },
    options,
    (newToken) => apiDelete<T>(path, { ...options, accessToken: newToken, _isRetry: true })
  );
};


