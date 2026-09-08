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

## File Structure
- `index.html`: Main semantic structure
- `style.css`: Layout and animations
- `script.js`: Toggle logic and scroll detection

## License
MIT License', '/* style.css */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  z-index: 1000;
  transition: all 0.3s ease;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.nav-links a {
  text-decoration: none;
  color: #000;
  font-weight: 500;
  font-size: 0.9rem;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.nav-links a:hover, .nav-links a.active {
  opacity: 1;
}

@media (max-width: 768px) {
  .nav-links {
    display: none; /* Mobile logic handled in script.js */
  }
}', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800', '{"navbar","responsive","navigation","frontend"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1245, 567);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Modern SaaS Dashboard Sidebar', 'Component', 'UI/UX', '# Modern SaaS Dashboard Sidebar

A sleek, collapsible sidebar component designed for modern enterprise dashboards. Features deep nesting, icon support, and fluid animations.

## Features
- Collapsible desktop view to save horizontal space
- Mobile-responsive sliding drawer
- Lucid Icon integration
- Active route state management
- User profile footer with logout action
- Custom scrollbar styling

## Installation
`npm install lucide-react clsx tailwind-merge`

## Customization
The component uses Tailwind CSS for all styling. You can easily adjust colors by modifying the `bg-gray-50` and `text-black` classes.

## License
MIT', 'import React, { useState } from ''react'';
import { LayoutDashboard, Users, BarChart3, Settings, LogOut, ChevronLeft } from ''lucide-react'';

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const navItems = [
    { icon: LayoutDashboard, label: ''Dashboard'', active: true },
    { icon: Users, label: ''Team'', active: false },
    { icon: BarChart3, label: ''Analytics'', active: false },
    { icon: Settings, label: ''Settings'', active: false },
  ];

  return (
    <div className={`flex flex-col h-screen bg-white border-r border-black/5 transition-all duration-300 ${isCollapsed ? ''w-20'' : ''w-64''}`}>
      <div className=''p-6 flex items-center justify-between''>
        {!isCollapsed && <span className=''font-bold text-xl''>Promptly</span>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className=''p-2 hover:bg-black/5 rounded-lg''>
          <ChevronLeft className={`w-5 h-5 transition-transform ${isCollapsed ? ''rotate-180'' : ''''}`} />
        </button>
      </div>
      <nav className=''flex-1 px-4 space-y-2''>
        {navItems.map((item) => (
          <div key={item.label} className={`flex items-center p-3 rounded-xl cursor-pointer ${item.active ? ''bg-black text-white'' : ''hover:bg-black/5''}`}>
            <item.icon className=''w-5 h-5'' />
            {!isCollapsed && <span className=''ml-4 font-medium''>{item.label}</span>}
          </div>
        ))}
      </nav>
    </div>
  );
};', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', '{"dashboard","sidebar","react","tailwind"}', '03dbcee7-522c-4865-8119-d59eef27319d', 890, 340);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Modern Authentication UI', 'Project', 'Website Development', '# Modern Authentication UI

A complete set of authentication screens for React applications. Includes Login, Signup, and Forgot Password flows with integrated form validation.

## Features
- Fully responsive mobile-first layouts
- Zod + React Hook Form validation
- Password strength indicators
- "Show password" toggles
- Social login buttons (Google, Github)
- Loading/Success/Error states

## Technologies
- React 18
- Tailwind CSS
- Lucide Icons
- Framer Motion

## License
MIT', 'import React from ''react'';
import { useForm } from ''react-hook-form'';

export const LoginForm = () => {
  const { register, handleSubmit } = useForm();
  
  return (
    <div className=''max-w-md w-full p-8 bg-white border border-black/5 rounded-3xl shadow-xl''>
      <h2 className=''text-3xl font-black mb-2''>Welcome back</h2>
      <p className=''text-black/40 mb-8''>Sign in to your Promptly account</p>
      
      <form onSubmit={handleSubmit((data) => console.log(data))} className=''space-y-6''>
        <div>
          <label className=''block text-xs font-black uppercase tracking-widest mb-2''>Email Address</label>
          <input {...register(''email'')} type=''email'' className=''w-full px-4 py-3 bg-black/5 rounded-xl border-none focus:ring-2 focus:ring-black/10'' placeholder=''name@company.com'' />
        </div>
        <button className=''w-full py-4 bg-black text-white rounded-xl font-bold uppercase tracking-widest hover:scale-[1.02] transition-transform''>
          Continue
        </button>
      </form>
    </div>
  );
};', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800', '{"auth","login","react","frontend"}', '03dbcee7-522c-4865-8119-d59eef27319d', 2100, 845);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Minimal AI Chat Interface', 'Component', 'AI/ML', '# Minimal AI Chat Interface

A clean, conversation-focused UI for building AI applications. Inspired by ChatGPT and Claude''s minimalist design language.

## Features
- Auto-expanding textarea input
- Markdown message rendering
- Syntax highlighting for 50+ languages
- Typing indicators and streaming states
- "Copy to clipboard" for code blocks
- Mobile optimized conversation drawer

## Usage
Simply drop the `ChatContainer` component into your application and hook it up to your LLM streaming endpoint.

## License
MIT', 'import React, { useState } from ''react'';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { role: ''assistant'', content: ''How can I help you build today?'' }
  ]);

  return (
    <div className=''flex flex-col max-w-4xl mx-auto h-[80vh] bg-white border border-black/5 rounded-[40px] overflow-hidden shadow-2xl''>
      <div className=''flex-1 overflow-y-auto p-8 space-y-8''>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === ''user'' ? ''justify-end'' : ''justify-start''}`}>
            <div className={`max-w-[80%] p-6 rounded-[32px] ${m.role === ''user'' ? ''bg-black text-white'' : ''bg-black/5''}`}>
              <p className=''leading-relaxed''>{m.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className=''p-8 border-t border-black/5''>
        <div className=''relative''>
          <input className=''w-full py-5 px-8 bg-black/5 rounded-full border-none focus:ring-2 focus:ring-black/10'' placeholder=''Ask anything...'' />
          <button className=''absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black text-white rounded-full''>
            &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};', 'https://images.unsplash.com/photo-1676299081847-c0326a0333d5?auto=format&fit=crop&q=80&w=800', '{"ai","chat","llm","ui-kit"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1560, 720);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('AI Prompt Enhancer', 'Function', 'AI/ML', '# AI Prompt Enhancer

A Python-based utility to automatically transform vague user prompts into structured, detail-rich instructions for Large Language Models.

## How it works
It uses a multi-stage approach:
1. **Context Expansion**: Identifies the core intent and adds relevant domain keywords.
2. **Formatting**: Wraps the prompt in a professional structure (Role, Task, Context, Constraints).
3. **Style Refinement**: Ensures the tone is clear and concise.

## Installation
`pip install openai pydantic`

## Usage
```python
from enhancer import PromptEnhancer
enhancer = PromptEnhancer(api_key=''your_key'')
better_prompt = enhancer.transform("Write a react navbar")
```', 'import openai
from pydantic import BaseModel

class EnhancedPrompt(BaseModel):
    role: str
    task: str
    context: str
    constraints: list[str]

class PromptEnhancer:
    def __init__(self, api_key: str):
        self.client = openai.Client(api_key=api_key)

    def transform(self, rough_prompt: str) -> str:
        response = self.client.chat.completions.create(
            model=''gpt-4'',
            messages=[{
                ''role'': ''system'',
                ''content'': ''You are a prompt engineering expert. Rewrite user prompts to be professional and effective.''
            }, {
                ''role'': ''user'',
                ''content'': rough_prompt
            }]
        )
        return response.choices[0].message.content', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800', '{"prompt-engineering","python","ai","gpt4"}', '03dbcee7-522c-4865-8119-d59eef27319d', 430, 180);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Premium SaaS Landing Page', 'Project', 'Website Development', '# Premium SaaS Landing Page

A complete, high-conversion landing page template for modern tech startups. Built with Next.js 14, Tailwind CSS, and Framer Motion.

## Sections
- **Hero**: Minimal centered headline with particle background
- **Trust Bar**: Scrolling marquee of brand logos
- **Features**: Interactive grid with hover effects
- **Pricing**: Dynamic monthly/yearly toggle
- **FAQ**: Accessible accordion with smooth height transitions

## Deployment
One-click deployment to Vercel or Netlify.

## License
MIT', 'import { motion } from ''framer-motion'';

export default function LandingPage() {
  return (
    <div className=''bg-white text-black''>
      <section className=''pt-32 pb-20 px-6 max-w-7xl mx-auto text-center''>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className=''text-7xl font-black tracking-tighter mb-8''
        >
          Ship faster than <br/> your competition.
        </motion.h1>
        <p className=''text-xl text-black/50 mb-12 max-w-2xl mx-auto''>
          The definitive starter kit for high-performance SaaS applications.
        </p>
        <div className=''flex justify-center gap-4''>
          <button className=''px-8 py-4 bg-black text-white rounded-full font-bold''>Get Started</button>
          <button className=''px-8 py-4 border border-black/10 rounded-full font-bold''>View Demo</button>
        </div>
      </section>
    </div>
  );
}', 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&q=80&w=800', '{"saas","landing-page","nextjs","frontend"}', '03dbcee7-522c-4865-8119-d59eef27319d', 3200, 1200);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Interactive E-commerce Product Card', 'Component', 'UI/UX', '# Interactive E-commerce Product Card

A professional component resource designed by Priya Nair for Promptly.

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

console.log(''Resource initialized: Interactive E-commerce Product Card'');', 'https://source.unsplash.com/featured/800x600?product-card,tech', '{"interactive","ui/ux","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 318, 729);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Modern Mobile Bottom Navigation', 'Component', 'Mobile Applications', '# Modern Mobile Bottom Navigation

A professional component resource designed by Ethan Cole for Promptly.

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

console.log(''Resource initialized: Modern Mobile Bottom Navigation'');', 'https://source.unsplash.com/featured/800x600?mobile-nav,tech', '{"modern","mobile-applications","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 719, 290);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Premium Flutter Login Screen', 'Component', 'Mobile Applications', '# Premium Flutter Login Screen

A professional component resource designed by Olivia Martin for Promptly.

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

console.log(''Resource initialized: Premium Flutter Login Screen'');', 'https://source.unsplash.com/featured/800x600?flutter-app,tech', '{"premium","mobile-applications","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1744, 433);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Python Data Analytics Dashboard', 'Project', 'Data Science', '# Python Data Analytics Dashboard

A professional project resource designed by Ryan Lee for Promptly.

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

console.log(''Resource initialized: Python Data Analytics Dashboard'');', 'https://source.unsplash.com/featured/800x600?data-viz,tech', '{"python","data-science","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1228, 538);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('AI Image Generation Prompt Collection', 'Prompt', 'AI/ML', '# AI Image Generation Prompt Collection

A professional prompt resource designed by Alex Chen for Promptly.

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

console.log(''Resource initialized: AI Image Generation Prompt Collection'');', 'https://source.unsplash.com/featured/800x600?ai-art,tech', '{"ai","ai/ml","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1513, 198);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Tailwind UI Component Collection', 'UI/UX', 'UI/UX', '# Tailwind UI Component Collection

A professional ui/ux resource designed by Maya Patel for Promptly.

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

console.log(''Resource initialized: Tailwind UI Component Collection'');', 'https://source.unsplash.com/featured/800x600?ui-components,tech', '{"tailwind","ui/ux","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 322, 523);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Production Ready REST API Starter', 'Project', 'Website Development', '# Production Ready REST API Starter

A professional project resource designed by Arjun Dev for Promptly.

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

console.log(''Resource initialized: Production Ready REST API Starter'');', 'https://source.unsplash.com/featured/800x600?api,tech', '{"production","website-development","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1875, 133);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('JWT Authentication API', 'Module', 'Website Development', '# JWT Authentication API

A professional module resource designed by Noah Williams for Promptly.

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

console.log(''Resource initialized: JWT Authentication API'');', 'https://source.unsplash.com/featured/800x600?security,tech', '{"jwt","website-development","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 192, 730);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Modern Admin Dashboard', 'Project', 'Website Development', '# Modern Admin Dashboard

A professional project resource designed by Sarah Kim for Promptly.

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

console.log(''Resource initialized: Modern Admin Dashboard'');', 'https://source.unsplash.com/featured/800x600?admin,tech', '{"modern","website-development","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 427, 390);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Cinematic Animated Hero Section', 'Component', 'UI/UX', '# Cinematic Animated Hero Section

A professional component resource designed by Daniel Thomas for Promptly.

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

console.log(''Resource initialized: Cinematic Animated Hero Section'');', 'https://source.unsplash.com/featured/800x600?hero-section,tech', '{"cinematic","ui/ux","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1973, 402);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Advanced File Upload Interface', 'Component', 'Website Development', '# Advanced File Upload Interface

A professional component resource designed by Priya Nair for Promptly.

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

console.log(''Resource initialized: Advanced File Upload Interface'');', 'https://source.unsplash.com/featured/800x600?upload,tech', '{"advanced","website-development","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1225, 81);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Developer Markdown Editor', 'Component', 'Productivity', '# Developer Markdown Editor

A professional component resource designed by Ethan Cole for Promptly.

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

console.log(''Resource initialized: Developer Markdown Editor'');', 'https://source.unsplash.com/featured/800x600?editor,tech', '{"developer","productivity","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1055, 512);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Python File Organizer Automation', 'Function', 'Automation', '# Python File Organizer Automation

A professional function resource designed by Olivia Martin for Promptly.

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

console.log(''Resource initialized: Python File Organizer Automation'');', 'https://source.unsplash.com/featured/800x600?automation,tech', '{"python","automation","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1833, 126);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Python Web Data Collector', 'Project', 'Automation', '# Python Web Data Collector

A professional project resource designed by Ryan Lee for Promptly.

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

console.log(''Resource initialized: Python Web Data Collector'');', 'https://source.unsplash.com/featured/800x600?scraper,tech', '{"python","automation","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1316, 157);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Minimal Design System', 'UI/UX', 'UI/UX', '# Minimal Design System

A professional ui/ux resource designed by Alex Chen for Promptly.

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

console.log(''Resource initialized: Minimal Design System'');', 'https://source.unsplash.com/featured/800x600?design-system,tech', '{"minimal","ui/ux","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1521, 726);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('SaaS PostgreSQL Database Schema', 'Module', 'Website Development', '# SaaS PostgreSQL Database Schema

A professional module resource designed by Maya Patel for Promptly.

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

console.log(''Resource initialized: SaaS PostgreSQL Database Schema'');', 'https://source.unsplash.com/featured/800x600?database,tech', '{"saas","website-development","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1479, 796);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Full Stack Docker Development Environment', 'Project', 'Website Development', '# Full Stack Docker Development Environment

A professional project resource designed by Arjun Dev for Promptly.

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

console.log(''Resource initialized: Full Stack Docker Development Environment'');', 'https://source.unsplash.com/featured/800x600?docker,tech', '{"full","website-development","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 314, 477);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Production CI/CD Pipeline', 'Module', 'Automation', '# Production CI/CD Pipeline

A professional module resource designed by Noah Williams for Promptly.

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

console.log(''Resource initialized: Production CI/CD Pipeline'');', 'https://source.unsplash.com/featured/800x600?pipeline,tech', '{"production","automation","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 638, 349);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Website AI Assistant Widget', 'Component', 'AI/ML', '# Website AI Assistant Widget

A professional component resource designed by Sarah Kim for Promptly.

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

console.log(''Resource initialized: Website AI Assistant Widget'');', 'https://source.unsplash.com/featured/800x600?chatbot,tech', '{"website","ai/ml","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1515, 734);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Developer Portfolio Website', 'Project', 'Website Development', '# Developer Portfolio Website

A professional project resource designed by Daniel Thomas for Promptly.

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

console.log(''Resource initialized: Developer Portfolio Website'');', 'https://source.unsplash.com/featured/800x600?portfolio,tech', '{"developer","website-development","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1983, 779);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('UI Component Generation Prompts', 'Prompt', 'UI/UX', '# UI Component Generation Prompts

A professional prompt resource designed by Priya Nair for Promptly.

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

console.log(''Resource initialized: UI Component Generation Prompts'');', 'https://source.unsplash.com/featured/800x600?prompts,tech', '{"ui","ui/ux","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 632, 509);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Mobile Finance Dashboard', 'Component', 'Mobile Applications', '# Mobile Finance Dashboard

A professional component resource designed by Ethan Cole for Promptly.

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

console.log(''Resource initialized: Mobile Finance Dashboard'');', 'https://source.unsplash.com/featured/800x600?finance-app,tech', '{"mobile","mobile-applications","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 782, 179);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('AI Document Analyzer', 'Project', 'AI/ML', '# AI Document Analyzer

A professional project resource designed by Olivia Martin for Promptly.

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

console.log(''Resource initialized: AI Document Analyzer'');', 'https://source.unsplash.com/featured/800x600?document,tech', '{"ai","ai/ml","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 909, 733);
INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('Full Stack SaaS Starter', 'Project', 'Website Development', '# Full Stack SaaS Starter

A professional project resource designed by Ryan Lee for Promptly.

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

console.log(''Resource initialized: Full Stack SaaS Starter'');', 'https://source.unsplash.com/featured/800x600?saas-app,tech', '{"full","website-development","premium"}', '03dbcee7-522c-4865-8119-d59eef27319d', 1934, 348);
