import Link from "next/link";
import { Brand } from "@/components/Brand";
import { storeSettings } from "@/content/store-settings";
import { siteConfig } from "@/content/site-config";
import { MotionReveal } from "@/components/ui/motion/MotionReveal";

export function Footer() {
  return (
    <footer className="holiday-footer border-t border-line">
      <MotionReveal className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5" y={12}>
        <div className="sm:col-span-2">
          <Link href="/" aria-label="Trovixo home"><Brand footer /></Link>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">{siteConfig.tagline}</p>
          <div className="mt-5">
            {siteConfig.supportEmail ? (
              <a href={`mailto:${siteConfig.supportEmail}`} className="text-sm text-ink-soft hover:text-ink">
                {siteConfig.supportEmail}
              </a>
            ) : (
              <Link href="/contact" className="text-sm text-ink-soft hover:text-ink">
                Contact customer support
              </Link>
            )}
          </div>
        </div>

        {siteConfig.footerGroups.map((group) => (
          <div key={group.title}>
            <p className="eyebrow mb-3">{group.title}</p>
            <ul className="space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-soft transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </MotionReveal>

      <div className="border-t border-line py-6">
        <p className="container-page text-xs text-ink-soft">
          © {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.
          {storeSettings.businessName && <span className="block mt-2">Operated by {storeSettings.businessName} · {storeSettings.businessCountry}</span>}
        </p>
      </div>
    </footer>
  );
}
