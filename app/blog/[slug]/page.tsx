import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HtmlContent } from "@/components/HtmlContent";
import { getPostBySlug } from "@/lib/wp";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: post.title.rendered,
    description: post.excerpt?.rendered?.replace(/<[^>]+>/g, "").slice(0, 160)
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article className="stack">
      <h1>{post.title.rendered}</h1>
      <HtmlContent html={post.content.rendered} />
    </article>
  );
}
