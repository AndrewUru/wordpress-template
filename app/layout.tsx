import type { Metadata } from "next";
import "../src/styles/globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "Next.js WordPress Headless Starter | WooCommerce Ready",
    template: "%s | Next.js WordPress Starter"
  },
  description:
    "Production-ready Next.js App Router starter for WordPress Headless (REST API) with optional WooCommerce, ISR revalidation and TypeScript.",
  keywords: [
    "nextjs wordpress starter",
    "wordpress headless",
    "woocommerce headless",
    "next.js app router",
    "wordpress rest api",
    "vercel wordpress",
    "headless ecommerce"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Next WP Woo Headless Starter",
    title: "Next.js WordPress Headless Starter | WooCommerce Ready",
    description:
      "Starter template for Next.js + WordPress Headless via REST API + optional WooCommerce integration."
  },
  twitter: {
    card: "summary",
    title: "Next.js WordPress Headless Starter",
    description:
      "Build a fast WordPress Headless frontend with Next.js App Router and optional WooCommerce."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body id="top">
        <Header />
        <main className="container">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
