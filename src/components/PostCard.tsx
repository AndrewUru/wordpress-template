import Link from "next/link";
import type { WPPost } from "@/lib/types";

export function PostCard({ post }: { post: WPPost }) {
  return (
    <article className="card">
      <h3>
        <Link href={`/blog/${post.slug}`}>{post.title.rendered}</Link>
      </h3>
      <p>{post.excerpt?.rendered?.replace(/<[^>]+>/g, "").slice(0, 140)}</p>
    </article>
  );
}
