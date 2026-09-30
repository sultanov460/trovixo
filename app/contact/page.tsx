import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/content/site-config";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="container-page grid max-w-4xl gap-10 py-16 md:grid-cols-2">
      <div>
        <h1 className="text-3xl">Get in touch</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          Questions about an order, a product, or anything else — we&apos;re happy to help.
        </p>
        <div className="mt-6 space-y-2 text-sm">
          {siteConfig.supportEmail && (
            <p>
              Email:{" "}
              <a href={`mailto:${siteConfig.supportEmail}`} className="font-medium text-forest underline">
                {siteConfig.supportEmail}
              </a>
            </p>
          )}
          <p>
            Have a quick question?{" "}
            <Link href="/#faq" className="font-medium text-forest underline">
              Check our FAQ
            </Link>
          </p>
          {process.env.CONTACT_FORM_ENDPOINT && <p className="text-ink-soft">Use the form to send us your question.</p>}
        </div>
      </div>

      {process.env.CONTACT_FORM_ENDPOINT ? <ContactForm /> : <div className="card p-8"><h2 className="text-2xl">A little hello</h2><p className="mt-4 text-sm">{siteConfig.supportEmail ? "Email our team using the address on this page." : "Our support details will be available when the store opens. We are not accepting orders yet."}</p></div>}
    </div>
  );
}
