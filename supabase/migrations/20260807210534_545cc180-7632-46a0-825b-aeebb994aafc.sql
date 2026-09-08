TRUNCATE public.resources CASCADE;

INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES 
('Minimal Responsive Navbar', 'UI/UX', 'UI/UX', '# Minimal Responsive Navbar

A production-ready responsive navigation bar built with semantic HTML, modern CSS, and vanilla JavaScript. Features smooth transitions, mobile-first design, and accessibility best-practices.

## Features
- Desktop Mega-menu support
- Mobile Hamburger Drawer with smooth animation
- Sticky Header with Glassmorphism (backdrop-filter)
- Active Link detection using Intersection Observer
- Keyboard Accessibility (Tab-friendly navigation)
- SVG icon integration

## Installation
1. Copy the `index.html` structure.
2. Add the `style.css` to your global styles.
3. Include `script.js` before the closing `</body>` tag.

## Usage
Simply update the `.nav-links` list with your own menu items. The mobile drawer is triggered by the `.mobile-toggle` button.

## License
MIT', '<!-- index.html -->
<nav class="navbar" aria-label="Main Navigation">
  <div class="navbar-container">
    <div class="logo">
      <a href="/">
        <svg width="32" height="32" viewBox="0 0 32 32">
          <rect width="32" height="32" rx="8" fill="black"/>
          <path d="M10 10L22 22M22 10L10 22" stroke="white" stroke-width="3"/>
        </svg>
        <span>Promptly</span>
      </a>
    </div>
    
    <div class="nav-links-desktop">
      <a href="/explore" class="nav-link active">Explore</a>
      <a href="/resources" class="nav-link">Resources</a>
      <a href="/categories" class="nav-link">Categories</a>
    </div>

    <div class="auth-buttons">
      <button class="btn-ghost">Log In</button>
      <button class="btn-primary">Sign Up</button>
    </div>
  </div>
</nav>', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800', '{"navbar","responsive","ui-ux"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1245, 567),

('Modern SaaS Dashboard Sidebar', 'Component', 'UI/UX', '# Modern SaaS Dashboard Sidebar
Sleek, collapsible sidebar for React dashboards.', 'import React, { useState } from ''react'';
import { LayoutDashboard, Users, BarChart3, Settings, LogOut, ChevronLeft } from ''lucide-react'';

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <aside className={`flex flex-col h-screen bg-white border-r border-black/5 transition-all duration-500 ${isCollapsed ? ''w-24'' : ''w-72''}`}>
      <div className=''p-8 flex items-center justify-between''>
        {!isCollapsed && <span className=''font-black text-2xl tracking-tighter''>PROMPTLY.</span>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className=''p-3 hover:bg-black/5 rounded-2xl''>
          <ChevronLeft className={`w-5 h-5 ${isCollapsed ? ''rotate-180'' : ''''}`} />
        </button>
      </div>
    </aside>
  );
};', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', '{"dashboard","sidebar","react"}', '03dbcee7-522c-4865-8119-d59eef27319d', 890, 340),

('Modern Authentication UI', 'Project', 'Website Development', '# Modern Authentication UI
Complete Login/Signup flows.', 'import React from ''react'';
import { motion } from ''framer-motion'';

export const LoginForm = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className=''max-w-md w-full p-12 bg-white border border-black/5 rounded-[40px] shadow-2xl''
    >
      <h2 className=''text-4xl font-black tracking-tighter mb-4''>Welcome back.</h2>
    </motion.div>
  );
};', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800', '{"auth","login","react"}', '03dbcee7-522c-4865-8119-d59eef27319d', 2100, 845),

('Minimal AI Chat Interface', 'Component', 'AI/ML', '# Minimal AI Chat Interface
Minimalist chat UI with markdown support.', 'console.log(''AI Chat Interface'');', 'https://images.unsplash.com/photo-1676299081847-c0326a0333d5?auto=format&fit=crop&q=80&w=800', '{"chat","ai","ui"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1560, 720),

('AI Prompt Enhancer', 'Function', 'AI/ML', '# AI Prompt Enhancer
Turn vague prompts into professional instructions.', 'def enhance_prompt(p): return f"Professional: {p}"', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800', '{"prompt","ai","python"}', '03dbcee7-522c-4865-8119-d59eef27319d', 430, 180),

('Premium SaaS Landing Page', 'Project', 'Website Development', '# Premium SaaS Landing Page
Next.js starter with hero, features, and pricing.', 'export default function Page() { return <h1>SaaS</h1>; }', 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&q=80&w=800', '{"saas","landing","nextjs"}', '03dbcee7-522c-4865-8119-d59eef27319d', 3200, 1200);