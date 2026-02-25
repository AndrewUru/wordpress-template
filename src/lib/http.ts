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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    const text = await res.text();

    if (!res.ok) {
      throw new HttpError(`HTTP ${res.status} for ${url}`, res.status, text);
    }

    if (!text) {
      return null as T;
    }

    return JSON.parse(text) as T;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON response from ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
