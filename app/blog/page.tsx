import { PostCard } from "@/components/PostCard";
import { flags } from "@/lib/env";
import { getPosts } from "@/lib/wp";

export const metadata = {
  title: "Blog"
};

export default async function BlogPage() {
  const posts = await getPosts({ perPage: 20 });

  return (
    <section className="stack contentPage">
      <header className="contentHero">
        <p className="contentEyebrow">WordPress Stream</p>
        <h1>Blog</h1>
        <p>Ultimos contenidos sincronizados desde WordPress Headless.</p>
      </header>
      {!flags.hasWpUrl ? (
        <p className="contentNotice">
          Configure <code>WP_URL</code> in <code>.env.local</code> to load blog posts.
        </p>
      ) : null}
      <div className="grid">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {posts.length === 0 ? (
        <section className="card contentNotice">
          <p>No hay publicaciones disponibles en este momento.</p>
        </section>
      ) : null}
    </section>
  );
}
