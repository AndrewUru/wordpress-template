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
          <a
            href="https://github.com/AndrewUru/wordpress-template"
            target="_blank"
            rel="noreferrer"
            className="button headerCloneButton"
          >
            Clonar repo
          </a>
        </nav>
      </div>
    </header>
  );
}
