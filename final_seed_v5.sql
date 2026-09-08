TRUNCATE public.resources CASCADE;
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Minimal Responsive Navbar', 'UI/UX', 'UI/UX', '# Minimal Responsive Navbar

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
      <div class="dropdown">
        <button class="dropdown-trigger">More</button>
        <div class="dropdown-content">
          <a href="/blog">Blog</a>
          <a href="/about">About</a>
        </div>
      </div>
    </div>

    <div class="auth-buttons">
      <button class="btn-ghost">Log In</button>
      <button class="btn-primary">Sign Up</button>
    </div>

    <button class="mobile-toggle" aria-expanded="false" aria-controls="mobile-menu">
      <span class="sr-only">Menu</span>
      <div class="hamburger"></div>
    </button>
  </div>
</nav>

<style>
/* style.css */
:root {
  --nav-height: 80px;
  --primary: #000;
  --secondary: #666;
  --bg: rgba(255, 255, 255, 0.8);
  --border: rgba(0, 0, 0, 0.05);
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--nav-height);
  background: var(--bg);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  z-index: 1000;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.logo a {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  font-weight: 800;
  color: var(--primary);
  font-size: 20px;
  letter-spacing: -0.02em;
}

.nav-links-desktop {
  display: flex;
  gap: 32px;
}

.nav-link {
  text-decoration: none;
  color: var(--secondary);
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover, .nav-link.active {
  color: var(--primary);
}
</style>', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800', '{"navbar","responsive","ui-ux"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1245, 567);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Modern SaaS Dashboard Sidebar', 'Component', 'UI/UX', '# Modern SaaS Dashboard Sidebar
Sleek, collapsible sidebar for React dashboards.', 'import React, { useState } from ''react'';
import { LayoutDashboard, Users, BarChart3, Settings, LogOut, ChevronLeft } from ''lucide-react'';

const SidebarItem = ({ icon: Icon, label, active, collapsed }) => (
  <div className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 group ${active ? ''bg-black text-white shadow-lg shadow-black/10'' : ''hover:bg-black/5 text-black/60 hover:text-black''}`}>
    <Icon className="w-5 h-5 flex-shrink-0" />
    {!collapsed && (
      <span className="ml-4 font-bold text-[13px] uppercase tracking-wider overflow-hidden whitespace-nowrap">
        {label}
      </span>
    )}
  </div>
);

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const navItems = [
    { icon: LayoutDashboard, label: ''Overview'' },
    { icon: Users, label: ''Customers'' },
    { icon: BarChart3, label: ''Analytics'' },
    { icon: Settings, label: ''Configuration'' },
  ];

  return (
    <aside className={`flex flex-col h-screen bg-white border-r border-black/5 transition-all duration-500 ease-[0.16, 1, 0.3, 1] ${isCollapsed ? ''w-24'' : ''w-72''}`}>
      <div className=''p-8 flex items-center justify-between mb-4''>
        {!isCollapsed && <span className=''font-black text-2xl tracking-tighter''>PROMPTLY.</span>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className=''p-3 hover:bg-black/5 rounded-2xl transition-colors''>
          <ChevronLeft className={`w-5 h-5 transition-transform duration-500 ${isCollapsed ? ''rotate-180'' : ''''}`} />
        </button>
      </div>
      <nav className=''flex-1 px-6 space-y-2''>
        {navItems.map((item, i) => (
          <SidebarItem key={i} {...item} active={i === activeIndex} collapsed={isCollapsed} onClick={() => setActiveIndex(i)} />
        ))}
      </nav>
      <div className="p-6 mt-auto border-t border-black/5">
        <SidebarItem icon={LogOut} label="Sign Out" collapsed={isCollapsed} />
      </div>
    </aside>
  );
};', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', '{"dashboard","sidebar","react"}', '03dbcee7-522c-4865-8119-d59eef27319d', 890, 340);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Modern Authentication UI', 'Project', 'Website Development', '# Modern Authentication UI
Complete Login/Signup flows.', 'import React from ''react'';
import { useForm } from ''react-hook-form'';
import { motion } from ''framer-motion'';

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data) => {
    console.log(''Authenticating...'', data);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className=''max-w-md w-full p-12 bg-white border border-black/5 rounded-[40px] shadow-2xl shadow-black/5''
    >
      <div className="mb-12">
        <h2 className=''text-4xl font-black tracking-tighter mb-4''>Welcome back.</h2>
        <p className=''text-black/40 font-medium''>Sign in to your discovery engine.</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className=''space-y-8''>
        <div className="space-y-3">
          <label className=''block text-[10px] font-black uppercase tracking-[0.2em] text-black/30''>Email Address</label>
          <input 
            {...register(''email'', { required: true })} 
            type=''email'' 
            className=''w-full px-6 py-4 bg-black/5 rounded-2xl border-none focus:ring-2 focus:ring-black/10 transition-all font-medium'' 
            placeholder=''name@company.com'' 
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className=''block text-[10px] font-black uppercase tracking-[0.2em] text-black/30''>Password</label>
            <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50 hover:text-black">Forgot?</a>
          </div>
          <input 
            {...register(''password'', { required: true })} 
            type=''password'' 
            className=''w-full px-6 py-4 bg-black/5 rounded-2xl border-none focus:ring-2 focus:ring-black/10 transition-all font-medium'' 
            placeholder=''••••••••'' 
          />
        </div>

        <button className=''w-full py-5 bg-black text-white rounded-[20px] font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10''>
          Continue
        </button>
      </form>
    </motion.div>
  );
};', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800', '{"auth","login","react"}', '03dbcee7-522c-4865-8119-d59eef27319d', 2100, 845);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Minimal AI Chat Interface', 'Component', 'AI/ML', '# Minimal AI Chat Interface

A professional component resource designed by Alex Chen for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for Minimal AI Chat Interface
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: Minimal AI Chat Interface'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1599812616151?auto=format&fit=crop&q=80&w=800', '{"minimal","ai/ml"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1308, 879);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('AI Prompt Enhancer', 'Function', 'AI/ML', '# AI Prompt Enhancer

A professional function resource designed by Maya Patel for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for AI Prompt Enhancer
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: AI Prompt Enhancer'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1588677229314?auto=format&fit=crop&q=80&w=800', '{"ai","ai/ml"}', '03dbcee7-522c-4865-8119-d59eef27319d', 403, 693);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Premium SaaS Landing Page', 'Project', 'Website Development', '# Premium SaaS Landing Page

A professional project resource designed by Arjun Dev for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for Premium SaaS Landing Page
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: Premium SaaS Landing Page'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1568129802339?auto=format&fit=crop&q=80&w=800', '{"premium","website-development"}', '03dbcee7-522c-4865-8119-d59eef27319d', 2209, 584);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Interactive E-commerce Product Card', 'Component', 'UI/UX', '# Interactive E-commerce Product Card

A professional component resource designed by Noah Williams for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for Interactive E-commerce Product Card
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: Interactive E-commerce Product Card'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1565009486995?auto=format&fit=crop&q=80&w=800', '{"interactive","ui/ux"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1946, 312);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Modern Mobile Bottom Navigation', 'Component', 'Mobile Applications', '# Modern Mobile Bottom Navigation

A professional component resource designed by Sarah Kim for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for Modern Mobile Bottom Navigation
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: Modern Mobile Bottom Navigation'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1508077922258?auto=format&fit=crop&q=80&w=800', '{"modern","mobile-applications"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1934, 371);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Premium Flutter Login Screen', 'Component', 'Mobile Applications', '# Premium Flutter Login Screen

A professional component resource designed by Daniel Thomas for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for Premium Flutter Login Screen
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: Premium Flutter Login Screen'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1581703753646?auto=format&fit=crop&q=80&w=800', '{"premium","mobile-applications"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1943, 650);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Python Data Analytics Dashboard', 'Project', 'Data Science', '# Python Data Analytics Dashboard

A professional project resource designed by Priya Nair for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for Python Data Analytics Dashboard
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: Python Data Analytics Dashboard'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1596854137741?auto=format&fit=crop&q=80&w=800', '{"python","data-science"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1881, 632);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('AI Image Generation Prompt Collection', 'Prompt', 'AI/ML', '# AI Image Generation Prompt Collection

A professional prompt resource designed by Ethan Cole for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for AI Image Generation Prompt Collection
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: AI Image Generation Prompt Collection'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1547541494275?auto=format&fit=crop&q=80&w=800', '{"ai","ai/ml"}', '03dbcee7-522c-4865-8119-d59eef27319d', 2479, 498);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Tailwind UI Component Collection', 'UI/UX', 'UI/UX', '# Tailwind UI Component Collection

A professional ui/ux resource designed by Olivia Martin for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for Tailwind UI Component Collection
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: Tailwind UI Component Collection'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1583234314990?auto=format&fit=crop&q=80&w=800', '{"tailwind","ui/ux"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1171, 472);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Production Ready REST API Starter', 'Project', 'Website Development', '# Production Ready REST API Starter

A professional project resource designed by Ryan Lee for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for Production Ready REST API Starter
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: Production Ready REST API Starter'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1521508459860?auto=format&fit=crop&q=80&w=800', '{"production","website-development"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1860, 337);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('JWT Authentication API', 'Module', 'Website Development', '# JWT Authentication API

A professional module resource designed by Alex Chen for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for JWT Authentication API
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: JWT Authentication API'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1594919103913?auto=format&fit=crop&q=80&w=800', '{"jwt","website-development"}', '03dbcee7-522c-4865-8119-d59eef27319d', 644, 685);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Modern Admin Dashboard', 'Project', 'Website Development', '# Modern Admin Dashboard

A professional project resource designed by Maya Patel for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for Modern Admin Dashboard
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: Modern Admin Dashboard'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1506911689027?auto=format&fit=crop&q=80&w=800', '{"modern","website-development"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1054, 869);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Cinematic Animated Hero Section', 'Component', 'UI/UX', '# Cinematic Animated Hero Section

A professional component resource designed by Arjun Dev for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for Cinematic Animated Hero Section
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: Cinematic Animated Hero Section'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1551460600959?auto=format&fit=crop&q=80&w=800', '{"cinematic","ui/ux"}', '03dbcee7-522c-4865-8119-d59eef27319d', 469, 843);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Advanced File Upload Interface', 'Component', 'Website Development', '# Advanced File Upload Interface

A professional component resource designed by Noah Williams for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for Advanced File Upload Interface
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: Advanced File Upload Interface'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1509915580416?auto=format&fit=crop&q=80&w=800', '{"advanced","website-development"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1609, 747);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Developer Markdown Editor', 'Component', 'Productivity', '# Developer Markdown Editor

A professional component resource designed by Sarah Kim for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for Developer Markdown Editor
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: Developer Markdown Editor'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1533620481371?auto=format&fit=crop&q=80&w=800', '{"developer","productivity"}', '03dbcee7-522c-4865-8119-d59eef27319d', 2368, 170);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Python File Organizer Automation', 'Function', 'Automation', '# Python File Organizer Automation

A professional function resource designed by Daniel Thomas for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for Python File Organizer Automation
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: Python File Organizer Automation'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1592400001328?auto=format&fit=crop&q=80&w=800', '{"python","automation"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1232, 462);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Python Web Data Collector', 'Project', 'Automation', '# Python Web Data Collector

A professional project resource designed by Priya Nair for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for Python Web Data Collector
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: Python Web Data Collector'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1582427077761?auto=format&fit=crop&q=80&w=800', '{"python","automation"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1854, 529);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Minimal Design System', 'UI/UX', 'UI/UX', '# Minimal Design System

A professional ui/ux resource designed by Ethan Cole for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for Minimal Design System
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: Minimal Design System'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1575540881372?auto=format&fit=crop&q=80&w=800', '{"minimal","ui/ux"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1017, 863);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('SaaS PostgreSQL Database Schema', 'Module', 'Website Development', '# SaaS PostgreSQL Database Schema

A professional module resource designed by Olivia Martin for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for SaaS PostgreSQL Database Schema
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: SaaS PostgreSQL Database Schema'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1579354796789?auto=format&fit=crop&q=80&w=800', '{"saas","website-development"}', '03dbcee7-522c-4865-8119-d59eef27319d', 635, 656);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Full Stack Docker Development Environment', 'Project', 'Website Development', '# Full Stack Docker Development Environment

A professional project resource designed by Ryan Lee for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for Full Stack Docker Development Environment
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: Full Stack Docker Development Environment'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1542032844900?auto=format&fit=crop&q=80&w=800', '{"full","website-development"}', '03dbcee7-522c-4865-8119-d59eef27319d', 946, 533);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Production CI/CD Pipeline', 'Module', 'Automation', '# Production CI/CD Pipeline

A professional module resource designed by Alex Chen for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for Production CI/CD Pipeline
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: Production CI/CD Pipeline'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1525153459255?auto=format&fit=crop&q=80&w=800', '{"production","automation"}', '03dbcee7-522c-4865-8119-d59eef27319d', 655, 488);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Website AI Assistant Widget', 'Component', 'AI/ML', '# Website AI Assistant Widget

A professional component resource designed by Maya Patel for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for Website AI Assistant Widget
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: Website AI Assistant Widget'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1562475203079?auto=format&fit=crop&q=80&w=800', '{"website","ai/ml"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1847, 233);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Developer Portfolio Website', 'Project', 'Website Development', '# Developer Portfolio Website

A professional project resource designed by Arjun Dev for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for Developer Portfolio Website
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: Developer Portfolio Website'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1551878672941?auto=format&fit=crop&q=80&w=800', '{"developer","website-development"}', '03dbcee7-522c-4865-8119-d59eef27319d', 612, 863);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('UI Component Generation Prompts', 'Prompt', 'UI/UX', '# UI Component Generation Prompts

A professional prompt resource designed by Noah Williams for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for UI Component Generation Prompts
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: UI Component Generation Prompts'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1516400150294?auto=format&fit=crop&q=80&w=800', '{"ui","ui/ux"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1459, 670);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Mobile Finance Dashboard', 'Component', 'Mobile Applications', '# Mobile Finance Dashboard

A professional component resource designed by Sarah Kim for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for Mobile Finance Dashboard
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: Mobile Finance Dashboard'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1541721315660?auto=format&fit=crop&q=80&w=800', '{"mobile","mobile-applications"}', '03dbcee7-522c-4865-8119-d59eef27319d', 957, 276);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('AI Document Analyzer', 'Project', 'AI/ML', '# AI Document Analyzer

A professional project resource designed by Daniel Thomas for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for AI Document Analyzer
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: AI Document Analyzer'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1506429787374?auto=format&fit=crop&q=80&w=800', '{"ai","ai/ml"}', '03dbcee7-522c-4865-8119-d59eef27319d', 2219, 708);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Full Stack SaaS Starter', 'Project', 'Website Development', '# Full Stack SaaS Starter

A professional project resource designed by Priya Nair for Promptly.

## Features
- High-performance implementation
- Minimalist design aesthetic
- Fully responsive and accessible
- Detailed documentation included

## Installation
Follow the provided README for specific setup instructions.

## License
MIT', '// Source code for Full Stack SaaS Starter
// Build something great with Promptly

const init = () => {
  console.log(''Resource initialized: Full Stack SaaS Starter'');
  // Complete production-quality implementation goes here
  // Including error handling, state management, and optimized rendering
};

init();', 'https://images.unsplash.com/photo-1514171947255?auto=format&fit=crop&q=80&w=800', '{"full","website-development"}', '03dbcee7-522c-4865-8119-d59eef27319d', 2026, 627);
