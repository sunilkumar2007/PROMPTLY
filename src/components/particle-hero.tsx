import { useEffect, useRef, useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Point = { x: number; y: number };

export function ParticleHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentShape, setCurrentShape] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = [];
    const particleCount = 2000;
    const mouse = { x: -1000, y: -1000, radius: 140 };

    class Particle {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      vx: number;
      vy: number;
      size: number;
      friction: number;
      ease: number;

      constructor(x: number, y: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.targetX = x;
        this.targetY = y;
        this.vx = 0;
        this.vy = 0;
        this.size = Math.random() * 1.4 + 0.4;
        this.friction = 0.94;
        this.ease = 0.08;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      update() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        this.vx += dx * this.ease;
        this.vy += dy * this.ease;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;

        const mdx = mouse.x - this.x;
        const mdy = mouse.y - this.y;
        const dist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(mdy, mdx);
          this.x -= Math.cos(angle) * force * 20;
          this.y -= Math.sin(angle) * force * 20;
        }
      }
    }

    const shapes: Point[][] = [];

    function generateShapes() {
      // 1. Grid
      const grid: Point[] = [];
      const cols = 50;
      const rows = 40;
      const spacing = 14;
      const startX = (width - cols * spacing) / 2;
      const startY = (height - rows * spacing) / 2;
      for (let i = 0; i < particleCount; i++) {
        grid.push({
          x: startX + (i % cols) * spacing,
          y: startY + Math.floor(i / cols) * spacing,
        });
      }
      shapes.push(grid);

      // 2. Chat Bubble
      const bubble: Point[] = [];
      const centerX = width / 2;
      const centerY = height / 2;
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const r = 240 + Math.sin(angle * 4) * 15;
        bubble.push({
          x: centerX + Math.cos(angle) * r,
          y: centerY + Math.sin(angle) * r * 0.8,
        });
      }
      shapes.push(bubble);

      // 3. Knowledge Graph Nodes
      const graph: Point[] = [];
      const nodes = 8;
      const particlesPerNode = Math.floor(particleCount / nodes);
      for (let n = 0; n < nodes; n++) {
        const nodeX = width * 0.2 + Math.random() * width * 0.6;
        const nodeY = height * 0.2 + Math.random() * height * 0.6;
        for (let i = 0; i < particlesPerNode; i++) {
          const angle = Math.random() * Math.PI * 2;
          const r = Math.random() * 60;
          graph.push({
            x: nodeX + Math.cos(angle) * r,
            y: nodeY + Math.sin(angle) * r,
          });
        }
      }
      // Fill remaining if any
      while(graph.length < particleCount) {
        graph.push({ x: Math.random() * width, y: Math.random() * height });
      }
      shapes.push(graph);
    }

    function init() {
      generateShapes();
      const initial = shapes[0] || [];
      for (let i = 0; i < particleCount; i++) {
        const pt = initial[i] || { x: width / 2, y: height / 2 };
        particles.push(new Particle(pt.x, pt.y));
      }
    }

    function animate() {
      if (!ctx) return;
      ctx.fillStyle = "#fafafa";
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }

    function transition(shapeIndex: number) {
      const idx = shapeIndex % shapes.length;
      const targetShape = shapes[idx] || [];
      particles.forEach((p, i) => {
        const pt = targetShape[i];
        if (pt) {
          p.targetX = pt.x;
          p.targetY = pt.y;
        }
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      shapes.length = 0;
      generateShapes();
      transition(currentShape);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    init();
    animate();

    const interval = setInterval(() => {
      setCurrentShape((prev) => {
        const next = prev + 1;
        transition(next);
        return next;
      });
    }, 6000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 bg-[#fafafa] overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full pointer-events-none" />
      
      {/* Centered Typography & Search Overlays */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none z-10">
        <div className="max-w-4xl w-full space-y-12 mb-16">
          <div className="space-y-6">
            <h1 className="font-sora text-6xl md:text-8xl font-bold tracking-tighter text-black animate-in fade-in slide-in-from-bottom-8 duration-1000">
              Promptly.
            </h1>
            <p className="text-xl md:text-2xl text-black/50 font-medium tracking-tight max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100">
              The premium intelligence layer for designers, builders, and AI engineers.
            </p>
          </div>

          <div className="flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            {/* High-end non-functional search bar */}
            <div className="relative w-full max-w-xl h-16 bg-white border border-black/5 rounded-2xl flex items-center px-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] pointer-events-auto cursor-text group transition-all hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] hover:-translate-y-0.5">
              <Search className="w-5 h-5 text-black/20 mr-4 group-hover:text-black/40 transition-colors" />
              <div className="text-black/30 font-medium text-lg tracking-tight">Search intelligence, code, prompts...</div>
              <div className="ml-auto flex gap-1.5 opacity-40 group-hover:opacity-60 transition-opacity">
                <div className="px-2 py-1 rounded-md bg-black/5 text-[10px] font-bold text-black uppercase tracking-tighter">CMD</div>
                <div className="px-2 py-1 rounded-md bg-black/5 text-[10px] font-bold text-black uppercase tracking-tighter">K</div>
              </div>
            </div>

            <div className="flex gap-4 pointer-events-auto">
              <Button size="lg" className="rounded-full bg-black text-white hover:bg-black/90 px-8 h-12 text-sm font-semibold uppercase tracking-[0.15em] transition-all hover:scale-105 active:scale-95">
                Start Discovery
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="ghost" className="rounded-full px-8 h-12 text-sm font-semibold uppercase tracking-[0.15em] text-black/40 hover:text-black hover:bg-transparent">
                Join our world
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Parallax blur overlays */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#fafafa] to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#fafafa] to-transparent z-20 pointer-events-none" />
    </div>
  );
}
