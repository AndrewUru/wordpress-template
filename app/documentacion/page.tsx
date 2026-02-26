import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentacion",
  description: "Guia de configuracion y uso del starter Next.js + WordPress + WooCommerce."
};

export default function DocumentacionPage() {
  return (
    <section className="docCyberPage" aria-label="Documentacion cyber">
      <div className="docScanlines" />
      <div className="docVignette" />
      <div className="docNoise" />

      <div className="docHud" aria-hidden="true">
        <div className="docHudRow">
          <span>
            mode: <strong>online</strong>
          </span>
          <span className="docHudLine" />
          <span>wordpress-headless</span>
        </div>
        <div className="docHudRow">
          <span>doc://core-setup</span>
          <span className="docHudLine" />
          <span>
            status: <strong>stable</strong>
          </span>
        </div>
      </div>

      <div className="docViewport">
        <div className="docBigText">docs</div>
        <div className="docWorld">
          <article className="docCard docCardOne">
            <header className="docCardHeader">
              <span className="docCardId">NODE-REQ</span>
              <span>01</span>
            </header>
            <h2>Requisitos</h2>
            <ul>
              <li>Node.js 18 o superior.</li>
              <li>WordPress con REST API.</li>
              <li>WooCommerce opcional.</li>
            </ul>
            <footer className="docCardFooter">
              <span>ready-check</span>
              <span>ok</span>
            </footer>
          </article>

          <article className="docCard docCardTwo">
            <header className="docCardHeader">
              <span className="docCardId">BOOT-SEQ</span>
              <span>02</span>
            </header>
            <h2>Setup</h2>
            <pre>
              <code>{`cp .env.example .env.local
npm run setup`}</code>
            </pre>
            <p>Completa variables y valida conexion con tu WordPress.</p>
            <footer className="docCardFooter">
              <span>first run</span>
              <span>required</span>
            </footer>
          </article>

          <article className="docCard docCardThree">
            <header className="docCardHeader">
              <span className="docCardId">OPS-CMD</span>
              <span>03</span>
            </header>
            <h2>Comandos</h2>
            <pre>
              <code>{`npm run dev
npm run build
npm run start
npm run lint
npm run typecheck`}</code>
            </pre>
            <footer className="docCardFooter">
              <span>pipeline</span>
              <span>active</span>
            </footer>
          </article>
        </div>
      </div>
    </section>
  );
}
