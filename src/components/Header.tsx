"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/documentacion", label: "Documentacion" },
  { href: "/blog", label: "Blog" },
  { href: "/shop", label: "Shop" }
];

function isLinkActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="siteHeader siteHeaderCyber">
      <div className="siteHeaderGlow" aria-hidden="true" />
      <div className="container siteHeaderInner">
        <Link href="/" className="siteBrand">
          <span className="siteBrandMark" aria-hidden="true">
            NW
          </span>
          <span>next-wp-woo</span>
        </Link>

        <button
          type="button"
          className={`siteMenuToggle ${isOpen ? "isOpen" : ""}`}
          aria-expanded={isOpen}
          aria-controls="primary-nav"
          aria-label="Abrir menu"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="primary-nav" className={`siteNav ${isOpen ? "isOpen" : ""}`} aria-label="Navegacion principal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`siteNavLink ${isLinkActive(pathname, link.href) ? "isActive" : ""}`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/AndrewUru/wordpress-template"
            target="_blank"
            rel="noreferrer"
            className="button headerCloneButton siteCloneCta"
          >
            Clonar repo
          </a>
        </nav>
      </div>
    </header>
  );
}

