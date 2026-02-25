import Link from "next/link";
import type { WCProduct } from "@/lib/types";

export function ProductCard({ product }: { product: WCProduct }) {
  const image = product.images?.[0];

  return (
    <article className="card">
      {image?.src ? (
        <Link href={`/product/${product.slug}`} className="productImageLink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt || product.name}
            className="productImage"
            loading="lazy"
          />
        </Link>
      ) : null}
      <h3>
        <Link href={`/product/${product.slug}`}>{product.name}</Link>
      </h3>
      <p>{product.short_description?.replace(/<[^>]+>/g, "").slice(0, 140)}</p>
      <p className="price">{product.price_html ? "See product" : `$${product.price}`}</p>
    </article>
  );
}
