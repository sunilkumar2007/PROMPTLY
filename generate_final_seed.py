import uuid
import random

CREATOR_ID = "03dbcee7-522c-4865-8119-d59eef27319d"

creators = [
    "Alex Chen", "Maya Patel", "Arjun Dev", "Noah Williams", "Sarah Kim", 
    "Daniel Thomas", "Priya Nair", "Ethan Cole", "Olivia Martin", "Ryan Lee"
]

def get_creator(i):
    return creators[i % len(creators)]

# Extended resources list with all 30 items
resources = []

# 1. MODERN RESPONSIVE NAVBAR
resources.append({
    "title": "Minimal Responsive Navbar",
    "type": "UI/UX",
    "category": "UI/UX",
    "description": """# Minimal Responsive Navbar

A production-ready responsive navigation bar built with semantic HTML, modern CSS, and vanilla JavaScript.

## Features
- Desktop Mega-menu support
- Mobile Hamburger Drawer
- Sticky Header with Glassmorphism
- Keyboard Accessibility
- Active Link detection

## Installation
Copy HTML/CSS/JS into your project.

## License
MIT""",
    "content": """/* style.css */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1000;
}""",
    "preview_url": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800",
    "tags": ["navbar", "responsive", "ui-ux"],
    "likes": 1245, "saves": 567
})

# 2. DASHBOARD SIDEBAR
resources.append({
    "title": "Modern SaaS Dashboard Sidebar",
    "type": "Component",
    "category": "UI/UX",
    "description": """# Modern SaaS Dashboard Sidebar
Sleek, collapsible sidebar for React dashboards.""",
    "content": "const Sidebar = () => { return <div className='w-64 border-r'>Sidebar</div>; };",
    "preview_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    "tags": ["dashboard", "sidebar", "react"],
    "likes": 890, "saves": 340
})

# 3. AUTHENTICATION UI
resources.append({
    "title": "Modern Authentication UI",
    "type": "Project",
    "category": "Website Development",
    "description": "# Modern Authentication UI\nComplete Login/Signup flows.",
    "content": "export const LoginForm = () => { return <form>Login</form>; };",
    "preview_url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    "tags": ["auth", "login", "react"],
    "likes": 2100, "saves": 845
})

# ... filling 30 items with specific requested titles/types/categories ...
titles = [
    "Minimal AI Chat Interface", "AI Prompt Enhancer", "Premium SaaS Landing Page",
    "Interactive E-commerce Product Card", "Modern Mobile Bottom Navigation", "Premium Flutter Login Screen",
    "Python Data Analytics Dashboard", "AI Image Generation Prompt Collection", "Tailwind UI Component Collection",
    "Production Ready REST API Starter", "JWT Authentication API", "Modern Admin Dashboard",
    "Cinematic Animated Hero Section", "Advanced File Upload Interface", "Developer Markdown Editor",
    "Python File Organizer Automation", "Python Web Data Collector", "Minimal Design System",
    "SaaS PostgreSQL Database Schema", "Full Stack Docker Development Environment", "Production CI/CD Pipeline",
    "Website AI Assistant Widget", "Developer Portfolio Website", "UI Component Generation Prompts",
    "Mobile Finance Dashboard", "AI Document Analyzer", "Full Stack SaaS Starter"
]

types = [
    "Component", "Function", "Project", "Component", "Component", "Component", 
    "Project", "Prompt", "UI/UX", "Project", "Module", "Project", 
    "Component", "Component", "Component", "Function", "Project", "UI/UX", 
    "Module", "Project", "Module", "Component", "Project", "Prompt", 
    "Component", "Project", "Project"
]

cats = [
    "AI/ML", "AI/ML", "Website Development", "UI/UX", "Mobile Applications", "Mobile Applications",
    "Data Science", "AI/ML", "UI/UX", "Website Development", "Website Development", "Website Development",
    "UI/UX", "Website Development", "Productivity", "Automation", "Automation", "UI/UX",
    "Website Development", "Website Development", "Automation", "AI/ML", "Website Development", "UI/UX",
    "Mobile Applications", "AI/ML", "Website Development"
]

keywords = [
    "chat", "ai-brain", "saas", "product", "mobile-nav", "flutter", "charts", "midjourney", "ui-kit",
    "api-server", "jwt", "dashboard", "hero", "upload", "markdown", "files", "scraping", "design-system",
    "sql", "docker", "pipeline", "bot", "portfolio", "prompt-pack", "finance", "rag", "complete-saas"
]

for i in range(len(titles)):
    resources.append({
        "title": titles[i],
        "type": types[i],
        "category": cats[i],
        "description": f"# {titles[i]}\nHigh quality {types[i].lower()} for Promptly by {get_creator(i)}.",
        "content": f"// Source for {titles[i]}\nconsole.log('Production ready code');",
        "preview_url": f"https://images.unsplash.com/photo-{random.randint(1500000000000, 1600000000000)}?auto=format&fit=crop&q=80&w=800" if i > 10 else f"https://source.unsplash.com/featured/800x600?{keywords[i]}",
        "tags": [titles[i].split()[0].lower(), cats[i].lower().replace(" ", "-")],
        "likes": random.randint(300, 2500),
        "saves": random.randint(100, 900)
    })

sql_statements = ["TRUNCATE public.resources CASCADE;"] # Clean start
for res in resources:
    title = res['title'].replace("'", "''")
    desc = res['description'].replace("'", "''")
    content = res['content'].replace("'", "''")
    tags = "{" + ",".join(f'"{t}"' for t in res['tags']) + "}"
    
    sql = f"INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('{title}', '{res['type']}', '{res['category']}', '{desc}', '{content}', '{res['preview_url']}', '{tags}', '{CREATOR_ID}', {res['likes']}, {res['saves']});"
    sql_statements.append(sql)

print("\n".join(sql_statements))
