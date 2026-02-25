function cleanUrl(url: string) {
  return url.replace(/\/$/, "");
}

export const env = {
  wpUrl: cleanUrl(process.env.WP_URL || ""),
  wcConsumerKey: process.env.WC_CONSUMER_KEY || "",
  wcConsumerSecret: process.env.WC_CONSUMER_SECRET || "",
  revalidateSeconds: Number(process.env.REVALIDATE_SECONDS || 60),
  wpRevalidateSecret: process.env.WP_REVALIDATE_SECRET || "",
  siteUrl: cleanUrl(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
};

export const flags = {
  hasWpUrl: Boolean(env.wpUrl),
  hasWoo: Boolean(env.wcConsumerKey && env.wcConsumerSecret),
  hasRevalidateSecret: Boolean(env.wpRevalidateSecret)
};
