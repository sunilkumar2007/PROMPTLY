-- ==========================================
-- PROMPTLY SEED DATA
-- ==========================================

DELETE FROM public.comments;
DELETE FROM public.likes;
DELETE FROM public.saves;
DELETE FROM public.ratings;
DELETE FROM public.resources;

-- 2. Insert Profiles
INSERT INTO public.profiles (id, username, full_name, avatar_url, onboarding_completed, role) VALUES ('05e83e4e-e9d7-451c-a4f9-4b2ce4c923e8', 'alexc', 'Alex Chen', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop', true, 'user') ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username, full_name = EXCLUDED.full_name, avatar_url = EXCLUDED.avatar_url;
INSERT INTO public.profiles (id, username, full_name, avatar_url, onboarding_completed, role) VALUES ('7340910e-9b3f-43bc-a2b1-fe2065ed60c7', 'mayap', 'Maya Patel', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', true, 'user') ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username, full_name = EXCLUDED.full_name, avatar_url = EXCLUDED.avatar_url;
INSERT INTO public.profiles (id, username, full_name, avatar_url, onboarding_completed, role) VALUES ('b0c2ea9a-1a14-4409-b733-ab6d4d9aec84', 'arjund', 'Arjun Dev', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop', true, 'user') ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username, full_name = EXCLUDED.full_name, avatar_url = EXCLUDED.avatar_url;
INSERT INTO public.profiles (id, username, full_name, avatar_url, onboarding_completed, role) VALUES ('775e4c33-b789-4f30-854e-d286e5bfc349', 'noahw', 'Noah Williams', 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop', true, 'user') ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username, full_name = EXCLUDED.full_name, avatar_url = EXCLUDED.avatar_url;
INSERT INTO public.profiles (id, username, full_name, avatar_url, onboarding_completed, role) VALUES ('39efa43b-6eb7-4069-8a1b-ca8de32ff2a1', 'sarahk', 'Sarah Kim', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop', true, 'user') ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username, full_name = EXCLUDED.full_name, avatar_url = EXCLUDED.avatar_url;
INSERT INTO public.profiles (id, username, full_name, avatar_url, onboarding_completed, role) VALUES ('18b03b54-36bd-4dcc-a43f-f4f55f9ef21b', 'danielt', 'Daniel Thomas', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop', true, 'user') ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username, full_name = EXCLUDED.full_name, avatar_url = EXCLUDED.avatar_url;
INSERT INTO public.profiles (id, username, full_name, avatar_url, onboarding_completed, role) VALUES ('5954ce1b-c48c-4c51-995d-62b035d085fe', 'priyan', 'Priya Nair', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop', true, 'user') ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username, full_name = EXCLUDED.full_name, avatar_url = EXCLUDED.avatar_url;
INSERT INTO public.profiles (id, username, full_name, avatar_url, onboarding_completed, role) VALUES ('1b2af1a5-fbfb-4c27-b36a-d307e89fb50a', 'ethanc', 'Ethan Cole', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', true, 'user') ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username, full_name = EXCLUDED.full_name, avatar_url = EXCLUDED.avatar_url;
INSERT INTO public.profiles (id, username, full_name, avatar_url, onboarding_completed, role) VALUES ('25ada38f-52e7-4c72-ba9d-16e97c01780d', 'oliviam', 'Olivia Martin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop', true, 'user') ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username, full_name = EXCLUDED.full_name, avatar_url = EXCLUDED.avatar_url;
INSERT INTO public.profiles (id, username, full_name, avatar_url, onboarding_completed, role) VALUES ('3180a2eb-bb4d-460f-821b-ea6431bc0928', 'ryanl', 'Ryan Lee', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', true, 'user') ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username, full_name = EXCLUDED.full_name, avatar_url = EXCLUDED.avatar_url;

-- 3. Insert Resources
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('b7cee47e-9368-4b06-8a98-8d1dac597b68', 'Minimal Responsive Navbar', 'UI/UX', 'Project', 'A premium quality implementation of Minimal Responsive Navbar. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Minimal Responsive Navbar\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Minimal Responsive Navbar</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Minimal Responsive Navbar

## Overview
This project provides a complete, polished solution for **Minimal Responsive Navbar**.

## License
MIT', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', '775e4c33-b789-4f30-854e-d286e5bfc349', 'Beginner', 'JavaScript', 'React', 'MIT', 1233, 542, 2255, 6424, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('852e8a6b-badc-40bd-a088-8e7bad37ad88', 'Modern SaaS Dashboard Sidebar', 'UI/UX', 'Project', 'A premium quality implementation of Modern SaaS Dashboard Sidebar. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Modern SaaS Dashboard Sidebar\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Modern SaaS Dashboard Sidebar</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Modern SaaS Dashboard Sidebar

## Overview
This project provides a complete, polished solution for **Modern SaaS Dashboard Sidebar**.

## License
MIT', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', '5954ce1b-c48c-4c51-995d-62b035d085fe', 'Advanced', 'JavaScript', 'React', 'MIT', 482, 551, 133, 7035, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('072cb64b-16b3-4ea9-a446-bbdae54d6036', 'Modern Authentication UI', 'Website Development', 'Project', 'A premium quality implementation of Modern Authentication UI. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Modern Authentication UI\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Modern Authentication UI</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Modern Authentication UI

## Overview
This project provides a complete, polished solution for **Modern Authentication UI**.

## License
MIT', 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=800&q=80', '18b03b54-36bd-4dcc-a43f-f4f55f9ef21b', 'Beginner', 'JavaScript', 'React', 'MIT', 1703, 915, 376, 2994, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('97cfb94f-c53a-462b-b7b8-ef5d73315c98', 'Minimal AI Chat Interface', 'AI/ML', 'Project', 'A premium quality implementation of Minimal AI Chat Interface. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Minimal AI Chat Interface\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Minimal AI Chat Interface</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Minimal AI Chat Interface

## Overview
This project provides a complete, polished solution for **Minimal AI Chat Interface**.

## License
MIT', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80', '775e4c33-b789-4f30-854e-d286e5bfc349', 'Advanced', 'JavaScript', 'React', 'MIT', 578, 976, 1546, 5355, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('170688ef-02c6-4e44-97be-bc5d5e308ebd', 'AI Prompt Enhancer', 'AI/ML', 'Project', 'A premium quality implementation of AI Prompt Enhancer. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// AI Prompt Enhancer\nimport React from ''react'';\n\nexport default function App() {\n  return <div>AI Prompt Enhancer</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# AI Prompt Enhancer

## Overview
This project provides a complete, polished solution for **AI Prompt Enhancer**.

## License
MIT', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80', '18b03b54-36bd-4dcc-a43f-f4f55f9ef21b', 'Beginner', 'JavaScript', 'React', 'MIT', 948, 205, 1079, 2511, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('4341ee95-0723-4956-a37c-2de2ec9fbc01', 'Premium SaaS Landing Page', 'Website Development', 'Project', 'A premium quality implementation of Premium SaaS Landing Page. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Premium SaaS Landing Page\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Premium SaaS Landing Page</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Premium SaaS Landing Page

## Overview
This project provides a complete, polished solution for **Premium SaaS Landing Page**.

## License
MIT', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', '18b03b54-36bd-4dcc-a43f-f4f55f9ef21b', 'Advanced', 'JavaScript', 'React', 'MIT', 297, 279, 628, 7792, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('6ff62357-d1fa-4d3e-a555-7b6fa32cd6e9', 'Interactive E-commerce Product Card', 'UI/UX', 'Project', 'A premium quality implementation of Interactive E-commerce Product Card. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Interactive E-commerce Product Card\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Interactive E-commerce Product Card</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Interactive E-commerce Product Card

## Overview
This project provides a complete, polished solution for **Interactive E-commerce Product Card**.

## License
MIT', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80', '39efa43b-6eb7-4069-8a1b-ca8de32ff2a1', 'Advanced', 'JavaScript', 'React', 'MIT', 633, 48, 2876, 4676, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('b1979e1e-0233-4162-af35-51fc1f860adf', 'Modern Mobile Bottom Navigation', 'Mobile Applications', 'Project', 'A premium quality implementation of Modern Mobile Bottom Navigation. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Modern Mobile Bottom Navigation\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Modern Mobile Bottom Navigation</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Modern Mobile Bottom Navigation

## Overview
This project provides a complete, polished solution for **Modern Mobile Bottom Navigation**.

## License
MIT', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80', '775e4c33-b789-4f30-854e-d286e5bfc349', 'Advanced', 'JavaScript', 'React', 'MIT', 1418, 522, 2573, 2822, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('ee383722-f6f4-4a67-a68d-7e6982ffb0fd', 'Premium Flutter Login Screen', 'Mobile Applications', 'Project', 'A premium quality implementation of Premium Flutter Login Screen. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Premium Flutter Login Screen\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Premium Flutter Login Screen</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Premium Flutter Login Screen

## Overview
This project provides a complete, polished solution for **Premium Flutter Login Screen**.

## License
MIT', 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=800&q=80', '05e83e4e-e9d7-451c-a4f9-4b2ce4c923e8', 'Beginner', 'JavaScript', 'React', 'MIT', 848, 925, 768, 3820, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('b01bcdc5-121a-4344-b3e8-62162c95229e', 'Python Data Analytics Dashboard', 'Data Science', 'Project', 'A premium quality implementation of Python Data Analytics Dashboard. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Python Data Analytics Dashboard\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Python Data Analytics Dashboard</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Python Data Analytics Dashboard

## Overview
This project provides a complete, polished solution for **Python Data Analytics Dashboard**.

## License
MIT', 'https://images.unsplash.com/photo-1543286386-2e659306cd6c?auto=format&fit=crop&w=800&q=80', '1b2af1a5-fbfb-4c27-b36a-d307e89fb50a', 'Intermediate', 'JavaScript', 'React', 'MIT', 514, 16, 2468, 5486, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('014b5956-039b-43f4-86e2-cc1d929f595e', 'AI Image Generation Prompts', 'AI/ML', 'Project', 'A premium quality implementation of AI Image Generation Prompts. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// AI Image Generation Prompts\nimport React from ''react'';\n\nexport default function App() {\n  return <div>AI Image Generation Prompts</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# AI Image Generation Prompts

## Overview
This project provides a complete, polished solution for **AI Image Generation Prompts**.

## License
MIT', 'https://images.unsplash.com/photo-1682687982501-1e5898cb8e4b?auto=format&fit=crop&w=800&q=80', '18b03b54-36bd-4dcc-a43f-f4f55f9ef21b', 'Beginner', 'JavaScript', 'React', 'MIT', 138, 638, 1741, 7458, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('dd3033d2-4106-402c-9940-80fe095b84d3', 'Tailwind UI Components', 'UI/UX', 'Project', 'A premium quality implementation of Tailwind UI Components. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Tailwind UI Components\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Tailwind UI Components</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Tailwind UI Components

## Overview
This project provides a complete, polished solution for **Tailwind UI Components**.

## License
MIT', 'https://images.unsplash.com/photo-1507238692062-58751aa51417?auto=format&fit=crop&w=800&q=80', '7340910e-9b3f-43bc-a2b1-fe2065ed60c7', 'Advanced', 'JavaScript', 'React', 'MIT', 439, 924, 2795, 8346, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('15704b3b-2739-42c2-b508-625b4d3a6e91', 'Production Ready REST API', 'Website Development', 'Project', 'A premium quality implementation of Production Ready REST API. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Production Ready REST API\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Production Ready REST API</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Production Ready REST API

## Overview
This project provides a complete, polished solution for **Production Ready REST API**.

## License
MIT', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80', 'b0c2ea9a-1a14-4409-b733-ab6d4d9aec84', 'Intermediate', 'JavaScript', 'React', 'MIT', 1128, 13, 1874, 2823, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('62a57bc0-31dd-454b-8d08-830d54042315', 'JWT Authentication System', 'Website Development', 'Project', 'A premium quality implementation of JWT Authentication System. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// JWT Authentication System\nimport React from ''react'';\n\nexport default function App() {\n  return <div>JWT Authentication System</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# JWT Authentication System

## Overview
This project provides a complete, polished solution for **JWT Authentication System**.

## License
MIT', 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80', 'b0c2ea9a-1a14-4409-b733-ab6d4d9aec84', 'Intermediate', 'JavaScript', 'React', 'MIT', 1746, 922, 1239, 9410, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('480f1609-2aa9-4877-ad95-1ff240824886', 'Modern Admin Panel', 'Website Development', 'Project', 'A premium quality implementation of Modern Admin Panel. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Modern Admin Panel\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Modern Admin Panel</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Modern Admin Panel

## Overview
This project provides a complete, polished solution for **Modern Admin Panel**.

## License
MIT', 'https://images.unsplash.com/photo-1551009175-8a68da93d5f9?auto=format&fit=crop&w=800&q=80', '18b03b54-36bd-4dcc-a43f-f4f55f9ef21b', 'Beginner', 'JavaScript', 'React', 'MIT', 145, 605, 704, 3985, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('6dddb170-8bb3-4825-a891-f2cc4b4d83d7', 'Cinematic Animated Hero', 'UI/UX', 'Project', 'A premium quality implementation of Cinematic Animated Hero. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Cinematic Animated Hero\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Cinematic Animated Hero</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Cinematic Animated Hero

## Overview
This project provides a complete, polished solution for **Cinematic Animated Hero**.

## License
MIT', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', '3180a2eb-bb4d-460f-821b-ea6431bc0928', 'Advanced', 'JavaScript', 'React', 'MIT', 1543, 382, 346, 3451, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('2ea14191-38e8-46ae-9bbc-5bb3948b37eb', 'Advanced File Upload UI', 'UI/UX', 'Project', 'A premium quality implementation of Advanced File Upload UI. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Advanced File Upload UI\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Advanced File Upload UI</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Advanced File Upload UI

## Overview
This project provides a complete, polished solution for **Advanced File Upload UI**.

## License
MIT', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80', '3180a2eb-bb4d-460f-821b-ea6431bc0928', 'Advanced', 'JavaScript', 'React', 'MIT', 1254, 489, 262, 7276, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('07418a39-33bf-4bce-83c8-4d531c234815', 'Developer Markdown Editor', 'Productivity', 'Project', 'A premium quality implementation of Developer Markdown Editor. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Developer Markdown Editor\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Developer Markdown Editor</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Developer Markdown Editor

## Overview
This project provides a complete, polished solution for **Developer Markdown Editor**.

## License
MIT', 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80', '1b2af1a5-fbfb-4c27-b36a-d307e89fb50a', 'Intermediate', 'JavaScript', 'React', 'MIT', 1500, 988, 3083, 935, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('aa56ebae-1fb2-4e49-bdb1-28c90e72ce8f', 'Python File Organizer script', 'Automation', 'Project', 'A premium quality implementation of Python File Organizer script. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Python File Organizer script\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Python File Organizer script</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Python File Organizer script

## Overview
This project provides a complete, polished solution for **Python File Organizer script**.

## License
MIT', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', 'b0c2ea9a-1a14-4409-b733-ab6d4d9aec84', 'Beginner', 'JavaScript', 'React', 'MIT', 455, 722, 1438, 1651, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('dfb601b5-79cd-48aa-b157-019aa85744fc', 'Python Web Scraper Tool', 'Automation', 'Project', 'A premium quality implementation of Python Web Scraper Tool. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Python Web Scraper Tool\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Python Web Scraper Tool</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Python Web Scraper Tool

## Overview
This project provides a complete, polished solution for **Python Web Scraper Tool**.

## License
MIT', 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=800&q=80', 'b0c2ea9a-1a14-4409-b733-ab6d4d9aec84', 'Beginner', 'JavaScript', 'React', 'MIT', 646, 236, 2256, 10127, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('f65d8952-169f-43d2-89c4-d8aa01787a61', 'Minimal React Design System', 'UI/UX', 'Project', 'A premium quality implementation of Minimal React Design System. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Minimal React Design System\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Minimal React Design System</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Minimal React Design System

## Overview
This project provides a complete, polished solution for **Minimal React Design System**.

## License
MIT', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80', '05e83e4e-e9d7-451c-a4f9-4b2ce4c923e8', 'Intermediate', 'JavaScript', 'React', 'MIT', 1134, 709, 136, 10336, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('96b6cf6f-09b5-42e0-b1f5-e53ae3b0751b', 'SaaS Database Schema Model', 'Data Science', 'Project', 'A premium quality implementation of SaaS Database Schema Model. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// SaaS Database Schema Model\nimport React from ''react'';\n\nexport default function App() {\n  return <div>SaaS Database Schema Model</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# SaaS Database Schema Model

## Overview
This project provides a complete, polished solution for **SaaS Database Schema Model**.

## License
MIT', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80', 'b0c2ea9a-1a14-4409-b733-ab6d4d9aec84', 'Intermediate', 'JavaScript', 'React', 'MIT', 1684, 676, 1174, 3371, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('cbaf9853-c0c6-457f-a0b4-53bb5072cd17', 'Full Stack Docker Env', 'Website Development', 'Project', 'A premium quality implementation of Full Stack Docker Env. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Full Stack Docker Env\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Full Stack Docker Env</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Full Stack Docker Env

## Overview
This project provides a complete, polished solution for **Full Stack Docker Env**.

## License
MIT', 'https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=800&q=80', '25ada38f-52e7-4c72-ba9d-16e97c01780d', 'Beginner', 'JavaScript', 'React', 'MIT', 594, 214, 1981, 7754, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('2d1950ff-bfd7-4a14-ae31-b861f1357ef7', 'Production CI/CD Actions', 'Automation', 'Project', 'A premium quality implementation of Production CI/CD Actions. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Production CI/CD Actions\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Production CI/CD Actions</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Production CI/CD Actions

## Overview
This project provides a complete, polished solution for **Production CI/CD Actions**.

## License
MIT', 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80', '7340910e-9b3f-43bc-a2b1-fe2065ed60c7', 'Beginner', 'JavaScript', 'React', 'MIT', 367, 227, 1189, 4620, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('f643ab90-fab1-4fad-b257-934daa83a4d5', 'Website AI Assistant Bot', 'AI/ML', 'Project', 'A premium quality implementation of Website AI Assistant Bot. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Website AI Assistant Bot\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Website AI Assistant Bot</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Website AI Assistant Bot

## Overview
This project provides a complete, polished solution for **Website AI Assistant Bot**.

## License
MIT', 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80', '775e4c33-b789-4f30-854e-d286e5bfc349', 'Intermediate', 'JavaScript', 'React', 'MIT', 558, 215, 263, 4966, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('0261b7f1-f68a-4c0c-b138-eb47476c4faf', 'Developer Portfolio Template', 'Website Development', 'Project', 'A premium quality implementation of Developer Portfolio Template. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Developer Portfolio Template\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Developer Portfolio Template</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Developer Portfolio Template

## Overview
This project provides a complete, polished solution for **Developer Portfolio Template**.

## License
MIT', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80', '5954ce1b-c48c-4c51-995d-62b035d085fe', 'Intermediate', 'JavaScript', 'React', 'MIT', 871, 88, 848, 7885, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('4cefeccf-61a1-4e91-85ec-44845b4f289d', 'UX Component Generation Prompts', 'UI/UX', 'Project', 'A premium quality implementation of UX Component Generation Prompts. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// UX Component Generation Prompts\nimport React from ''react'';\n\nexport default function App() {\n  return <div>UX Component Generation Prompts</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# UX Component Generation Prompts

## Overview
This project provides a complete, polished solution for **UX Component Generation Prompts**.

## License
MIT', 'https://images.unsplash.com/photo-1557821552-17105153ce9a?auto=format&fit=crop&w=800&q=80', '775e4c33-b789-4f30-854e-d286e5bfc349', 'Intermediate', 'JavaScript', 'React', 'MIT', 1509, 690, 1620, 1220, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('e15c6cac-2a48-4ed9-87db-49fc8cee2243', 'Mobile Finance App Design', 'Mobile Applications', 'Project', 'A premium quality implementation of Mobile Finance App Design. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Mobile Finance App Design\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Mobile Finance App Design</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Mobile Finance App Design

## Overview
This project provides a complete, polished solution for **Mobile Finance App Design**.

## License
MIT', 'https://images.unsplash.com/photo-1607799279861-4dddf8b60dd5?auto=format&fit=crop&w=800&q=80', '3180a2eb-bb4d-460f-821b-ea6431bc0928', 'Intermediate', 'JavaScript', 'React', 'MIT', 889, 100, 2744, 6770, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('a5a8262c-c27f-4dba-9cad-97c4ca79ac3a', 'AI Document Analyzer NLP', 'AI/ML', 'Project', 'A premium quality implementation of AI Document Analyzer NLP. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// AI Document Analyzer NLP\nimport React from ''react'';\n\nexport default function App() {\n  return <div>AI Document Analyzer NLP</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# AI Document Analyzer NLP

## Overview
This project provides a complete, polished solution for **AI Document Analyzer NLP**.

## License
MIT', 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80', '05e83e4e-e9d7-451c-a4f9-4b2ce4c923e8', 'Advanced', 'JavaScript', 'React', 'MIT', 826, 399, 1467, 1530, '["Modern","Responsive","Clean"]');
INSERT INTO public.resources (id, title, category, type, description, content, readme_content, preview_url, creator_id, difficulty, language, framework, license_type, likes_count, saves_count, downloads_count, views_count, tags) VALUES ('09a83e9a-46fa-4db9-abf9-ae5d9376aa0a', 'Full Stack Next.js SaaS', 'Website Development', 'Project', 'A premium quality implementation of Full Stack Next.js SaaS. Ready for production use with best practices, responsive design, beautiful micro-interactions, and clean code architecture.', '{"files":[{"filename":"App.jsx","extension":".jsx","language":"JavaScript","content":"// Full Stack Next.js SaaS\nimport React from ''react'';\n\nexport default function App() {\n  return <div>Full Stack Next.js SaaS</div>;\n}\n"},{"filename":"package.json","extension":".json","language":"JSON","content":"{\"name\":\"project\"}"}]}', '# Full Stack Next.js SaaS

## Overview
This project provides a complete, polished solution for **Full Stack Next.js SaaS**.

## License
MIT', 'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?auto=format&fit=crop&w=800&q=80', '18b03b54-36bd-4dcc-a43f-f4f55f9ef21b', 'Beginner', 'JavaScript', 'React', 'MIT', 1004, 709, 2885, 2702, '["Modern","Responsive","Clean"]');
