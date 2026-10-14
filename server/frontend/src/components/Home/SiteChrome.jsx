import React, { useEffect, useRef, useState } from "react";
import { Button, Link, buttonVariants } from "@heroui/react";

// Shared nav and footer for the HeroUI pages (Home, About).

export const SOURCE_URL = "https://github.com/Felipeact/dealership-website";

// sessionStorage throws in some privacy modes; treat that as signed out.
export const readUsername = () => {
  try {
    return sessionStorage.getItem("username");
  } catch {
    return null;
  }
};

const NAV_LINKS = [
  { href: "/dealers", label: "Dealers" },
  { href: "/about", label: "About this project" },
];

export const SiteNav = ({ username, current }) => {
  const [logout, setLogout] = useState({ status: "idle" });
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);

  // Close the mobile menu on a tap anywhere outside the header.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const close = (e) => {
      if (!headerRef.current?.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [menuOpen]);

  const handleLogout = async () => {
    if (logout.status === "pending") return;
    setLogout({ status: "pending" });
    try {
      const res = await fetch("/djangoapp/logout", { method: "GET" });
      if (!res.ok) throw new Error(`Logout failed with ${res.status}`);
      try {
        sessionStorage.removeItem("username");
      } catch {
        // Nothing stored to clear.
      }
      window.location.href = window.location.origin;
    } catch {
      setLogout({ status: "error" });
    }
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-20 border-b border-separator bg-background/85 backdrop-blur"
      onKeyDown={(e) => e.key === "Escape" && setMenuOpen(false)}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <a href="/" className="text-lg font-semibold font-stretch-semi-expanded tracking-tight text-foreground">
          Dealerships
        </a>
        <div className="hidden items-center gap-5 text-sm sm:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} aria-current={current === link.href ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {username ? (
            <>
              {logout.status === "error" ? (
                <span role="alert" className="text-sm text-danger">
                  Couldn't log out. Try again.
                </span>
              ) : (
                <span className="hidden max-w-48 truncate text-sm text-muted sm:inline">Signed in as {username}</span>
              )}
              <Button
                size="sm"
                variant="tertiary"
                onPress={handleLogout}
                aria-disabled={logout.status === "pending"}
                className="pointer-coarse:h-11"
              >
                {logout.status === "pending" ? "Logging out…" : "Log out"}
              </Button>
            </>
          ) : (
            <>
              <a href="/login" className={`${buttonVariants({ size: "sm", variant: "ghost" })} pointer-coarse:h-11`}>
                Log in
              </a>
              <a href="/register" className={`${buttonVariants({ size: "sm" })} pointer-coarse:h-11`}>
                Register
              </a>
            </>
          )}
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="-mr-2 flex size-11 items-center justify-center rounded-full text-foreground hover:bg-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:hidden"
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              {menuOpen ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
            </svg>
          </button>
        </div>
      </nav>
      {menuOpen && (
        <ul id="site-menu" className="border-t border-separator px-4 py-2 sm:hidden">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={current === link.href ? "page" : undefined}
                className="flex min-h-11 items-center text-base font-medium text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
};

export const Footer = () => (
  <footer className="border-t border-separator">
    <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p>© {new Date().getFullYear()} Dealerships · a portfolio project with fictional data</p>
      <div className="flex gap-5">
        <Link href="/dealers">Dealers</Link>
        <Link href="/about">About this project</Link>
        <Link href={SOURCE_URL}>Source</Link>
      </div>
    </div>
  </footer>
);
