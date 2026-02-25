import Link from "next/link";

export function Header() {
  return (
    <header className="siteHeader">
      <div className="container row">
        <Link href="/" className="brand">
          next-wp-woo
        </Link>
        <nav className="row nav">
          <Link href="/blog">Blog</Link>
          <Link href="/shop">Shop</Link>
        </nav>
      </div>
    </header>
  );
}
