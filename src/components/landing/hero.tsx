import { useEffect, useRef, useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "@tanstack/react-router";
import logoAsset from "@/assets/promptly-icon.png.asset.json";

// ─── Morphing Dust Canvas ────────────────────────────────────────────────────

function DustCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COUNT = 3500;
    const mouse = { x: -9999, y: -9999 };
    let raf: number;

    // ── Resize ──────────────────────────────────────────────────────────────
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Cursor ──────────────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    // ── Shape helpers ────────────────────────────────────────────────────────
    const cx = () => canvas.width  / 2;
    const cy = () => canvas.height * 0.62;
    const SZ = () => Math.min(canvas.width, canvas.height) * 0.55;

    type Pt = [number, number];

    const fill = (pts: Pt[], n: number): Pt[] => {
      if (!pts.length) return Array.from({ length: n }, () => [cx(), cy()] as Pt);
      while (pts.length < n) pts.push(pts[Math.floor(Math.random() * pts.length)]!);
      return pts.slice(0, n);
    };

    // Circle ring
    const ring = (x: number, y: number, r: number, n: number, noise = 3): Pt[] =>
      Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        const rr = r + (Math.random() - 0.5) * noise;
        return [x + Math.cos(a) * rr, y + Math.sin(a) * rr];
      });

    // Ellipse
    const ellipse = (x: number, y: number, rx: number, ry: number, n: number, noise = 2): Pt[] =>
      Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        return [x + Math.cos(a) * rx + (Math.random() - 0.5) * noise, y + Math.sin(a) * ry + (Math.random() - 0.5) * noise];
      });

    // ── Shape generators ─────────────────────────────────────────────────────

    const shapeScatter = (): Pt[] =>
      fill(Array.from({ length: COUNT }, () => [Math.random() * canvas.width, Math.random() * canvas.height] as Pt), COUNT);

    const shapeGlobe = (): Pt[] => {
      const s = SZ(), x = cx(), y = cy(), R = s * 0.44;
      const pts: Pt[] = [];
      pts.push(...ring(x, y, R, Math.floor(COUNT * 0.26), 5));              // outer
      // latitude rings
      [-0.60, -0.28, 0, 0.28, 0.60].forEach((yf) => {
        const yOff = R * yf;
        const lR   = Math.sqrt(Math.max(0, R * R - yOff * yOff));
        pts.push(...ellipse(x, y + yOff, lR, lR * 0.13, Math.floor(COUNT * 0.08), 2));
      });
      // longitude ellipses
      [0, Math.PI / 3, -Math.PI / 3].forEach((a) => {
        pts.push(...ellipse(x, y, R * Math.abs(Math.cos(a)) + 1, R, Math.floor(COUNT * 0.1), 3));
      });
      return fill(pts, COUNT);
    };

    // ── Sequence ─────────────────────────────────────────────────────────────
    type ShapeName = "scatter" | "globe";
    const SEQUENCE: ShapeName[] = ["scatter", "globe"];
    const HOLD: Record<ShapeName, number> = {
      scatter: 3200,
      globe:   4200,
    };

    let seqIdx  = 0;
    let current: ShapeName = "scatter";
    let targets: Pt[] = shapeScatter();

    const applyTargets = (s: ShapeName) => {
      current = s;
      if (s === "scatter") targets = shapeScatter();
      else                 targets = shapeGlobe();
      
      particles.forEach((p, i) => {
        p.tx = targets[i]?.[0] ?? p.x;
        p.ty = targets[i]?.[1] ?? p.y;
      });
    };

    // ── Particles ────────────────────────────────────────────────────────────
    type P = {
      x: number; y: number;
      vx: number; vy: number;
      tx: number; ty: number;
      r: number;
      alpha: number; aDir: number;
      dvx: number; dvy: number; // drift
    };

    const particles: P[] = Array.from({ length: COUNT }, (_, i) => ({
      x:   Math.random() * canvas.width,
      y:   Math.random() * canvas.height,
      vx:  (Math.random() - 0.5) * 0.4,
      vy:  (Math.random() - 0.5) * 0.4,
      tx:  targets[i]?.[0] ?? 0,
      ty:  targets[i]?.[1] ?? 0,
      r:   Math.random() * 1.0 + 0.3,
      alpha: Math.random() * 0.7 + 0.1,
      aDir: Math.random() > 0.5 ? 1 : -1,
      dvx:  (Math.random() - 0.5) * 0.25,
      dvy:  (Math.random() - 0.5) * 0.25,
    }));

    let lastChange = performance.now();

    // ── Animation loop ───────────────────────────────────────────────────────
    const tick = (now: number) => {
      const W = canvas.width, H = canvas.height;

      // Advance sequence
      if (now - lastChange > HOLD[current]) {
        seqIdx = (seqIdx + 1) % SEQUENCE.length;
        applyTargets(SEQUENCE[seqIdx]!);
        lastChange = now;
      }

      // How far into the hold period (0→1)
      const progress = Math.min(1, (now - lastChange) / 1200);
      const isScatter = current === "scatter";
      const springK   = isScatter ? 0.006 : 0.04 * progress + 0.004;

      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        // Spring to target
        p.vx += (p.tx - p.x) * springK;
        p.vy += (p.ty - p.y) * springK;

        // Ambient drift when scattered
        if (isScatter) {
          p.vx += p.dvx * 0.04;
          p.vy += p.dvy * 0.04;
        }

        // Cursor repulsion
        const dx   = p.x - mouse.x;
        const dy   = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 110 && dist > 0) {
          const f = ((110 - dist) / 110) * 0.55;
          p.vx += (dx / dist) * f;
          p.vy += (dy / dist) * f;
        }

        // Cap speed
        const spd = Math.hypot(p.vx, p.vy);
        const cap = isScatter ? 2.2 : 5.5;
        if (spd > cap) { p.vx = p.vx / spd * cap; p.vy = p.vy / spd * cap; }

        // Damping
        p.vx *= 0.88; p.vy *= 0.88;

        p.x += p.vx; p.y += p.vy;

        // Wrap only when scattered
        if (isScatter) {
          if (p.x < -6) p.x = W + 6;
          if (p.x > W + 6) p.x = -6;
          if (p.y < -6) p.y = H + 6;
          if (p.y > H + 6) p.y = -6;
        }

        // Alpha pulse
        p.alpha += p.aDir * 0.004;
        if (p.alpha >= 0.85) { p.alpha = 0.85; p.aDir = -1; }
        if (p.alpha <= 0.06) { p.alpha = 0.06; p.aDir = +1; }

        const drawR = isScatter ? p.r : p.r * 0.65;
        ctx.beginPath();
        ctx.arc(p.x, p.y, drawR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,0,0,${(p.alpha * 1.0).toFixed(3)})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
      style={{ pointerEvents: "auto" }}
    />
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

export function Hero() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const handleSearchAction = () => {
    if (user) {
      navigate({ to: "/explore", search: { query: searchValue || undefined, category: undefined, type: undefined } });
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const placeholders = [
    "Search 'React Dashboard'",
    "Search 'AI Agent'",
    "Search 'Flutter Login'",
    "Search 'Prompt Engineering'",
    "Search 'Python Automation'"
  ];
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setIsReady(true), 1000);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady || isTyping) return;

    let charIdx = 0;
    let isDeleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const type = () => {
      const fullText = placeholders[placeholderIdx];
      if (!fullText) return;

      if (isDeleting) {
        setSearchValue(fullText.substring(0, charIdx - 1));
        charIdx--;
      } else {
        setSearchValue(fullText.substring(0, charIdx + 1));
        charIdx++;
      }

      let speed = isDeleting ? 40 : 80;
      if (!isDeleting && charIdx === fullText.length) {
        isDeleting = true;
        speed = 2500;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        setPlaceholderIdx(prev => (prev + 1) % placeholders.length);
        speed = 400;
      }

      timeout = setTimeout(type, speed);
    };

    type();
    return () => clearTimeout(timeout);
  }, [placeholderIdx, isReady]);

  return (
    <div ref={heroRef} className="relative w-full h-screen bg-white overflow-hidden selection:bg-black selection:text-white">

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-[100] bg-white flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 mb-6">
                <img src={logoAsset.url} alt="Promptly" className="w-full h-full object-contain" />
              </div>
              <span className="font-sora text-[11px] font-bold uppercase tracking-[0.5em] text-black">Promptly</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dust Particle Canvas */}
      <DustCanvas />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none px-4 md:px-6">
        <div className="max-w-4xl w-full text-center space-y-8 md:space-y-12">
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={isReady ? { opacity: 1 } : {}}
              className="font-sora text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-black leading-tight md:leading-none flex flex-wrap justify-center gap-x-[0.2em]"
            >
              {["Promptly", "Engine"].map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
                  animate={isReady ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                  transition={{
                    duration: 1.2,
                    delay: 0.5 + i * 0.15,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isReady ? { opacity: 0.4, y: 0 } : {}}
              transition={{ duration: 1, delay: 1.2 }}
              className="text-[11px] font-bold uppercase tracking-[0.5em] text-black"
            >
              Curating the future of code &amp; content
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={isReady ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl mx-auto pointer-events-auto"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-black/[0.03] rounded-xl md:rounded-2xl blur-lg transition duration-1000 group-hover:bg-black/[0.07]" />
              <div className="relative w-full h-14 md:h-20 bg-white border border-black/5 rounded-xl md:rounded-2xl flex items-center px-4 md:px-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-700 group-hover:shadow-[0_60px_120px_-20px_rgba(0,0,0,0.12)] group-hover:-translate-y-1">
                <Search className="w-5 h-5 md:w-6 md:h-6 text-black/20 mr-3 md:mr-4 group-hover:text-black/40 transition-colors" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setIsTyping(true);
                  }}
                  onFocus={() => setIsTyping(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchAction();
                  }}
                  className="w-full bg-transparent border-none outline-none text-black font-sora text-lg md:text-2xl font-light tracking-tight placeholder:text-black/20"
                  placeholder={!isTyping ? "Search 'Prompt Engineering'..." : ""}
                />
                <div className="ml-auto flex items-center gap-4">
                  <button
                    onClick={handleSearchAction}
                    className="px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-black/90 transition-colors"
                  >
                    Search
                  </button>
                  <div className="hidden sm:flex gap-1.5 opacity-20 group-hover:opacity-40 transition-opacity">
                    <kbd className="px-1.5 md:px-2 py-1 rounded bg-black/5 text-[9px] md:text-[10px] font-bold text-black border border-black/5">⌘</kbd>
                    <kbd className="px-1.5 md:px-2 py-1 rounded bg-black/5 text-[9px] md:text-[10px] font-bold text-black border border-black/5">K</kbd>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isReady ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 2.2 }}
            className="flex items-center justify-center gap-4 md:gap-6 pointer-events-auto"
          >
            <button
              className="group relative px-6 sm:px-10 py-4 sm:py-5 bg-black text-white rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10"
              onClick={() => {
                if (user) {
                  navigate({ to: "/explore", search: { query: undefined, category: undefined, type: undefined } });
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
            >
              <span className="relative z-10 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] flex items-center">
                Explore Universe
                <ChevronRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <motion.div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isReady ? { opacity: 0.4 } : {}}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 md:gap-4 pointer-events-none z-10"
      >
        <div className="w-[1px] h-8 md:h-12 bg-gradient-to-b from-black/0 via-black to-black/0" />
        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] text-black" style={{ writingMode: "vertical-rl" }}>Scroll</span>
      </motion.div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}