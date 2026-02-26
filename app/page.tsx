import { HomeLandingFooter } from "@/components/home/HomeLandingFooter";
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
    <section className="docCyberPage homeCyberPage" aria-label="Home cyber">
      <div className="docScanlines" />
      <div className="docVignette" />
      <div className="docNoise" />

      <div className="docHud" aria-hidden="true">
        <div className="docHudRow">
          <span>
            home: <strong>active</strong>
          </span>
          <span className="docHudLine" />
          <span>next-wp-woo</span>
        </div>
        <div className="docHudRow">
          <span>pipeline://bootstrap</span>
          <span className="docHudLine" />
          <span>
            sync: <strong>ready</strong>
          </span>
        </div>
      </div>

      <div className="homeCyberContent">
        <div className="docBigText">launch</div>
        <section className="stack homeLanding">
          <HomeLandingHero
            hasWpUrl={flags.hasWpUrl}
            hasWoo={flags.hasWoo}
            hasRevalidateSecret={flags.hasRevalidateSecret}
          />
          <HomeSetupAssistant defaultWpUrl={env.wpUrl} />
          <HomeLivePreview posts={posts} pages={pages} products={products} hasLivePreview={hasLivePreview} />
          <HomeLandingFooter />
        </section>
      </div>
    </section>
  );
}
