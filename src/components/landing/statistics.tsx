import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

export function Statistics() {
  const [stats, setStats] = useState([
    { label: "Resources",  value: "—",   suffix: ""  },
    { label: "Creators",   value: "—",   suffix: ""  },
    { label: "Searches",   value: "2M",  suffix: "+" },
    { label: "Categories", value: "11",  suffix: ""  },
  ]);

  useEffect(() => {
    const fetch = async () => {
      const [r, p] = await Promise.all([
        supabase.from("resources").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*",  { count: "exact", head: true }),
      ]);
      setStats((prev) => [
        { ...prev[0]!, value: r.count ? (r.count >= 1000 ? `${(r.count / 1000).toFixed(1)}k` : String(r.count)) : "0" },
        { ...prev[1]!, value: p.count ? (p.count >= 1000 ? `${(p.count / 1000).toFixed(1)}k` : String(p.count)) : "0" },
        ...prev.slice(2),
      ]);
    };
    fetch();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white border-b border-black/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/[0.05] rounded-2xl overflow-hidden border border-black/[0.05]">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="bg-white text-center py-10 md:py-14 px-4 hover:bg-black/[0.015] transition-colors"
            >
              <div className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-black tabular-nums">
                {s.value}<span className="text-black/30">{s.suffix}</span>
              </div>
              <div className="mt-2 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] text-black/35">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}