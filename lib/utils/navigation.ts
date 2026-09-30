export function isCurrentNavLink(href: string, pathname: string, hash = "") {
  if (href === "/#faq") return pathname === "/" && hash === "#faq";

  const target = href.replace(/\/$/, "") || "/";
  if (target === "/collections/all") {
    return pathname === "/collections/all" || pathname.startsWith("/collections/") || pathname.startsWith("/products/");
  }
  if (target === "/") return pathname === "/" && hash !== "#faq";
  return pathname === target || pathname.startsWith(`${target}/`);
}
