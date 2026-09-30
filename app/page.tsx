import Link from "next/link";
import Image from "next/image";
import { getHeroProduct } from "@/lib/data";
import { FaqSection } from "@/components/home/FaqSection";
import { generalFaq } from "@/content/faq";
import { commerceEnabled } from "@/lib/launch";
import { CareLinks } from "@/components/CareLinks";
import { ProductPrice } from "@/components/ui/ProductPrice";
export default async function HomePage() {
 const product = await getHeroProduct();
 const href = product ? `/products/${product.handle}` : "/collections/all";
 const live = Boolean(product && !product.isMock && product.variants.some(v=>v.available && v.price.amount > 0));
 const ordering = commerceEnabled() && live;
 return <>
  <div className="hero-surround"><section className="holiday-hero">
   <div className="container-page hero-grid">
    <div className="hero-copy"><span className="holiday-kicker">CHRISTMAS, THE TROVIXO WAY <span aria-hidden="true">✧</span></span>
     <h1>Wrap the season<br/>in <em>a little magic.</em></h1>
     <p>Bring the glow beyond the Christmas tree.<br/>A festive little detail for moments that stay with you.</p>
     <Link className="holiday-button cream" href={href}>{ordering ? "Shop the holiday lights" : "Explore the holiday lights"} <span aria-hidden="true">↗</span></Link>
    </div>
    <div className="hero-image-wrap"><Image src="/holiday/car-front.jpg" alt="White car decorated with multicolor Christmas lights outside a warmly lit home" fill priority sizes="(max-width: 800px) 100vw, 55vw" className="hero-photo"/></div>
   </div>
  </section></div>
  <CareLinks />
  <div className="holiday-ribbon" aria-hidden="true"><span>A SEASON TO SHINE</span><b>✧</b><span>LITTLE LIGHTS, BIG FEELINGS</span><b>✧</b><span>MAKE IT MEMORABLE</span></div>
  <section className="container-page holiday-feature">
   <div className="feature-photo"><Image src="/holiday/car-evening.jpg" alt="Festive car light styling inspiration" fill sizes="(max-width: 800px) 100vw, 50vw" className="object-cover"/><span className="photo-label">The holiday highlight</span></div>
   <div className="feature-copy"><p className="eyebrow">A BRIGHTER KIND OF TRADITION</p><h2>Ordinary evening.<br/><em>Extraordinary glow.</em></h2><p>The house has its twinkle. The tree has its moment. Now give your holiday photos a little something unexpected.</p><div className="feature-rule"/><h3>{product?.title || "Multicolor Car Lights"}</h3><p>{product?.tagline || "A festive glow for your holiday moments."}</p>{live && product && <ProductPrice price={product.price} compareAtPrice={product.compareAtPrice} size="detail" className="mt-4"/>}<Link href={href} className="holiday-button">Discover the details <span aria-hidden="true">↗</span></Link><small>Lifestyle imagery for inspiration. {live ? "Check the product listing for kit contents and specifications." : "Final kit details will be listed before launch."}</small></div>
  </section>
  <section className="holiday-story"><div className="container-page"><p className="holiday-kicker">MORE THAN A DECORATION</p><h2>That “look at those lights” feeling.</h2><p>A splash of color. A reason to pause. A little reminder that the best part of the season is sharing it.</p><div className="story-grid">{[["01", "Make it festive", "Bring the holiday mood into your seasonal display."],["02", "Make it yours", "Find inspiration for your own Christmas moment."],["03", "Make a memory", "Capture the glow, and share the season."]].map(([n,t,d])=><div key={n}><span>{n} /</span><h3>{t}</h3><p>{d}</p></div>)}</div></div></section>
  <section className="container-page holiday-film"><div><p className="eyebrow">THE LIGHTS, IN MOTION</p><h2>A little holiday<br/><em>inspiration.</em></h2><p>Take a closer look at the seasonal mood.</p><small>Illustrative lifestyle video. Confirm the final product’s instructions and approved uses before installation.</small></div><video controls playsInline preload="none" poster="/holiday/car-front.jpg" aria-label="Trovixo holiday lighting inspiration video"><source src="/holiday/holiday-film.mp4" type="video/mp4"/>Your browser does not support video.</video></section>
  <div id="faq" className="holiday-faq"><FaqSection items={live ? generalFaq.filter(x=>!x.question.includes("When can") && !x.question.includes("box")) : generalFaq} title="A few things you might be wondering."/></div>
  <section className="holiday-final"><p className="holiday-kicker">HERE’S TO BRIGHTER MOMENTS</p><h2>Make this season <em>glow.</em></h2><Link href={href} className="holiday-button cream">Meet the holiday edit <span aria-hidden="true">↗</span></Link></section>
 </>;
}
