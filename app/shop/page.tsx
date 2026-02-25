import { ProductCard } from "@/components/ProductCard";
import { getProducts, isWooEnabled } from "@/lib/woo";

export const metadata = {
  title: "Shop"
};

export default async function ShopPage() {
  if (!isWooEnabled()) {
    return (
      <section className="stack">
        <h1>Shop</h1>
        <p>WooCommerce is not enabled.</p>
        <p>
          Add <code>WC_CONSUMER_KEY</code> and <code>WC_CONSUMER_SECRET</code> in <code>.env.local</code>. See the README setup notes.
        </p>
      </section>
    );
  }

  const products = await getProducts({ perPage: 20 });

  return (
    <section className="stack">
      <h1>Shop</h1>
      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
