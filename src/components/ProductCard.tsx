import Link from "next/link";
import type { WCProduct } from "@/lib/types";

export function ProductCard({ product }: { product: WCProduct }) {
  return (
    <article className="card">
      <h3>
        <Link href={`/product/${product.slug}`}>{product.name}</Link>
      </h3>
      <p>{product.short_description?.replace(/<[^>]+>/g, "").slice(0, 140)}</p>
      <p className="price">{product.price_html ? "See product" : `$${product.price}`}</p>
    </article>
  );
}
