"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Brand } from "@/components/Brand";
import { siteConfig } from "@/content/site-config";
import { isCurrentNavLink } from "@/lib/utils/navigation";

// Root cause of the previous bug: the header has `backdrop-blur`
// (backdrop-filter), and per the CSS spec any ancestor with a
// `filter`/`backdrop-filter` becomes the containing block for its
// `position: fixed` descendants — exactly like `transform` does. So the
// old "fixed" backdrop/drawer were actually positioned relative to the
// ~64px-tall header, not the viewport, which is why the menu only ever
// covered the header strip. Rendering the drawer through a portal
// straight onto <body> sidesteps that entirely: it is no longer a
// descendant of the header, so nothing the header does to its own
// stacking context can affect it.
export function MobileMenu({
  open,
  onClose,
  triggerRef,
  pathname,
  hash,
}: {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  pathname: string;
  hash: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // The server can never render a portal (there's no `document.body` to
  // portal into), so the server output for this component is always
  // "nothing". The bug this fixes: checking `typeof document ===
  // "undefined"` directly in the render body is NOT equivalent to that —
  // on the client's very first render (the one React hydrates against),
  // `document` already exists, so that check would immediately take the
  // portal branch and insert DOM nodes the server never produced. Using
  // `mounted` state instead guarantees the first client render matches
  // the server exactly (both render nothing); the portal only mounts
  // afterward, inside an effect, which is not part of hydration at all.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll, move focus into the panel, trap Tab inside it
  // while open, and restore focus to the trigger button on close.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function getFocusable(): HTMLElement[] {
      if (!panelRef.current) return [];
      return Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus();
    };
  }, [open, onClose, triggerRef]);

  if (!mounted) return null;

  const secondaryLinks = siteConfig.footerGroups
    .flatMap((group) => group.links)
    .filter((link) => !siteConfig.nav.some((navItem) => navItem.href === link.href));

  return createPortal(
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-[100] bg-ink/40 transition-opacity duration-300 ease-out motion-reduce:transition-none md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-y-0 right-0 z-[110] flex w-[92vw] max-w-[380px] flex-col border-l border-line bg-paper shadow-[-16px_0_36px_-20px_rgba(42,37,33,0.35)] transition-transform duration-300 ease-out motion-reduce:transition-none md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
          <span className="font-display text-xl font-semibold tracking-tight text-ink"><Brand footer /></span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center text-ink-soft transition-colors hover:text-ink"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto px-5 py-6">
          <ul className="flex flex-col gap-1">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={isCurrentNavLink(item.href, pathname, hash) ? "page" : undefined}
                  className="mobile-nav-link block rounded-[10px] px-2 py-2.5 font-display text-[27px] leading-tight text-ink transition-colors hover:text-forest"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {secondaryLinks.length > 0 && (
            <>
              <div className="my-6 border-t border-line" aria-hidden="true" />
              <ul className="flex flex-col gap-1">
                {secondaryLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      aria-current={isCurrentNavLink(link.href, pathname, hash) ? "page" : undefined}
                      className="mobile-nav-link block rounded-[10px] px-2 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </nav>

        <div className="shrink-0 border-t border-line px-5 py-4">
          <p className="text-xs leading-5 text-ink-soft">{siteConfig.announcement}</p>
        </div>
      </div>
    </>,
    document.body
  );
}
