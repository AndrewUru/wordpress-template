"use client";

import { useMemo, useState } from "react";

const steps = [
  {
    title: "1) Instala dependencias",
    command: "npm install",
    detail: "Instala Next.js, TypeScript y ESLint del template."
  },
  {
    title: "2) Ejecuta setup wizard",
    command: "npm run setup",
    detail:
      "El wizard pregunta WP_URL, WooCommerce opcional y revalidación, luego genera .env.local."
  },
  {
    title: "3) Levanta desarrollo",
    command: "npm run dev",
    detail: "Arranca en http://localhost:3000 con App Router."
  },
  {
    title: "4) Prueba rutas",
    command: "/blog, /page/[slug], /shop, /product/[slug]",
    detail: "Blog/Pages funcionan con WP_URL. Shop/Product requieren keys Woo."
  }
];

const faqs = [
  {
    q: "¿Qué necesito mínimo para que funcione?",
    a: "Solo WP_URL válido y REST API accesible en tu WordPress."
  },
  {
    q: "¿WooCommerce es obligatorio?",
    a: "No. Es opcional. Si no configuras keys, /shop muestra guía de configuración."
  },
  {
    q: "¿Cómo se actualiza caché?",
    a: "Usa POST /api/revalidate con header x-revalidate-secret o ?secret=."
  },
  {
    q: "¿Soporta ACF?",
    a: "Sí, si el endpoint trae acf, el template lo conserva y trae mapper Hero de ejemplo."
  }
];

export default function HomePage() {
  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const active = useMemo(() => steps[activeStep], [activeStep]);

  async function copyText(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(""), 1200);
    } catch {
      setCopied("");
    }
  }

  return (
    <section className="stack">
      <h1>next-wp-woo-headless-starter</h1>
      <p>
        Plantilla para Next.js + WordPress Headless (REST) + WooCommerce opcional.
      </p>

      <article className="card">
        <h2>Quickstart interactivo</h2>
        <div className="row" style={{ flexWrap: "wrap" }}>
          {steps.map((step, index) => (
            <button
              key={step.title}
              type="button"
              className="button"
              style={{
                background: index === activeStep ? "var(--accent)" : "#0f172a",
                border: 0,
                cursor: "pointer"
              }}
              onClick={() => setActiveStep(index)}
            >
              Paso {index + 1}
            </button>
          ))}
        </div>

        <h3>{active.title}</h3>
        <p>{active.detail}</p>
        <div className="card" style={{ marginTop: "0.5rem" }}>
          <code>{active.command}</code>
          <button
            type="button"
            style={{ marginLeft: "0.75rem", cursor: "pointer" }}
            onClick={() => copyText(active.command)}
          >
            {copied === active.command ? "Copiado" : "Copiar"}
          </button>
        </div>
      </article>

      <article className="card">
        <h2>Checklist de configuración</h2>
        <ul>
          <li>WP_URL en .env.local</li>
          <li>Permalinks en WordPress: Post name</li>
          <li>REST accesible: /wp-json/wp/v2/posts</li>
          <li>Woo opcional: WC_CONSUMER_KEY + WC_CONSUMER_SECRET</li>
          <li>WP_REVALIDATE_SECRET para webhook de invalidación</li>
        </ul>
      </article>

      <article className="card">
        <h2>FAQ rápida</h2>
        {faqs.map((item, index) => (
          <div key={item.q} style={{ marginBottom: "0.75rem" }}>
            <button
              type="button"
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              style={{ cursor: "pointer", width: "100%", textAlign: "left" }}
            >
              {item.q}
            </button>
            {openFaq === index ? <p style={{ marginTop: "0.5rem" }}>{item.a}</p> : null}
          </div>
        ))}
      </article>
    </section>
  );
}
