import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="siteFooter">
      <div className="siteFooterGlow" aria-hidden="true" />
      <div className="container siteFooterInner">
        <div className="siteFooterBrand">
          <p className="siteFooterTitle">Next WP Woo Headless Starter</p>
          <p className="siteFooterMeta">Frontend Next.js + WordPress + WooCommerce</p>
        </div>

        <nav className="siteFooterNav" aria-label="Footer links">
          <Link href="/documentacion">Documentacion</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/shop">Shop</Link>
        </nav>

        <div className="siteFooterActions">
          <a
            href="https://github.com/AndrewUru/wordpress-template"
            target="_blank"
            rel="noreferrer"
            className="siteFooterGhost"
          >
            GitHub
          </a>
          <a href="#top" className="siteFooterGhost">
            Volver arriba
          </a>
        </div>
      </div>
      <div className="container siteFooterBottom">
        <p>{year} next-wp-woo.</p>
      </div>
    </footer>
  );
}
