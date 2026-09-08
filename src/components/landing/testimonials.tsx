export function Testimonials() {
  const testimonials = [
    { 
      text: "Promptly has completely changed how our team prototypes. We find what we need in seconds.", 
      author: "Lead Developer, Vercel",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80"
    },
    { 
      text: "The quality of resources here is unmatched. It's the first place I look for design inspiration.", 
      author: "Product Designer, Linear",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80"
    },
    { 
      text: "A must-have tool for any serious AI engineer. The knowledge graphs are incredible.", 
      author: "AI Architect, OpenAI",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80"
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          {testimonials.map((t, i) => (
            <div key={i} className="space-y-6 md:space-y-8">
              <div className="text-4xl md:text-6xl font-serif text-black/5 leading-[0]">"</div>
              <p className="text-lg md:text-xl font-medium tracking-tight text-black leading-relaxed">{t.text}</p>
              <div className="flex items-center gap-4 pt-2 md:pt-4">
                <img src={t.image} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
                <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">{t.author}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}