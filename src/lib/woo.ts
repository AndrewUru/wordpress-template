import { env, flags } from "@/lib/env";
import { HttpError, fetchJson, fetchJsonWithMeta } from "@/lib/http";
import type { WCCategory, WCProduct, WCVariation } from "@/lib/types";

type ProductQuery = {
  perPage?: number;
  featured?: boolean;
  page?: number;
  categoryId?: number;
};

type ProductsPage = {
  items: WCProduct[];
  totalPages: number;
  total: number;
  page: number;
};

function queryString(params: Record<string, string | number | boolean | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.set(key, String(value));
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

function getAuthHeader() {
  const token = Buffer.from(`${env.wcConsumerKey}:${env.wcConsumerSecret}`).toString("base64");
  return `Basic ${token}`;
}

export function isWooEnabled() {
  return flags.hasWoo;
}

async function wooFetch<T>(path: string, tags: string[]): Promise<T> {
  if (!flags.hasWoo) {
    throw new Error("WooCommerce is not configured. Set WC_CONSUMER_KEY and WC_CONSUMER_SECRET.");
  }

  if (!flags.hasWpUrl) {
    throw new Error("WP_URL is required for WooCommerce REST requests.");
  }

  const baseUrl = `${env.wpUrl}/wp-json/wc/v3/${path}`;
  const next = {
    revalidate: env.revalidateSeconds,
    tags
  };

  try {
    return await fetchJson<T>(baseUrl, {
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json"
      },
      next
    });
  } catch (error) {
    // Some hosts strip Authorization header; retry using query auth parameters.
    if (!(error instanceof HttpError) || error.status !== 401) {
      throw error;
    }

    const separator = baseUrl.includes("?") ? "&" : "?";
    const fallbackUrl = `${baseUrl}${separator}consumer_key=${encodeURIComponent(env.wcConsumerKey)}&consumer_secret=${encodeURIComponent(env.wcConsumerSecret)}`;

    return fetchJson<T>(fallbackUrl, {
      headers: {
        "Content-Type": "application/json"
      },
      next
    });
  }
}

async function wooFetchWithMeta<T>(path: string, tags: string[]): Promise<{ data: T; headers: Headers }> {
  if (!flags.hasWoo) {
    throw new Error("WooCommerce is not configured. Set WC_CONSUMER_KEY and WC_CONSUMER_SECRET.");
  }

  if (!flags.hasWpUrl) {
    throw new Error("WP_URL is required for WooCommerce REST requests.");
  }

  const baseUrl = `${env.wpUrl}/wp-json/wc/v3/${path}`;
  const next = {
    revalidate: env.revalidateSeconds,
    tags
  };

  try {
    return await fetchJsonWithMeta<T>(baseUrl, {
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json"
      },
      next
    });
  } catch (error) {
    if (!(error instanceof HttpError) || error.status !== 401) {
      throw error;
    }

    const separator = baseUrl.includes("?") ? "&" : "?";
    const fallbackUrl = `${baseUrl}${separator}consumer_key=${encodeURIComponent(env.wcConsumerKey)}&consumer_secret=${encodeURIComponent(env.wcConsumerSecret)}`;

    return fetchJsonWithMeta<T>(fallbackUrl, {
      headers: {
        "Content-Type": "application/json"
      },
      next
    });
  }
}

export async function getProducts({ perPage = 12, featured }: ProductQuery = {}): Promise<WCProduct[]> {
  const result = await getProductsPage({ perPage, featured });
  return result.items;
}

export async function getProductsPage({
  perPage = 12,
  featured,
  page = 1,
  categoryId
}: ProductQuery = {}): Promise<ProductsPage> {
  const path = `products${queryString({
    per_page: perPage,
    status: "publish",
    featured,
    page,
    category: categoryId
  })}`;
  const { data, headers } = await wooFetchWithMeta<WCProduct[]>(path, ["woo:products"]);

  const totalPagesHeader = headers.get("x-wp-totalpages");
  const totalHeader = headers.get("x-wp-total");
  const totalPages = Number(totalPagesHeader || 1);
  const total = Number(totalHeader || data.length);

  return {
    items: data,
    totalPages: Number.isFinite(totalPages) ? totalPages : 1,
    total: Number.isFinite(total) ? total : data.length,
    page
  };
}

export async function getProductBySlug(slug: string): Promise<WCProduct | null> {
  const products = await wooFetch<WCProduct[]>(`products${queryString({ slug, status: "publish" })}`, ["woo:products"]);
  return products[0] ?? null;
}

export async function getProductCategories(): Promise<WCCategory[]> {
  return wooFetch<WCCategory[]>(`products/categories${queryString({ per_page: 100 })}`, ["woo:categories"]);
}

export async function getProductVariations(productId: number): Promise<WCVariation[]> {
  return wooFetch<WCVariation[]>(
    `products/${productId}/variations${queryString({ per_page: 100, status: "publish" })}`,
    ["woo:products"]
  );
}
