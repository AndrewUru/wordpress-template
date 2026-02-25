export class HttpError extends Error {
  status: number;
  body: string;

  constructor(message: string, status: number, body: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.body = body;
  }
}

export async function fetchJson<T>(
  url: string,
  init: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {},
  timeoutMs = 10000
): Promise<T> {
  const result = await fetchJsonWithMeta<T>(url, init, timeoutMs);
  return result.data;
}

export async function fetchJsonWithMeta<T>(
  url: string,
  init: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {},
  timeoutMs = 10000
): Promise<{ data: T; headers: Headers }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    const text = await res.text();

    if (!res.ok) {
      throw new HttpError(`HTTP ${res.status} for ${url}`, res.status, text);
    }

    if (!text) {
      return { data: null as T, headers: res.headers };
    }

    return { data: JSON.parse(text) as T, headers: res.headers };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON response from ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
