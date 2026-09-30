import type { Metadata } from "next";
import { launchReady } from "@/lib/launch";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Providers } from "@/app/providers";
import { siteConfig } from "@/content/site-config";
import { getSiteUrl } from "@/lib/utils/site";
import { SiteMotion } from "@/components/ui/motion/SiteMotion";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: siteConfig.brandName, template: `%s | ${siteConfig.brandName}` },
  description: siteConfig.tagline,
  icons: { icon: "/icon.svg" },
  robots: launchReady() ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    title: siteConfig.brandName,
    description: siteConfig.tagline,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.brandName,
    description: siteConfig.tagline,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Providers>
          <AnnouncementBar />
          <Header />
          <SiteMotion />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
