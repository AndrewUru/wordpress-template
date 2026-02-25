export function HomeLandingFooter() {
  return (
    <section className="card homeLandingFooter">
      <div>
        <p className="homeLandingFooterTitle">Siguiente paso recomendado</p>
        <p className="homeLandingFooterText">
          Conecta webhook de WordPress a <code>/api/revalidate</code> para invalidar cache al publicar contenido.
        </p>
      </div>
      <a
        href="https://github.com/AndrewUru/wordpress-template/blob/main/examples/webhook-revalidate-example.md"
        target="_blank"
        rel="noreferrer"
        className="homeGhostButton"
      >
        Ver ejemplo webhook
      </a>
    </section>
  );
}
