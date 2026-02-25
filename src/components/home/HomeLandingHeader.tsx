import Link from "next/link";

export function HomeLandingHeader() {
  return (
    <section className="card homeTopHeader">
      <div className="homeTopHeaderLeft">
        <p>Template listo para WordPress Headless + WooCommerce</p>
      </div>
      <div className="homeTopHeaderActions">
        <a
          href="https://github.com/AndrewUru/wordpress-template"
          target="_blank"
          rel="noreferrer"
          className="button homeTopHeaderButton"
        >
          Clonar repo
        </a>
        <Link href="/blog" className="homeTopHeaderLink">
          Blog
        </Link>
        <Link href="/shop" className="homeTopHeaderLink">
          Shop
        </Link>
      </div>
    </section>
  );
}
