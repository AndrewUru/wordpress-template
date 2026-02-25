import Link from "next/link";
import type { WCProduct, WPPage, WPPost } from "@/lib/types";

type Props = {
  posts: WPPost[];
  pages: WPPage[];
  products: WCProduct[];
  hasLivePreview: boolean;
};

function stripHtml(value: string | undefined) {
  return (value || "").replace(/<[^>]+>/g, "").trim();
}

function getPostImage(post: WPPost) {
  const embedded = (post as WPPost & { _embedded?: { "wp:featuredmedia"?: Array<{ source_url?: string }> } })._embedded;
  return embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";
}

export function HomeLivePreview({ posts, pages, products, hasLivePreview }: Props) {
  return (
    <section className="card homeLivePreview">
      <div className="homePreviewHeader">
        <h2>Vista previa en vivo</h2>
        <p>
          {hasLivePreview
            ? "Datos leidos directamente desde tu WordPress y WooCommerce."
            : "Completa variables en .env.local para ver contenido real aqui."}
        </p>
      </div>

      {hasLivePreview ? (
        <div className="homePreviewGrid">
          <article className="homePreviewColumn">
            <h3>Ultimos posts</h3>
            {posts.length ? (
              posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="homePreviewItem">
                  {getPostImage(post) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={getPostImage(post)} alt={post.title.rendered} className="homePreviewImage" />
                  ) : (
                    <div className="homePreviewNoImage">Sin imagen</div>
                  )}
                  <div>
                    <strong>{post.title.rendered}</strong>
                    <p>{stripHtml(post.excerpt?.rendered).slice(0, 110) || "Sin extracto."}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="homeMuted">No hay posts publicados o la API no responde.</p>
            )}
          </article>

          <article className="homePreviewColumn">
            <h3>Paginas detectadas</h3>
            {pages.length ? (
              <ul className="homePageList">
                {pages.map((page) => (
                  <li key={page.id}>
                    <Link href={`/page/${page.slug}`}>{page.title.rendered}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="homeMuted">No se pudieron leer paginas.</p>
            )}
          </article>

          <article className="homePreviewColumn">
            <h3>Productos Woo</h3>
            {products.length ? (
              <div className="homeProductPreviewGrid">
                {products.map((product) => (
                  <Link key={product.id} href={`/product/${product.slug}`} className="homeProductPreviewCard">
                    {product.images?.[0]?.src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0].src} alt={product.name} className="homeProductPreviewImage" />
                    ) : (
                      <div className="homePreviewNoImage">Sin imagen</div>
                    )}
                    <strong>{product.name}</strong>
                    <p>{product.price ? `$${product.price}` : "Sin precio"}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="homeMuted">WooCommerce sin productos o keys no configuradas.</p>
            )}
          </article>
        </div>
      ) : (
        <div className="homeEmptyState">
          <p>Completa setup y reinicia el dev server para cargar contenido real.</p>
          <code>npm run setup</code>
        </div>
      )}
    </section>
  );
}
