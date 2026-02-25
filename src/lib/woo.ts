import { env, flags } from "@/lib/env";
import { fetchJson } from "@/lib/http";
import type { WCCategory, WCProduct } from "@/lib/types";

type ProductQuery = {
  perPage?: number;
  featured?: boolean;
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

  const url = `${env.wpUrl}/wp-json/wc/v3/${path}`;
  return fetchJson<T>(url, {
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json"
    },
    next: {
      revalidate: env.revalidateSeconds,
      tags
    }
  });
}

export async function getProducts({ perPage = 12, featured }: ProductQuery = {}): Promise<WCProduct[]> {
  return wooFetch<WCProduct[]>(`products${queryString({ per_page: perPage, status: "publish", featured })}`, ["woo:products"]);
}

export async function getProductBySlug(slug: string): Promise<WCProduct | null> {
  const products = await wooFetch<WCProduct[]>(`products${queryString({ slug, status: "publish" })}`, ["woo:products"]);
  return products[0] ?? null;
}

export async function getProductCategories(): Promise<WCCategory[]> {
  return wooFetch<WCCategory[]>(`products/categories${queryString({ per_page: 100 })}`, ["woo:categories"]);
}
