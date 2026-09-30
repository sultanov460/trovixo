export const siteConfig = {
  brandName: "Trovixo",
  tagline: "A little glow. A lot of magic.",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || undefined,
  nav: [
    { label: "Shop", href: "/collections/all" },
    { label: "Our story", href: "/about" },
    { label: "FAQs", href: "/#faq" },
    { label: "Contact", href: "/contact" },
  ],
  footerGroups: [
    {
      title: "Shop",
      links: [
        { label: "All Products", href: "/collections/all" },
        { label: "About Trovixo", href: "/about" },
      ],
    },
    {
      title: "Customer Care",
      links: [
        { label: "Contact", href: "/contact" },
        { label: "Shipping & Delivery", href: "/shipping" },
        { label: "Returns & Refunds", href: "/returns" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Legal Notice", href: "/legal-notice" },
      ],
    },
  ],
  announcement: "A little more holiday magic · The Trovixo holiday edit",
};
