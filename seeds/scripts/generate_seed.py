import json
import random
import uuid
from datetime import datetime

# Creator identities to ensure consistency
creators = [
    {"username": "Alex Chen", "avatar": "https://ui-avatars.com/api/?name=Alex+Chen&background=000&color=fff"},
    {"username": "Maya Patel", "avatar": "https://ui-avatars.com/api/?name=Maya+Patel&background=000&color=fff"},
    {"username": "Arjun Dev", "avatar": "https://ui-avatars.com/api/?name=Arjun+Dev&background=000&color=fff"},
    {"username": "Noah Williams", "avatar": "https://ui-avatars.com/api/?name=Noah+Williams&background=000&color=fff"},
    {"username": "Sarah Kim", "avatar": "https://ui-avatars.com/api/?name=Sarah+Kim&background=000&color=fff"},
    {"username": "Daniel Thomas", "avatar": "https://ui-avatars.com/api/?name=Daniel+Thomas&background=000&color=fff"},
    {"username": "Priya Nair", "avatar": "https://ui-avatars.com/api/?name=Priya+Nair&background=000&color=fff"},
    {"username": "Ethan Cole", "avatar": "https://ui-avatars.com/api/?name=Ethan+Cole&background=000&color=fff"},
    {"username": "Olivia Martin", "avatar": "https://ui-avatars.com/api/?name=Olivia+Martin&background=000&color=fff"},
    {"username": "Ryan Lee", "avatar": "https://ui-avatars.com/api/?name=Ryan+Lee&background=000&color=fff"},
]

# We need to create these profiles first if they don't exist
# But for the simulation, we'll map them to the existing creator_id if we have to, 
# or generate new UUIDs if the migration allows.
# Given Lovable constraints, we should use the existing user_id for now or create new profile rows.

def generate_resource(index, existing_creator_id):
    creator = creators[index % len(creators)]
    
    # Categories and types from schema
    categories = ["Website Development", "Mobile Applications", "UI/UX", "AI/ML", "Data Science", "Automation", "Marketing", "Content Creation", "Business", "Education", "Productivity"]
    types = ["Prompt", "Code", "UI/UX", "Component", "Template", "Project", "Module", "Function"]

    # 1. Modern Responsive Navbar
    if index == 0:
        return {
            "title": "Minimal Responsive Navbar",
            "type": "UI/UX",
            "category": "UI/UX",
            "description": "# Minimal Responsive Navbar\n\nA production-ready responsive navigation bar built with semantic HTML, modern CSS, and vanilla JavaScript. Features smooth transitions, mobile-first design, and accessibility best-practices.\n\n### Features\n- Desktop Mega-menu support\n- Mobile Hamburger Drawer\n- Sticky Header with Glassmorphism\n- Active Link detection\n- Keyboard Accessibility (Tab-friendly)\n\n### Installation\nSimply copy the HTML/CSS/JS files into your project and link them in your `<head>`.\n\n### Usage\nCustomize the `nav-links` array in `script.js` to match your site structure.",
            "content": "<!-- index.html -->\n<nav class='navbar'>\n  <div class='logo'>Promptly</div>\n  <ul class='nav-links'>\n    <li><a href='#'>Home</a></li>\n    <li><a href='#'>Explore</a></li>\n    <li><a href='#'>Resources</a></li>\n  </ul>\n  <button class='mobile-toggle'>☰</button>\n</nav>",
            "preview_url": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800",
            "tags": ["navbar", "responsive", "navigation", "ui-ux"],
            "likes_count": random.randint(150, 500),
            "saves_count": random.randint(40, 120),
            "creator_id": existing_creator_id
        }
    
    # 2. Dashboard Sidebar
    elif index == 1:
        return {
            "title": "Modern SaaS Dashboard Sidebar",
            "type": "Component",
            "category": "UI/UX",
            "description": "A sleek, collapsible sidebar component for enterprise SaaS applications. Built with React and Tailwind CSS.\n\n### Features\n- Collapsible state management\n- Tooltip integration\n- Active route highlighting\n- Profile footer section\n- Dark mode compatible",
            "content": "// Sidebar.jsx\nimport React, { useState } from 'react';\nimport { Home, Settings, Users, BarChart } from 'lucide-react';\n\nconst Sidebar = () => {\n  const [collapsed, setCollapsed] = useState(false);\n  return (\n    <div className={`h-screen bg-white border-r transition-all ${collapsed ? 'w-20' : 'w-64'}`}>\n      {/* Navigation items */}\n    </div>\n  );\n};",
            "preview_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
            "tags": ["dashboard", "sidebar", "saas", "react"],
            "likes_count": random.randint(200, 600),
            "saves_count": random.randint(80, 200),
            "creator_id": existing_creator_id
        }

    # 3. Authentication UI
    elif index == 2:
        return {
            "title": "Modern Authentication UI",
            "type": "Project",
            "category": "Website Development",
            "description": "Complete authentication frontend flows including Login, Signup, and Password Reset screens.\n\n### Included Views\n1. Login with Social Auth options\n2. Multi-step Signup\n3. Verification Email landing\n4. Password Recovery",
            "content": "// App.tsx\nimport { Login } from './pages/Login';\nimport { Signup } from './pages/Signup';\n\nexport const AuthStack = () => (\n  <Routes>\n    <Route path='/login' element={<Login />} />\n    <Route path='/signup' element={<Signup />} />\n  </Routes>\n);",
            "preview_url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
            "tags": ["auth", "login", "signup", "typescript"],
            "likes_count": random.randint(300, 800),
            "saves_count": random.randint(150, 400),
            "creator_id": existing_creator_id
        }

    # 4. AI Chat Interface
    elif index == 3:
        return {
            "title": "Minimal AI Chat Interface",
            "type": "Component",
            "category": "AI/ML",
            "description": "A ChatGPT-inspired chat interface with auto-scrolling, code highlighting, and streaming message simulation.\n\n### Features\n- Markdown rendering support\n- Code block syntax highlighting\n- Response streaming UI\n- Mobile responsive input area",
            "content": "// Chat.tsx\nconst Chat = () => {\n  const [messages, setMessages] = useState([]);\n  return (\n    <div className='flex flex-col h-full'>\n      <MessageList messages={messages} />\n      <ChatInput onSend={(m) => setMessages([...messages, m])} />\n    </div>\n  );\n};",
            "preview_url": "https://images.unsplash.com/photo-1676299081847-c0326a0333d5?auto=format&fit=crop&q=80&w=800",
            "tags": ["ai", "chat", "interface", "openai"],
            "likes_count": random.randint(400, 1000),
            "saves_count": random.randint(200, 500),
            "creator_id": existing_creator_id
        }

    # Default fallback for others during the loop
    return {
        "title": f"Resource {index+1}: {random.choice(['Advanced', 'Clean', 'Professional', 'Modern'])} {random.choice(['Library', 'Tool', 'Framework', 'Dashboard'])}",
        "type": random.choice(types),
        "category": random.choice(categories),
        "description": f"This is a high-quality resource created by {creator['username']}. It includes production-ready code and complete documentation.",
        "content": f"// Source code for resource {index+1}\nconsole.log('Hello Promptly');",
        "preview_url": f"https://picsum.photos/seed/{index}/800/600",
        "tags": ["sample", "resource", creator['username'].split()[0].lower()],
        "likes_count": random.randint(50, 300),
        "saves_count": random.randint(20, 100),
        "creator_id": existing_creator_id
    }

# This script generates a SQL migration to seed the data
# We'll use the creator_id we found earlier: 03dbcee7-522c-4865-8119-d59eef27319d

CREATOR_ID = "03dbcee7-522c-4865-8119-d59eef27319d"
resources_sql = []

for i in range(30):
    res = generate_resource(i, CREATOR_ID)
    title = res['title'].replace("'", "''")
    desc = res['description'].replace("'", "''")
    content = res['content'].replace("'", "''")
    tags = "{" + ",".join(f'"{t}"' for t in res['tags']) + "}"
    
    sql = f"INSERT INTO public.resources (title, type, category, description, content, preview_url, tags, creator_id, likes_count, saves_count) VALUES ('{title}', '{res['type']}', '{res['category']}', '{desc}', '{content}', '{res['preview_url']}', '{tags}', '{res['creator_id']}', {res['likes_count']}, {res['saves_count']});"
    resources_sql.append(sql)

print("\n".join(resources_sql))
