import Link from "next/link";
export function CareLinks({compact=false}:{compact?:boolean}) {return <div className={compact ? "care-links compact" : "care-links container-page"}>
 <Link href="/shipping"><span aria-hidden="true">↗</span><div><strong>Delivery, explained</strong><small>Read shipping information</small></div></Link>
 <Link href="/returns"><span aria-hidden="true">↶</span><div><strong>Know your options</strong><small>View returns & refunds</small></div></Link>
 <Link href="/contact"><span aria-hidden="true">♡</span><div><strong>A little help</strong><small>Visit customer care</small></div></Link>
 </div>;}
