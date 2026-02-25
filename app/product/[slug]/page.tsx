import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HtmlContent } from "@/components/HtmlContent";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { env } from "@/lib/env";
import { HttpError } from "@/lib/http";
import { getProductBySlug, getProductVariations, isWooEnabled } from "@/lib/woo";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isWooEnabled()) {
    return { title: "WooCommerce not configured" };
  }

  try {
    const product = await getProductBySlug(params.slug);
    if (!product) {
      return { title: "Product not found" };
    }

    return {
      title: product.name,
      description: product.short_description?.replace(/<[^>]+>/g, "").slice(0, 160)
    };
  } catch (error) {
    if (error instanceof HttpError && error.status === 401) {
      return { title: "WooCommerce auth error" };
    }

    throw error;
  }
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

  try {
    const product = await getProductBySlug(params.slug);
    if (!product) notFound();
    const variations = product.type === "variable" ? await getProductVariations(product.id) : [];

    return (
      <article className="stack">
        <ProductDetailClient product={product} variations={variations} wpBaseUrl={env.wpUrl} />
        <section className="card">
          <h2>Descripción</h2>
          <HtmlContent html={product.description || product.short_description || ""} />
        </section>
      </article>
    );
  } catch (error) {
    if (error instanceof HttpError && error.status === 401) {
      return (
        <section className="stack">
          <h1>WooCommerce auth error</h1>
          <p>No se pudo autenticar contra WooCommerce REST API (HTTP 401).</p>
          <p>Revisa credenciales y permisos de tus API keys.</p>
        </section>
      );
    }

    throw error;
  }
}
