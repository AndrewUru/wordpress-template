import { PostCard } from "@/components/PostCard";
import { flags } from "@/lib/env";
import { getPosts } from "@/lib/wp";

export const metadata = {
  title: "Blog"
};

export default async function BlogPage() {
  const posts = await getPosts({ perPage: 20 });

  return (
    <section className="stack">
      <h1>Blog</h1>
      {!flags.hasWpUrl ? (
        <p>
          Configure <code>WP_URL</code> in <code>.env.local</code> to load blog posts.
        </p>
      ) : null}
      <div className="grid">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
