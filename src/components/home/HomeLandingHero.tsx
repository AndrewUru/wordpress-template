import Link from "next/link";

type Props = {
  hasWpUrl: boolean;
  hasWoo: boolean;
  hasRevalidateSecret: boolean;
};

export function HomeLandingHero({ hasWpUrl, hasWoo, hasRevalidateSecret }: Props) {
  return (
    <header className="homeHeroPro">
      <p className="homeTag">Headless WordPress Starter</p>
      <h1>Lanza tu front en Next.js con datos reales desde WordPress</h1>
      <p>
        Configura variables una sola vez y valida en segundos si tu contenido, imagenes y catalogo WooCommerce ya
        estan conectados.
      </p>
      <div className="homeHeroActions">
        <a
          href="https://github.com/AndrewUru/wordpress-template"
          target="_blank"
          rel="noreferrer"
          className="button"
        >
          Clonar repo
        </a>
        <Link href="/shop" className="homeGhostButton">
          Ver shop
        </Link>
      </div>
      <div className="homeStatusGrid">
        <article className="card">
          <p>WP_URL</p>
          <strong>{hasWpUrl ? "Conectado" : "Pendiente"}</strong>
        </article>
        <article className="card">
          <p>WooCommerce keys</p>
          <strong>{hasWoo ? "Activas" : "Pendiente"}</strong>
        </article>
        <article className="card">
          <p>Revalidate secret</p>
          <strong>{hasRevalidateSecret ? "Activo" : "Pendiente"}</strong>
        </article>
      </div>
    </header>
  );
}
