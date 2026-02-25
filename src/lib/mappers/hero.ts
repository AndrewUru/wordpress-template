import type { HeroProps } from "@/components/blocks/Hero";

export function mapHeroFromAcf(acf?: Record<string, any>): HeroProps | null {
  if (!acf || typeof acf !== "object") {
    return null;
  }

  const title = acf.hero_title;
  if (!title) {
    return null;
  }

  return {
    title,
    subtitle: acf.hero_subtitle,
    ctaLabel: acf.hero_cta_label,
    ctaUrl: acf.hero_cta_url
  };
}
