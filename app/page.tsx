import { HomeLandingFooter } from "@/components/home/HomeLandingFooter";
import { HomeLandingHeader } from "@/components/home/HomeLandingHeader";
import { HomeLandingHero } from "@/components/home/HomeLandingHero";
import { HomeLivePreview } from "@/components/home/HomeLivePreview";
import { HomeSetupAssistant } from "@/components/HomeSetupAssistant";
import { env, flags } from "@/lib/env";
import { getProducts, isWooEnabled } from "@/lib/woo";
import { getPages, getPosts } from "@/lib/wp";

async function loadPreviewData() {
  const [posts, pages, products] = await Promise.all([
    flags.hasWpUrl ? getPosts({ perPage: 3 }).catch(() => []) : Promise.resolve([]),
    flags.hasWpUrl ? getPages({ perPage: 4 }).catch(() => []) : Promise.resolve([]),
    isWooEnabled() ? getProducts({ perPage: 4 }).catch(() => []) : Promise.resolve([])
  ]);

  return { posts, pages, products };
}

export default async function HomePage() {
  const { posts, pages, products } = await loadPreviewData();
  const hasLivePreview = posts.length > 0 || pages.length > 0 || products.length > 0;

  return (
    <section className="stack homeLanding">
      <HomeLandingHeader />
      <HomeLandingHero
        hasWpUrl={flags.hasWpUrl}
        hasWoo={flags.hasWoo}
        hasRevalidateSecret={flags.hasRevalidateSecret}
      />
      <HomeSetupAssistant defaultWpUrl={env.wpUrl} />
      <HomeLivePreview posts={posts} pages={pages} products={products} hasLivePreview={hasLivePreview} />
      <HomeLandingFooter />
    </section>
  );
}
