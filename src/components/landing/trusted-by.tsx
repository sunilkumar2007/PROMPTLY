import { motion } from "framer-motion";

export function TrustedBy() {
  const logos = [
    { name: "GitHub",  url: "/logos/github.svg"  },
    { name: "OpenAI", url: "/logos/openai.svg"   },
    { name: "Vercel",  url: "/logos/vercel.svg"  },
    { name: "Figma",   url: "/logos/figma.svg"   },
    { name: "Notion",  url: "/logos/notion.svg"  },
    { name: "Stripe",  url: "/logos/stripe.svg"  },
  ];

  return (
    <section className="py-12 md:py-20 bg-white border-b border-black/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="text-center text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-black/25 mb-8 md:mb-10">
          Trusted by high-performance teams
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 md:gap-14">
          {logos.map((logo, i) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex items-center gap-2 text-black/40 hover:text-black transition-colors group"
            >
              <img
                src={logo.url}
                alt={logo.name}
                className="w-4 h-4 md:w-5 md:h-5 object-contain opacity-40 group-hover:opacity-100 transition-opacity"
              />
              <span className="text-xs md:text-sm font-bold tracking-tight">{logo.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}