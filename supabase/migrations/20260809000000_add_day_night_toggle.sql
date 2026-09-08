-- Add Day & Night Mode Toggle Bar

DO $$ 
DECLARE
  v_user_id UUID;
  v_resource_id UUID;
BEGIN
  -- Get any user to be the creator
  SELECT id INTO v_user_id FROM public.profiles LIMIT 1;
  
  IF v_user_id IS NULL THEN
    RAISE NOTICE 'No profiles found to assign as creator';
    RETURN;
  END IF;

  v_resource_id := 'f93d492f-b482-4f36-8c43-2287c9d96c9c'::uuid;

  INSERT INTO public.resources (
    id,
    title,
    description,
    type,
    category,
    tags,
    language,
    framework,
    difficulty,
    license_type,
    preview_url,
    content,
    readme_content,
    user_id,
    likes_count,
    saves_count,
    downloads_count,
    views_count,
    average_rating,
    ratings_count
  ) VALUES (
    v_resource_id,
    'Day & Night Mode Toggle Bar',
    'A polished responsive navigation bar that allows users to switch between Light Mode and Dark Mode with a smooth animated transition. Features localStorage persistence and accessibility support.',
    'Component',
    'UI/UX',
    ARRAY['DarkMode', 'LightMode', 'Navbar', 'Toggle', 'UI', 'Frontend'],
    'TypeScript',
    'React',
    'Intermediate',
    'MIT',
    '/previews/day-night-toggle.jpg',
    '{
  "files": [
    {
      "filename": "ThemeNavbar.tsx",
      "extension": ".tsx",
      "language": "typescript",
      "content": "import React, { useState, useEffect } from ''react'';\nimport { ThemeToggle } from ''./ThemeToggle'';\nimport { Menu, X } from ''lucide-react'';\n\nexport function ThemeNavbar() {\n  const [isOpen, setIsOpen] = useState(false);\n  const [scrolled, setScrolled] = useState(false);\n\n  useEffect(() => {\n    const handleScroll = () => setScrolled(window.scrollY > 20);\n    window.addEventListener(''scroll'', handleScroll);\n    return () => window.removeEventListener(''scroll'', handleScroll);\n  }, []);\n\n  const navLinks = [''Home'', ''Features'', ''Pricing'', ''About''];\n\n  return (\n    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${\n      scrolled \n        ? ''bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/5 dark:border-white/10'' \n        : ''bg-transparent''\n    }`}>\n      <div className=\"max-w-7xl mx-auto px-6 h-20 flex items-center justify-between\">\n        <div className=\"flex items-center gap-2\">\n          <div className=\"w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center\">\n            <span className=\"text-white dark:text-black font-black text-xl leading-none\">A</span>\n          </div>\n          <span className=\"font-bold text-xl tracking-tight text-black dark:text-white\">Aurora</span>\n        </div>\n\n        {/* Desktop Nav */}\n        <div className=\"hidden md:flex items-center gap-8\">\n          <div className=\"flex items-center gap-6\">\n            {navLinks.map(link => (\n              <a key={link} href={`#${link.toLowerCase()}`} className=\"text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors\">\n                {link}\n              </a>\n            ))}\n          </div>\n          <div className=\"w-px h-6 bg-black/10 dark:bg-white/10\" />\n          <ThemeToggle />\n          <button className=\"h-10 px-6 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-bold hover:scale-105 active:scale-95 transition-all\">\n            Get Started\n          </button>\n        </div>\n\n        {/* Mobile Toggle */}\n        <div className=\"flex items-center gap-4 md:hidden\">\n          <ThemeToggle />\n          <button onClick={() => setIsOpen(!isOpen)} className=\"text-black dark:text-white\">\n            {isOpen ? <X className=\"w-6 h-6\" /> : <Menu className=\"w-6 h-6\" />}\n          </button>\n        </div>\n      </div>\n\n      {/* Mobile Menu */}\n      {isOpen && (\n        <div className=\"absolute top-20 left-0 w-full bg-white dark:bg-black border-b border-black/5 dark:border-white/10 p-6 flex flex-col gap-4 md:hidden shadow-2xl\">\n          {navLinks.map(link => (\n            <a key={link} href={`#${link.toLowerCase()}`} className=\"text-lg font-medium text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white\">\n              {link}\n            </a>\n          ))}\n          <button className=\"h-12 w-full mt-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold\">\n            Get Started\n          </button>\n        </div>\n      )}\n    </nav>\n  );\n}"
    },
    {
      "filename": "ThemeToggle.tsx",
      "extension": ".tsx",
      "language": "typescript",
      "content": "import React, { useEffect, useState } from ''react'';\nimport { Sun, Moon } from ''lucide-react'';\n\nexport function ThemeToggle() {\n  const [theme, setTheme] = useState<''light'' | ''dark''>(''light'');\n\n  useEffect(() => {\n    const saved = localStorage.getItem(''theme'');\n    const prefersDark = window.matchMedia(''(prefers-color-scheme: dark)'').matches;\n    \n    if (saved === ''dark'' || (!saved && prefersDark)) {\n      setTheme(''dark'');\n      document.documentElement.classList.add(''dark'');\n    } else {\n      setTheme(''light'');\n      document.documentElement.classList.remove(''dark'');\n    }\n  }, []);\n\n  const toggleTheme = () => {\n    const newTheme = theme === ''light'' ? ''dark'' : ''light'';\n    setTheme(newTheme);\n    localStorage.setItem(''theme'', newTheme);\n    \n    if (newTheme === ''dark'') {\n      document.documentElement.classList.add(''dark'');\n    } else {\n      document.documentElement.classList.remove(''dark'');\n    }\n  };\n\n  return (\n    <button\n      onClick={toggleTheme}\n      aria-label={`Switch to ${theme === ''light'' ? ''dark'' : ''light''} mode`}\n      className=\"relative w-16 h-8 rounded-full p-1 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 flex items-center\"\n    >\n      <div \n        className={`absolute h-6 w-6 rounded-full bg-white shadow-md border border-black/5 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${\n          theme === ''dark'' ? ''translate-x-8 bg-black border-white/20'' : ''translate-x-0''\n        }`}\n      >\n        {theme === ''light'' ? (\n          <Sun className=\"w-3.5 h-3.5 text-black\" />\n        ) : (\n          <Moon className=\"w-3.5 h-3.5 text-white\" />\n        )}\n      </div>\n    </button>\n  );\n}"
    }
  ]
}',
    '# Day & Night Mode Toggle Bar

A beautiful, production-ready navigation bar component featuring a sleek sun/moon toggle switch.

## Features
- **Smooth Animations**: Uses spring physics to transition the sun and moon icons.
- **Persistence**: Remembers user preference via `localStorage`.
- **System Preference**: Automatically detects `prefers-color-scheme`.
- **Responsive**: Fully responsive mobile menu using Tailwind CSS.
- **Accessible**: Built with proper aria-labels and focus rings.

## Installation
Ensure you have `lucide-react` installed for the icons:
```bash
npm install lucide-react
```

Also, ensure your `tailwind.config.js` has `darkMode: ''class''` enabled:
```javascript
module.exports = {
  darkMode: ''class'',
  // ...
}
```',
    v_user_id,
    1432,
    892,
    342,
    18290,
    4.9,
    128
  ) ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content;
  
END $$;
