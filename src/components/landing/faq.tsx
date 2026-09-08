import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    { q: "What is Promptly?", a: "Promptly is a premium discovery platform for AI prompts, code snippets, and UI components." },
    { q: "Is it free to use?", a: "We offer a comprehensive free tier for individual creators, with premium plans for teams." },
    { q: "How can I contribute?", a: "Anyone can become a creator and share their high-quality resources with the community." },
    { q: "Do you offer API access?", a: "Yes, our enterprise plan includes full API access to our resource library." },
  ];

  return (
    <section className="py-20 md:py-32 bg-[#fafafa]">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-black mb-12 md:mb-16 text-center">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-black/5">
              <AccordionTrigger className="text-[10px] md:text-sm font-bold uppercase tracking-widest hover:no-underline py-5 md:py-6 text-left min-h-[48px]">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-xs md:text-sm text-black/50 leading-relaxed pb-6">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}