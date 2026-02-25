export function HtmlContent({ html }: { html: string }) {
  // Security note: render trusted HTML only (WordPress/WooCommerce content you control).
  return <div className="htmlContent" dangerouslySetInnerHTML={{ __html: html }} />;
}
