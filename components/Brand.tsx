import Image from "next/image";
export function Brand({footer = false}:{footer?:boolean}) {
 return <Image src="/trovixo-logo.png" width={2048} height={682} alt="Trovixo" priority={!footer} className={footer ? "brand-logo brand-footer" : "brand-logo"} sizes="200px"/>;
}
