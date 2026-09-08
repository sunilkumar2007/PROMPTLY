-- Update some resources with readme_content and tech info using subqueries
UPDATE public.resources 
SET 
  readme_content = '# Elegant Navigation System\n\nA production-ready, fully responsive navigation component built with React and Framer Motion.\n\n## Features\n- Floating pill design\n- Backdrop blur effects\n- Dynamic active states\n- Mobile-optimized drawer',
  language = 'TypeScript',
  framework = 'React',
  difficulty = 'Intermediate',
  license_type = 'MIT'
WHERE id IN (SELECT id FROM public.resources WHERE type IN ('Component', 'UI/UX') LIMIT 5);

UPDATE public.resources 
SET 
  readme_content = '# Advanced AI Prompt Pack\n\nA curated collection of prompts designed for high-fidelity technical writing and code generation.\n\n## Usage\nCopy the prompt and paste it into GPT-4 or Claude 3.5 Sonnet for best results.',
  language = 'Natural Language',
  framework = 'GPT-4 / Claude 3',
  difficulty = 'Beginner',
  license_type = 'Creative Commons'
WHERE id IN (SELECT id FROM public.resources WHERE type = 'Prompt' LIMIT 5);

-- Update creator bios
UPDATE public.profiles
SET bio = 'Passionate UI Architect and Design Systems enthusiast. Building the future of the web one pixel at a time.'
WHERE id IN (SELECT creator_id FROM public.resources LIMIT 3);
