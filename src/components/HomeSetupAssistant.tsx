"use client";

import { useEffect, useMemo, useState } from "react";

type PackageManager = "npm" | "pnpm" | "yarn";
type ValidationStatus = "idle" | "loading" | "success" | "error";

type Step = {
  title: string;
  detail: string;
  command?: string;
  commandByPm?: Record<PackageManager, string>;
};

const CHECKLIST_STORAGE_KEY = "home_setup_checklist_v2";

const steps: Step[] = [
  {
    title: "Instala dependencias",
    detail: "Instala Next.js, TypeScript y ESLint del starter.",
    commandByPm: {
      npm: "npm install",
      pnpm: "pnpm install",
      yarn: "yarn"
    }
  },
  {
    title: "Corre setup wizard",
    detail: "Configura WP_URL, Woo opcional y secret de revalidate.",
    commandByPm: {
      npm: "npm run setup",
      pnpm: "pnpm setup",
      yarn: "yarn setup"
    }
  },
  {
    title: "Levanta en local",
    detail: "Abre el proyecto en http://localhost:3000.",
    commandByPm: {
      npm: "npm run dev",
      pnpm: "pnpm dev",
      yarn: "yarn dev"
    }
  },
  {
    title: "Valida rutas",
    detail: "Revisa /blog, /page/[slug], /shop y /product/[slug].",
    command: "/blog /page/[slug] /shop /product/[slug]"
  }
];

function normalizeWpBaseUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function resolveStepCommand(step: Step, packageManager: PackageManager): string {
  if (step.commandByPm) return step.commandByPm[packageManager];
  return step.command || "";
}

export function HomeSetupAssistant({ defaultWpUrl = "" }: { defaultWpUrl?: string }) {
  const [packageManager, setPackageManager] = useState<PackageManager>("npm");
  const [selectedStep, setSelectedStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(() => steps.map(() => false));
  const [copied, setCopied] = useState("");
  const [wpUrl, setWpUrl] = useState(defaultWpUrl);
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>("idle");
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length === steps.length) {
        setCompletedSteps(parsed.map((value) => Boolean(value)));
      }
    } catch {
      // Ignore local data errors.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(completedSteps));
  }, [completedSteps]);

  const completedCount = useMemo(() => completedSteps.filter(Boolean).length, [completedSteps]);
  const progress = useMemo(() => Math.round((completedCount / steps.length) * 100), [completedCount]);
  const activeStep = steps[selectedStep];
  const activeCommand = resolveStepCommand(activeStep, packageManager);
  const setupSnippet = useMemo(
    () => steps.slice(0, 3).map((step) => resolveStepCommand(step, packageManager)).join("\n"),
    [packageManager]
  );

  async function copyText(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(""), 1200);
    } catch {
      setCopied("");
    }
  }

  async function validateWpUrl() {
    const normalizedBase = normalizeWpBaseUrl(wpUrl);
    if (!normalizedBase) {
      setValidationStatus("error");
      setValidationMessage("Ingresa una URL valida.");
      return;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(normalizedBase);
    } catch {
      setValidationStatus("error");
      setValidationMessage("Formato de URL invalido.");
      return;
    }

    const endpoint = `${parsedUrl.toString().replace(/\/+$/, "")}/wp-json/wp/v2/posts?per_page=1`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      setValidationStatus("loading");
      setValidationMessage("Probando conexion REST...");
      const response = await fetch(endpoint, {
        method: "GET",
        signal: controller.signal,
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        setValidationStatus("error");
        setValidationMessage(`REST respondio ${response.status}. Revisa permisos o URL.`);
        return;
      }

      const payload = await response.json();
      if (!Array.isArray(payload)) {
        setValidationStatus("error");
        setValidationMessage("La respuesta no coincide con /wp/v2/posts.");
        return;
      }

      setValidationStatus("success");
      setValidationMessage("Conexion correcta.");
    } catch {
      setValidationStatus("error");
      setValidationMessage("No se pudo conectar. Revisa SSL, CORS o disponibilidad.");
    } finally {
      clearTimeout(timeout);
    }
  }

  return (
    <section className="card homeSetupAssistant">
      <div className="homeSetupHeader">
        <h2>Setup interactivo</h2>
        <p>
          Progreso {completedCount}/{steps.length} ({progress}%)
        </p>
      </div>

      <div className="homePmRow">
        <label htmlFor="pm">Package manager</label>
        <select
          id="pm"
          value={packageManager}
          onChange={(event) => setPackageManager(event.target.value as PackageManager)}
        >
          <option value="npm">npm</option>
          <option value="pnpm">pnpm</option>
          <option value="yarn">yarn</option>
        </select>
      </div>

      <div className="homeStepTabs">
        {steps.map((step, index) => (
          <button
            key={step.title}
            type="button"
            className={`homeStepTab ${index === selectedStep ? "homeStepTabActive" : ""}`}
            onClick={() => setSelectedStep(index)}
          >
            {completedSteps[index] ? "OK " : ""}Paso {index + 1}
          </button>
        ))}
      </div>

      <div className="homeStepDetail">
        <h3>{activeStep.title}</h3>
        <p>{activeStep.detail}</p>
        <div className="homeCommandBox">
          <code>{activeCommand}</code>
          <div className="homeCommandActions">
            <button type="button" onClick={() => copyText(activeCommand)}>
              {copied === activeCommand ? "Copiado" : "Copiar"}
            </button>
            <button
              type="button"
              onClick={() =>
                setCompletedSteps((prev) => prev.map((value, idx) => (idx === selectedStep ? !value : value)))
              }
            >
              {completedSteps[selectedStep] ? "Marcar pendiente" : "Marcar hecho"}
            </button>
          </div>
        </div>
      </div>

      <div className="homeBulkCopy">
        <p>Snippet completo</p>
        <pre>{setupSnippet}</pre>
        <button type="button" onClick={() => copyText(setupSnippet)}>
          {copied === setupSnippet ? "Copiado" : "Copiar todo"}
        </button>
      </div>

      <div className="homeValidator">
        <h3>Validador WP_URL</h3>
        <div className="homeValidatorRow">
          <input
            type="text"
            value={wpUrl}
            onChange={(event) => setWpUrl(event.target.value)}
            placeholder="https://tu-wordpress.com"
          />
          <button type="button" className="button" onClick={validateWpUrl} disabled={validationStatus === "loading"}>
            {validationStatus === "loading" ? "Validando..." : "Validar"}
          </button>
        </div>
        {validationStatus !== "idle" ? (
          <p className={`homeValidationMsg homeValidationMsg${validationStatus}`}>{validationMessage}</p>
        ) : null}
      </div>
    </section>
  );
}
