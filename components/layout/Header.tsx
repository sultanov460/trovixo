"use client";

import Link from "next/link";
import { Brand } from "@/components/Brand";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/content/site-config";
import { CartIcon } from "@/components/ui/CartIcon";
import { useCart } from "@/components/cart/CartProvider";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { isCurrentNavLink } from "@/lib/utils/navigation";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setOpen(false), []);
  const { cart } = useCart();
  const itemCount = cart?.lines.reduce((sum, line) => sum + line.quantity, 0) ?? 0;

  // A route change (e.g. tapping a nav link) should never leave the
  // drawer open on the destination page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="container-page storefront-nav flex h-20 items-center justify-between">
        <Link href="/" aria-current={isCurrentNavLink("/", pathname, hash) ? "page" : undefined} className="font-display text-xl font-semibold tracking-tight text-ink">
          <Brand />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isCurrentNavLink(item.href, pathname, hash) ? "page" : undefined} className="nav-link text-sm font-medium text-ink-soft transition-colors hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/cart"
            aria-current={isCurrentNavLink("/cart", pathname, hash) ? "page" : undefined}
            aria-label={itemCount > 0 ? `Shopping cart, ${itemCount} item${itemCount === 1 ? "" : "s"}` : "Shopping cart"}
            className="cart-nav-link relative flex items-center p-2 text-ink hover:text-forest"
          >
            <CartIcon size={22} />
            {itemCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-pill bg-forest px-1 text-[10px] font-semibold text-paper"
              >
                {itemCount}
              </span>
            )}
          </Link>

          <button
            ref={triggerRef}
            type="button"
            className="flex h-10 w-10 items-center justify-center text-ink md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-4 w-5">
              <span
                aria-hidden="true"
                className={`absolute left-0 top-0 block h-0.5 w-5 rounded-full bg-ink transition-transform duration-[240ms] ease-out motion-reduce:transition-none ${
                  open ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                aria-hidden="true"
                className={`absolute bottom-0 left-0 block h-0.5 w-5 rounded-full bg-ink transition-transform duration-[240ms] ease-out motion-reduce:transition-none ${
                  open ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <MobileMenu open={open} onClose={closeMenu} triggerRef={triggerRef} pathname={pathname} hash={hash} />
    </header>
  );
}
