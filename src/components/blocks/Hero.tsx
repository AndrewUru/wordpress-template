export type HeroProps = {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

export function Hero({ title, subtitle, ctaLabel, ctaUrl }: HeroProps) {
  return (
    <section className="hero">
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
      {ctaLabel && ctaUrl ? (
        <a className="button" href={ctaUrl}>
          {ctaLabel}
        </a>
      ) : null}
    </section>
  );
}
