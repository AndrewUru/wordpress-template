import { env, flags } from "@/lib/env";
import { fetchJson } from "@/lib/http";
import type { WPPage, WPPost, WPType, WPTypesMap } from "@/lib/types";

type Query = {
  perPage?: number;
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

export async function wpFetch<T>(path: string, tags: string[] = []): Promise<T> {
  const url = `${env.wpUrl}/wp-json/wp/v2/${path}`;

  return fetchJson<T>(url, {
    headers: { "Content-Type": "application/json" },
    next: {
      revalidate: env.revalidateSeconds,
      tags
    }
  });
}

export async function getPosts({ perPage = 10 }: Query = {}): Promise<WPPost[]> {
  if (!flags.hasWpUrl) return [];
  return wpFetch<WPPost[]>(`posts${queryString({ per_page: perPage, _embed: true })}`, ["wp:posts"]);
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  if (!flags.hasWpUrl) return null;
  const posts = await wpFetch<WPPost[]>(`posts${queryString({ slug, _embed: true })}`, ["wp:posts"]);
  return posts[0] ?? null;
}

export async function getPages({ perPage = 100 }: Query = {}): Promise<WPPage[]> {
  if (!flags.hasWpUrl) return [];
  return wpFetch<WPPage[]>(`pages${queryString({ per_page: perPage })}`, ["wp:pages"]);
}

export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  if (!flags.hasWpUrl) return null;
  const pages = await wpFetch<WPPage[]>(`pages${queryString({ slug })}`, ["wp:pages"]);
  return pages[0] ?? null;
}

export async function getTypes(): Promise<WPType[]> {
  if (!flags.hasWpUrl) return [];
  const raw = await fetchJson<WPTypesMap>(`${env.wpUrl}/wp-json/wp/v2/types`, {
    next: {
      revalidate: env.revalidateSeconds,
      tags: ["wp:types"]
    }
  });

  return Object.values(raw).filter((type) => {
    return Boolean(type?.slug && type?.viewable !== false && type?.rest_namespace === "wp/v2");
  });
}

async function resolveRestBase(typeSlug: string): Promise<string> {
  const types = await getTypes();
  const type = types.find((item) => item.slug === typeSlug);
  return type?.rest_base || typeSlug;
}

export async function getEntries(typeSlug: string, { perPage = 10 }: Query = {}) {
  if (!flags.hasWpUrl) return [];
  const restBase = await resolveRestBase(typeSlug);
  return wpFetch<WPPost[]>(`${restBase}${queryString({ per_page: perPage })}`, [`wp:cpt:${typeSlug}`]);
}

export async function getEntryBySlug(typeSlug: string, slug: string) {
  if (!flags.hasWpUrl) return null;
  const restBase = await resolveRestBase(typeSlug);
  const entries = await wpFetch<WPPost[]>(`${restBase}${queryString({ slug })}`, [`wp:cpt:${typeSlug}`]);
  return entries[0] ?? null;
}
