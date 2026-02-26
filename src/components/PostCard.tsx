import Link from "next/link";
import type { WPPost } from "@/lib/types";

export function PostCard({ post }: { post: WPPost }) {
  const excerpt = post.excerpt?.rendered?.replace(/<[^>]+>/g, "").trim() || "Sin resumen disponible.";

  return (
    <article className="card postCard">
      <h3 className="postCardTitle">
        <Link href={`/blog/${post.slug}`}>{post.title.rendered}</Link>
      </h3>
      <p className="postCardExcerpt">{excerpt.slice(0, 160)}</p>
    </article>
  );
}
