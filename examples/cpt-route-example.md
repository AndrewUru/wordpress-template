# CPT route example

This starter auto-detects CPTs from `GET /wp-json/wp/v2/types` and exposes helper methods:

- `getEntries(typeSlug)`
- `getEntryBySlug(typeSlug, slug)`

It does **not** auto-generate routes for all CPTs by default.

Example route for a `project` CPT:

```tsx
// app/project/[slug]/page.tsx
import { notFound } from "next/navigation";
import { HtmlContent } from "@/components/HtmlContent";
import { getEntryBySlug } from "@/lib/wp";

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const entry = await getEntryBySlug("project", params.slug);
  if (!entry) notFound();

  return (
    <article>
      <h1>{entry.title.rendered}</h1>
      <HtmlContent html={entry.content.rendered} />
    </article>
  );
}
```

Use tag `wp:cpt:project` in revalidation payloads for this type.
