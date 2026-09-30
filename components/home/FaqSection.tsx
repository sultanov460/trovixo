import { Accordion } from "@/components/ui/Accordion";
import { MotionReveal } from "@/components/ui/motion/MotionReveal";

export function FaqSection({ items, title = "Frequently asked questions" }: { items: { question: string; answer: string }[]; title?: string }) {
  return (
    <section className="container-page py-16">
      <MotionReveal>
        <h2 className="mb-8 text-2xl">{title}</h2>
        <Accordion items={items} />
      </MotionReveal>
    </section>
  );
}
