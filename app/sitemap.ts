import type { MetadataRoute } from "next";
import { env, flags } from "@/lib/env";
import { getPages, getPosts } from "@/lib/wp";
import { getProducts, isWooEnabled } from "@/lib/woo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.siteUrl;

  const [posts, pages, products] = await Promise.all([
    flags.hasWpUrl ? getPosts({ perPage: 100 }).catch(() => []) : Promise.resolve([]),
    flags.hasWpUrl ? getPages({ perPage: 100 }).catch(() => []) : Promise.resolve([]),
    isWooEnabled() ? getProducts({ perPage: 100 }).catch(() => []) : Promise.resolve([])
  ]);

  return [
    { url: `${baseUrl}/` },
    { url: `${baseUrl}/blog` },
    { url: `${baseUrl}/shop` },
    ...posts.map((post) => ({ url: `${baseUrl}/blog/${post.slug}` })),
    ...pages.map((page) => ({ url: `${baseUrl}/page/${page.slug}` })),
    ...products.map((product) => ({ url: `${baseUrl}/product/${product.slug}` }))
  ];
}
