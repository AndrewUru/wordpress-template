import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "@/components/blocks/Hero";
import { HtmlContent } from "@/components/HtmlContent";
import { mapHeroFromAcf } from "@/lib/mappers/hero";
import { getPageBySlug } from "@/lib/wp";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);
  if (!page) {
    return { title: "Page not found" };
  }

  return {
    title: page.title.rendered,
    description: page.excerpt?.rendered?.replace(/<[^>]+>/g, "").slice(0, 160)
  };
}

export default async function GenericPage({ params }: Props) {
  const page = await getPageBySlug(params.slug);
  if (!page) notFound();

  const hero = mapHeroFromAcf(page.acf);

  return (
    <article className="stack contentPage">
      {hero ? <Hero {...hero} /> : null}
      <header className="contentHero contentHeroCompact">
        <p className="contentEyebrow">Page</p>
        <h1>{page.title.rendered}</h1>
      </header>
      <section className="card contentBodyCard">
        <HtmlContent html={page.content.rendered} />
      </section>
    </article>
  );
}
