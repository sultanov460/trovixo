import type { Product } from "@/lib/types/product";
export const mockProducts: Product[] = [{
 id: "preview-holiday-lights", handle: "multicolor-car-lights", title: "Multicolor Car Lights",
 tagline: "A festive glow for your holiday moments.",
 description: "A little color, a little sparkle, a whole lot of holiday spirit. Explore our Christmas car-light concept, made for moments worth remembering. The final product specifications and kit contents will be confirmed before orders open. Lifestyle imagery is illustrative; coverage and appearance depend on the final kit and installation.",
 benefits: ["A colorful holiday look", "A memorable seasonal display", "Inspiration for festive photos"],
 images: ["/holiday/car-front.jpg", "/holiday/car-evening.jpg"],
 price: { amount: 0, currencyCode: "USD" }, options: [], variants: [], specs: [], isMock: true,
}];
export async function getAllProducts(first = mockProducts.length): Promise<Product[]> { return mockProducts.slice(0, Math.max(0,first)); }
export async function getProductByHandle(handle: string): Promise<Product | undefined> { return mockProducts.find(p => p.handle === handle); }
