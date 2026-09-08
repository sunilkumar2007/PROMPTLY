-- Add 3 New Prompt Resources

DO $$ 
DECLARE
  v_user_id UUID;
  v_prompt_1_id UUID := gen_random_uuid();
  v_prompt_2_id UUID := gen_random_uuid();
  v_prompt_3_id UUID := gen_random_uuid();
BEGIN
  -- Get any user to be the creator
  SELECT id INTO v_user_id FROM public.profiles LIMIT 1;
  
  IF v_user_id IS NULL THEN
    RAISE NOTICE 'No profiles found to assign as creator';
    RETURN;
  END IF;

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
    v_prompt_1_id,
    'Melancholic Street Portrait',
    'A detailed prompt for generating a realistic, documentary-style portrait of a young woman standing in a bustling city street with a somber atmosphere.',
    'Prompt',
    'AI/ML',
    ARRAY['Midjourney', 'Portrait', 'Documentary', 'StreetPhotography', 'Realistic'],
    'English',
    'Midjourney v6',
    'Beginner',
    'Public Domain',
    '/previews/prompt1.jpg',
    'create this image to a young Asian woman, possibly in her early twenties, stands in the center of the frame, looking directly at the viewer with a somber expression. Her long, dark hair frames her face. She''s wearing a dark-colored, oversized sweater. The background features a blurry, bustling crowd of people in motion, suggesting a public space like a city street or plaza. The individuals in the background are blurred to emphasize the woman as the focal point. The setting appears to be outdoors, possibly on a cloudy day, as suggested by the muted color palette. The ground is paved with gray square tiles. The composition is a top-down perspective, giving a slightly elevated view. The lighting is diffused, with soft shadows, lending a slightly melancholic or introspective atmosphere. The overall style is realistic with a documentary feel.',
    '# Melancholic Street Portrait

This prompt is highly optimized for Midjourney v6 and Stable Diffusion SDXL to produce hyper-realistic, documentary-style photography.

## Tips for best results
- Use `--ar 2:3` in Midjourney for portrait orientation.
- Use `--style raw` to prevent the AI from adding overly cinematic lighting.
- The top-down perspective is key for this composition; if the model ignores it, try adding weights like `(top-down perspective:1.5)`.',
    v_user_id,
    892,
    412,
    115,
    3092,
    4.8,
    45
  ),
  (
    v_prompt_2_id,
    'Ultimate 4K Upscaler Prompt',
    'The absolute best prompt for Magnific AI, Topaz, or Stable Diffusion upscaling pipelines to retain 100% facial fidelity while adding photorealistic details.',
    'Prompt',
    'AI/ML',
    ARRAY['Upscaling', 'Magnific', 'Enhancement', 'Photorealism', 'Details'],
    'English',
    'Magnific AI',
    'Advanced',
    'Public Domain',
    '/previews/prompt2.jpg',
    'Ultra-high-resolution 4K upscaling based on a given reference image. Absolute fidelity to the original facial anatomy, proportions, and identity. Maintain expression, gaze, pose, camera angle, framing, and perspective without distortion. Clothing, hair, skin, and background elements must remain unchanged in structure, placement, and design. Restore fine details with natural realism. Enhance pores, fine lines, hair strands, eyelashes, fabric weaves, seams, and material edges without adding stylization. Maintain the original color science, white balance, and tonal relationships exactly as captured. Lighting direction, intensity, contrast, and shadow behavior must match the source image exactly, only with increased clarity and expanded dynamic range. No relighting, no reshaping. Remove noise. Apply controlled sharpening and reconstruct high-frequency details. Eliminate compression artifacts and noise while maintaining authentic textures. No smoothing, no plastic skin, no artificial shine. Facial features must remain consistent throughout the image with coherent anatomy and clean, stable edges. Negative constraints: no distortion, no facial shifts, no addition or subtraction of anatomy, no changes to hands, no shape changes, no perspective shifts, no text or graphics, no hallucinated details, no stylized rendering. The final result should look like a photorealistic scale-up that matches the reference exactly, only clearer, sharper, and higher resolution.',
    '# Ultimate 4K Upscaler Prompt

This is the holy grail prompt for image upscaling when absolute fidelity to the source is required. It heavily instructs the AI to avoid hallucinating new features or stylizing the image.

## Usage
Paste this into the prompt box of your upscaler (like Magnific AI, or a Stable Diffusion ControlNet Tile workflow). 

## Negative Prompts
The prompt already contains negative constraints, but you can also use these in the Negative Prompt box:
`distortion, facial shifts, addition or subtraction of anatomy, changes to hands, shape changes, perspective shifts, text, graphics, hallucinated details, stylized rendering, smoothing, plastic skin, artificial shine`',
    v_user_id,
    4102,
    3205,
    1402,
    18209,
    4.9,
    342
  ),
  (
    v_prompt_3_id,
    'Historical Photo Restoration',
    'A comprehensive prompt for restoring old, damaged, or faded black-and-white photographs to their original glory with period-accurate techniques.',
    'Prompt',
    'AI/ML',
    ARRAY['Restoration', 'History', 'Colorization', 'Repair', 'Photoshop'],
    'English',
    'Generative Fill',
    'Intermediate',
    'Public Domain',
    '/previews/prompt3.jpg',
    'Restore this photo with period-accurate techniques, addressing any age-related issues it may have, such as blurring, damage, fading, scratches, tears, folds, worn-out areas, or being in black and white. First, analyze the image to identify the approximate era and original photographic process to ensure a historically accurate restoration. Make it look fresh and clear by gently sharpening soft edges and facial features without overdoing it, smoothing out grainy spots or noise if present, and reconstructing missing parts with realistic textures that match the original. If colors are faded or absent, bring them back naturally and vibrantly but true to the era''s photographic technology without looking artificial; balance colors to match natural lighting, adjust brightness and contrast so everything pops nicely, and maintain original tonality. Add subtle details to faces, objects, or backgrounds that might have been lost, like fine lines in clothing, lifelike skin textures, or small elements in the scenery, while keeping the overall feel authentic, preserving natural grain patterns, and not changing the composition. Ensure the whole image is balanced, with no harsh shadows or washed-out areas, remove technical defects while respecting the nostalgic charm and exposure qualities of the time. Finally, upscale it to a higher resolution like Full HD 32k for better clarity, outputting in a photo-realistic style that looks like a professionally restored or recent high-quality photo.',
    '# Historical Photo Restoration

This prompt is designed to instruct AI models to carefully restore old photographs without turning them into modern, artificial-looking renders. 

## Best Practices
- **Do not overdo it**: If the model is making the skin look like plastic, reduce the denoise strength (in Stable Diffusion) or lower the HDR setting (in Magnific).
- **Colorization**: The prompt explicitly asks to bring back colors naturally and vibrantly but true to the era''s photographic technology. This prevents the neon/oversaturated look common in basic AI colorizers.',
    v_user_id,
    1204,
    842,
    301,
    4521,
    4.7,
    89
  );
  
END $$;
