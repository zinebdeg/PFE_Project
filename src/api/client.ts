// Server-only API client — never imported from client code
const BASE_URL = process.env.MARKOUB_API_URL || 'https://b2b-api.markoub.dev';
const API_TOKEN = process.env.MARKOUB_API_TOKEN || '';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: string;
    params?: Record<string, string | number | undefined>;
    body?: unknown;
  } = {},
): Promise<T> {
  const { method = 'GET', params, body } = options;

  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        searchParams.set(key, String(value));
      }
    }
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  };

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    console.log(`[API] ${method} ${url}`);
    try {
      const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (res.ok) {
        return (await res.json()) as T;
      }

      if (res.status === 429 || res.status >= 500) {
        const text = await res.text().catch(() => 'No body');
        console.error(`[API] Error ${res.status} body:`, text);
        lastError = new ApiError(res.status, 'retry', `API error ${res.status}: ${text}`);
        await sleep(1000 * Math.pow(2, attempt));
        continue;
      }

      const errorBody = await res.json().catch(() => ({}));
      throw new ApiError(
        res.status,
        errorBody?.data?.code || 'unknown',
        errorBody?.data?.message || `API error ${res.status}`,
      );
    } catch (err) {
      if (err instanceof ApiError && err.statusCode !== 429 && err.statusCode < 500) {
        throw err;
      }
      lastError = err as Error;
      if (attempt < 2) await sleep(1000 * Math.pow(2, attempt));
    }
  }

  throw lastError || new Error('API request failed');
}
