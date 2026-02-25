import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HtmlContent } from "@/components/HtmlContent";
import { getProductBySlug, isWooEnabled } from "@/lib/woo";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isWooEnabled()) {
    return { title: "WooCommerce not configured" };
  }

  const product = await getProductBySlug(params.slug);
  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.name,
    description: product.short_description?.replace(/<[^>]+>/g, "").slice(0, 160)
  };
}

export default async function ProductPage({ params }: Props) {
  if (!isWooEnabled()) {
    return (
      <section className="stack">
        <h1>WooCommerce not configured</h1>
        <p>Configure API keys to enable product pages.</p>
      </section>
    );
  }

  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <article className="stack">
      <h1>{product.name}</h1>
      <p className="price">{product.price_html ? "See product page pricing" : `$${product.price}`}</p>
      <HtmlContent html={product.description || product.short_description || ""} />
    </article>
  );
}
