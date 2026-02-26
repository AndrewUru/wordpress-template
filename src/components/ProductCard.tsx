import Link from "next/link";
import type { WCProduct } from "@/lib/types";

export function ProductCard({ product }: { product: WCProduct }) {
  const image = product.images?.[0];
  const description = product.short_description?.replace(/<[^>]+>/g, "").trim() || "Producto sin descripcion breve.";

  return (
    <article className="card productCard">
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
      <h3 className="productCardTitle">
        <Link href={`/product/${product.slug}`}>{product.name}</Link>
      </h3>
      <p className="productCardExcerpt">{description.slice(0, 160)}</p>
      <p className="price">{product.price_html ? "See product" : `$${product.price}`}</p>
    </article>
  );
}
