import fs from 'fs';
import crypto from 'crypto';

function uuid() {
  return crypto.randomUUID();
}

// Generate 10 Creator Profiles
const creators = [
  { id: uuid(), username: 'alexc', full_name: 'Alex Chen', avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop' },
  { id: uuid(), username: 'mayap', full_name: 'Maya Patel', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
  { id: uuid(), username: 'arjund', full_name: 'Arjun Dev', avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop' },
  { id: uuid(), username: 'noahw', full_name: 'Noah Williams', avatar_url: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop' },
  { id: uuid(), username: 'sarahk', full_name: 'Sarah Kim', avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' },
  { id: uuid(), username: 'danielt', full_name: 'Daniel Thomas', avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' },
  { id: uuid(), username: 'priyan', full_name: 'Priya Nair', avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop' },
  { id: uuid(), username: 'ethanc', full_name: 'Ethan Cole', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
  { id: uuid(), username: 'oliviam', full_name: 'Olivia Martin', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop' },
  { id: uuid(), username: 'ryanl', full_name: 'Ryan Lee', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' }
];

const escapeSql = (str) => {
  if (!str) return 'NULL';
  return "'" + str.replace(/'/g, "''") + "'";
};

let sql = "-- ==========================================\n" +
"-- PROMPTLY SEED DATA\n" +
"-- ==========================================\n\n" +
"DELETE FROM public.comments;\n" +
"DELETE FROM public.likes;\n" +
"DELETE FROM public.saves;\n" +
"DELETE FROM public.ratings;\n" +
"DELETE FROM public.resources;\n\n";

sql += "-- 2. Insert Profiles\n";
for (const c of creators) {
  sql += "INSERT INTO public.profiles (id, username, full_name, avatar_url, onboarding_completed, role) VALUES (" + escapeSql(c.id) + ", " + escapeSql(c.username) + ", " + escapeSql(c.full_name) + ", " + escapeSql(c.avatar_url) + ", true, 'user') ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username, full_name = EXCLUDED.full_name, avatar_url = EXCLUDED.avatar_url;\n";
}

const resources = [];

const topics = [
  { t: "Minimal Responsive Navbar", c: "UI/UX", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" },
  { t: "Modern SaaS Dashboard Sidebar", c: "UI/UX", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" },
  { t: "Modern Authentication UI", c: "Website Development", img: "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=800&q=80" },
  { t: "Minimal AI Chat Interface", c: "AI/ML", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80" },
  { t: "AI Prompt Enhancer", c: "AI/ML", img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80" },
  { t: "Premium SaaS Landing Page", c: "Website Development", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" },
  { t: "Interactive E-commerce Product Card", c: "UI/UX", img: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80" },
  { t: "Modern Mobile Bottom Navigation", c: "Mobile Applications", img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80" },
  { t: "Premium Flutter Login Screen", c: "Mobile Applications", img: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=800&q=80" },
  { t: "Python Data Analytics Dashboard", c: "Data Science", img: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?auto=format&fit=crop&w=800&q=80" },
  { t: "AI Image Generation Prompts", c: "AI/ML", img: "https://images.unsplash.com/photo-1682687982501-1e5898cb8e4b?auto=format&fit=crop&w=800&q=80" },
  { t: "Tailwind UI Components", c: "UI/UX", img: "https://images.unsplash.com/photo-1507238692062-58751aa51417?auto=format&fit=crop&w=800&q=80" },
  { t: "Production Ready REST API", c: "Website Development", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80" },
  { t: "JWT Authentication System", c: "Website Development", img: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80" },
  { t: "Modern Admin Panel", c: "Website Development", img: "https://images.unsplash.com/photo-1551009175-8a68da93d5f9?auto=format&fit=crop&w=800&q=80" },
  { t: "Cinematic Animated Hero", c: "UI/UX", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" },
  { t: "Advanced File Upload UI", c: "UI/UX", img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80" },
  { t: "Developer Markdown Editor", c: "Productivity", img: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80" },
  { t: "Python File Organizer script", c: "Automation", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80" },
  { t: "Python Web Scraper Tool", c: "Automation", img: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=800&q=80" },
  { t: "Minimal React Design System", c: "UI/UX", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80" },
  { t: "SaaS Database Schema Model", c: "Data Science", img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80" },
  { t: "Full Stack Docker Env", c: "Website Development", img: "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=800&q=80" },
  { t: "Production CI/CD Actions", c: "Automation", img: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80" },
  { t: "Website AI Assistant Bot", c: "AI/ML", img: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80" },
  { t: "Developer Portfolio Template", c: "Website Development", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80" },
  { t: "UX Component Generation Prompts", c: "UI/UX", img: "https://images.unsplash.com/photo-1557821552-17105153ce9a?auto=format&fit=crop&w=800&q=80" },
  { t: "Mobile Finance App Design", c: "Mobile Applications", img: "https://images.unsplash.com/photo-1607799279861-4dddf8b60dd5?auto=format&fit=crop&w=800&q=80" },
  { t: "AI Document Analyzer NLP", c: "AI/ML", img: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80" },
  { t: "Full Stack Next.js SaaS", c: "Website Development", img: "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?auto=format&fit=crop&w=800&q=80" }
];

function createResource(title, category, type, description, contentObj, readme, preview_url) {
  const creator = creators[Math.floor(Math.random() * creators.length)];
  return {
    id: uuid(),
    title,
    category,
    type,
    description,
    content: JSON.stringify(contentObj),
    readme_content: readme,
    preview_url,
    creator_id: creator.id,
    difficulty: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
    language: 'JavaScript',
    framework: 'React',
    license_type: 'MIT',
    likes_count: Math.floor(Math.random() * 2000) + 50,
    saves_count: Math.floor(Math.random() * 1000) + 10,
    downloads_count: Math.floor(Math.random() * 3000) + 100,
    views_count: Math.floor(Math.random() * 10000) + 500,
    tags: JSON.stringify(['Modern', 'Responsive', 'Clean']),
  };
}

for (const t of topics) {
  const codeContent = "// " + t.t + "\nimport React from 'react';\n\nexport default function App() {\n  return <div>" + t.t + "</div>;\n}\n";

  resources.push(createResource(
    t.t,
    t.c,
    "Project",
    "A premium quality implementation of " + t.t + ". Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.",
    {
      files: [
        { filename: "App.jsx", extension: ".jsx", language: "JavaScript", content: codeContent },
        { filename: "package.json", extension: ".json", language: "JSON", content: "{\"name\":\"project\"}" }
      ]
    },
    "# " + t.t + "\n\n## Overview\nThis project provides a complete, polished solution for **" + t.t + "**.\n\n## License\nMIT",
    t.img
  ));
}

sql += "\n-- 3. Insert Resources\n";
for (const r of resources) {
  sql += "INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES (" + escapeSql(r.id) + ", " + escapeSql(r.title) + ", " + escapeSql(r.category) + ", " + escapeSql(r.type) + ", " + escapeSql(r.description) + ", " + escapeSql(r.content) + ", " + escapeSql(r.readme_content) + ", " + escapeSql(r.preview_url) + ", " + escapeSql(r.creator_id) + ", " + escapeSql(r.difficulty) + ", " + escapeSql(r.language) + ", " + escapeSql(r.framework) + ", " + escapeSql(r.license_type) + ", " + r.likes_count + ", " + r.saves_count + ", " + r.downloads_count + ", " + r.views_count + ", " + escapeSql(r.tags) + ");\n";
}

const timestamp = "20260808235959";
const filename = "supabase/migrations/" + timestamp + "_seed_real_data.sql";

fs.writeFileSync(filename, sql, 'utf-8');
console.log('Successfully generated migration file: ' + filename);
