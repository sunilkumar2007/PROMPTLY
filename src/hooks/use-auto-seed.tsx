import React, { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAutoSeed() {
  useEffect(() => {
    const seedData = async () => {
      if (localStorage.getItem("auto_seeded_v1")) return;

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("Auto-Seed Failed: You must be logged in to post resources!");
        return;
      }

      const user = sessionData.session.user;

      try {
        // 1. Update Profile to sunilkumar
        await supabase
          .from("profiles")
          .update({
            username: "sunilkumar",
            full_name: "Sunil Kumar",
          })
          .eq("id", user.id);

        // 2. Insert all 5 posts
        const posts: any[] = [
          {
            title: "Day & Night Mode Toggle Bar",
            description:
              "A polished responsive navigation bar that allows users to switch between Light Mode and Dark Mode with a smooth animated transition. Features localStorage persistence and accessibility support.",
            type: "Component",
            category: "UI/UX",
            tags: ["DarkMode", "LightMode", "Navbar", "Toggle", "UI", "Frontend"],
            language: "TypeScript",
            framework: "React",
            difficulty: "Intermediate",
            license_type: "MIT",
            preview_url: "/previews/day-night-toggle.jpg",
            creator_id: user.id,
            content: JSON.stringify({
              files: [
                {
                  filename: "ThemeNavbar.tsx",
                  extension: ".tsx",
                  language: "typescript",
                  content:
                    'import React, { useState, useEffect } from \'react\';\nimport { ThemeToggle } from \'./ThemeToggle\';\nimport { Menu, X } from \'lucide-react\';\n\nexport function ThemeNavbar() {\n  const [isOpen, setIsOpen] = useState(false);\n  const [scrolled, setScrolled] = useState(false);\n\n  useEffect(() => {\n    const handleScroll = () => setScrolled(window.scrollY > 20);\n    window.addEventListener(\'scroll\', handleScroll);\n    return () => window.removeEventListener(\'scroll\', handleScroll);\n  }, []);\n\n  const navLinks = [\'Home\', \'Features\', \'Pricing\', \'About\'];\n\n  return (\n    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${\n      scrolled \n        ? \'bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/5 dark:border-white/10\' \n        : \'bg-transparent\'\n    }`}>\n      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">\n        <div className="flex items-center gap-2">\n          <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">\n            <span className="text-white dark:text-black font-black text-xl leading-none">A</span>\n          </div>\n          <span className="font-bold text-xl tracking-tight text-black dark:text-white">Aurora</span>\n        </div>\n\n        {/* Desktop Nav */}\n        <div className="hidden md:flex items-center gap-8">\n          <div className="flex items-center gap-6">\n            {navLinks.map(link => (\n              <a key={link} href={`#${link.toLowerCase()}`} className="text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">\n                {link}\n              </a>\n            ))}\n          </div>\n          <div className="w-px h-6 bg-black/10 dark:bg-white/10" />\n          <ThemeToggle />\n          <button className="h-10 px-6 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-bold hover:scale-105 active:scale-95 transition-all">\n            Get Started\n          </button>\n        </div>\n\n        {/* Mobile Toggle */}\n        <div className="flex items-center gap-4 md:hidden">\n          <ThemeToggle />\n          <button onClick={() => setIsOpen(!isOpen)} className="text-black dark:text-white">\n            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}\n          </button>\n        </div>\n      </div>\n\n      {/* Mobile Menu */}\n      {isOpen && (\n        <div className="absolute top-20 left-0 w-full bg-white dark:bg-black border-b border-black/5 dark:border-white/10 p-6 flex flex-col gap-4 md:hidden shadow-2xl">\n          {navLinks.map(link => (\n            <a key={link} href={`#${link.toLowerCase()}`} className="text-lg font-medium text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white">\n              {link}\n            </a>\n          ))}\n          <button className="h-12 w-full mt-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold">\n            Get Started\n          </button>\n        </div>\n      )}\n    </nav>\n  );\n}',
                },
                {
                  filename: "ThemeToggle.tsx",
                  extension: ".tsx",
                  language: "typescript",
                  content:
                    "import React, { useEffect, useState } from 'react';\nimport { Sun, Moon } from 'lucide-react';\n\nexport function ThemeToggle() {\n  const [theme, setTheme] = useState<'light' | 'dark'>('light');\n\n  useEffect(() => {\n    const saved = localStorage.getItem('theme');\n    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;\n    \n    if (saved === 'dark' || (!saved && prefersDark)) {\n      setTheme('dark');\n      document.documentElement.classList.add('dark');\n    } else {\n      setTheme('light');\n      document.documentElement.classList.remove('dark');\n    }\n  }, []);\n\n  const toggleTheme = () => {\n    const newTheme = theme === 'light' ? 'dark' : 'light';\n    setTheme(newTheme);\n    localStorage.setItem('theme', newTheme);\n    \n    if (newTheme === 'dark') {\n      document.documentElement.classList.add('dark');\n    } else {\n      document.documentElement.classList.remove('dark');\n    }\n  };\n\n  return (\n    <button\n      onClick={toggleTheme}\n      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}\n      className=\"relative w-16 h-8 rounded-full p-1 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 flex items-center\"\n    >\n      <div \n        className={`absolute h-6 w-6 rounded-full bg-white shadow-md border border-black/5 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${\n          theme === 'dark' ? 'translate-x-8 bg-black border-white/20' : 'translate-x-0'\n        }`}\n      >\n        {theme === 'light' ? (\n          <Sun className=\"w-3.5 h-3.5 text-black\" />\n        ) : (\n          <Moon className=\"w-3.5 h-3.5 text-white\" />\n        )}\n      </div>\n    </button>\n  );\n}",
                },
              ],
            }),
            readme_content:
              '# Day & Night Mode Toggle Bar\n\nA beautiful, production-ready navigation bar component featuring a sleek sun/moon toggle switch.\n\n## Features\n- **Smooth Animations**: Uses spring physics to transition the sun and moon icons.\n- **Persistence**: Remembers user preference via `localStorage`.\n- **System Preference**: Automatically detects `prefers-color-scheme`.\n- **Responsive**: Fully responsive mobile menu using Tailwind CSS.\n- **Accessible**: Built with proper aria-labels and focus rings.\n\n## Installation\nEnsure you have `lucide-react` installed for the icons:\n```bash\nnpm install lucide-react\n```\n\nAlso, ensure your `tailwind.config.js` has `darkMode: \"class\"` enabled:\n```javascript\nmodule.exports = {\n  darkMode: \"class\",\n  // ...\n}\n```',
            likes_count: 1432,
            saves_count: 892,
            downloads_count: 342,
            views_count: 18290,
            average_rating: 4.9,
            ratings_count: 128,
          },
          {
            title: "Melancholic Street Portrait",
            description:
              "A detailed prompt for generating a realistic, documentary-style portrait of a young woman standing in a bustling city street with a somber atmosphere.",
            type: "Prompt",
            category: "AI/ML",
            tags: ["Midjourney", "Portrait", "Documentary", "StreetPhotography", "Realistic"],
            language: "English",
            framework: "Midjourney v6",
            difficulty: "Beginner",
            license_type: "Public Domain",
            preview_url: "/previews/prompt1.jpg",
            creator_id: user.id,
            content:
              "create this image to a young Asian woman, possibly in her early twenties, stands in the center of the frame, looking directly at the viewer with a somber expression. Her long, dark hair frames her face. She's wearing a dark-colored, oversized sweater. The background features a blurry, bustling crowd of people in motion, suggesting a public space like a city street or plaza. The individuals in the background are blurred to emphasize the woman as the focal point. The setting appears to be outdoors, possibly on a cloudy day, as suggested by the muted color palette. The ground is paved with gray square tiles. The composition is a top-down perspective, giving a slightly elevated view. The lighting is diffused, with soft shadows, lending a slightly melancholic or introspective atmosphere. The overall style is realistic with a documentary feel.",
            readme_content:
              "# Melancholic Street Portrait\n\nThis prompt is highly optimized for Midjourney v6 and Stable Diffusion SDXL to produce hyper-realistic, documentary-style photography.\n\n## Tips for best results\n- Use `--ar 2:3` in Midjourney for portrait orientation.\n- Use `--style raw` to prevent the AI from adding overly cinematic lighting.\n- The top-down perspective is key for this composition; if the model ignores it, try adding weights like `(top-down perspective:1.5)`.",
            likes_count: 892,
            saves_count: 412,
            downloads_count: 115,
            views_count: 3092,
            average_rating: 4.8,
            ratings_count: 45,
          },
          {
            title: "Ultimate 4K Upscaler Prompt",
            description:
              "The absolute best prompt for Magnific AI, Topaz, or Stable Diffusion upscaling pipelines to retain 100% facial fidelity while adding photorealistic details.",
            type: "Prompt",
            category: "AI/ML",
            tags: ["Upscaling", "Magnific", "Enhancement", "Photorealism", "Details"],
            language: "English",
            framework: "Magnific AI",
            difficulty: "Advanced",
            license_type: "Public Domain",
            preview_url: "/previews/prompt2.jpg",
            creator_id: user.id,
            content:
              "Ultra-high-resolution 4K upscaling based on a given reference image. Absolute fidelity to the original facial anatomy, proportions, and identity. Maintain expression, gaze, pose, camera angle, framing, and perspective without distortion. Clothing, hair, skin, and background elements must remain unchanged in structure, placement, and design. Restore fine details with natural realism. Enhance pores, fine lines, hair strands, eyelashes, fabric weaves, seams, and material edges without adding stylization. Maintain the original color science, white balance, and tonal relationships exactly as captured. Lighting direction, intensity, contrast, and shadow behavior must match the source image exactly, only with increased clarity and expanded dynamic range. No relighting, no reshaping. Remove noise. Apply controlled sharpening and reconstruct high-frequency details. Eliminate compression artifacts and noise while maintaining authentic textures. No smoothing, no plastic skin, no artificial shine. Facial features must remain consistent throughout the image with coherent anatomy and clean, stable edges. Negative constraints: no distortion, no facial shifts, no addition or subtraction of anatomy, no changes to hands, no shape changes, no perspective shifts, no text or graphics, no hallucinated details, no stylized rendering. The final result should look like a photorealistic scale-up that matches the reference exactly, only clearer, sharper, and higher resolution.",
            readme_content:
              "# Ultimate 4K Upscaler Prompt\n\nThis is the holy grail prompt for image upscaling when absolute fidelity to the source is required. It heavily instructs the AI to avoid hallucinating new features or stylizing the image.\n\n## Usage\nPaste this into the prompt box of your upscaler (like Magnific AI, or a Stable Diffusion ControlNet Tile workflow). \n\n## Negative Prompts\nThe prompt already contains negative constraints, but you can also use these in the Negative Prompt box:\n`distortion, facial shifts, addition or subtraction of anatomy, changes to hands, shape changes, perspective shifts, text, graphics, hallucinated details, stylized rendering, smoothing, plastic skin, artificial shine`",
            likes_count: 4102,
            saves_count: 3205,
            downloads_count: 1402,
            views_count: 18209,
            average_rating: 4.9,
            ratings_count: 342,
          },
          {
            title: "Historical Photo Restoration",
            description:
              "A comprehensive prompt for restoring old, damaged, or faded black-and-white photographs to their original glory with period-accurate techniques.",
            type: "Prompt",
            category: "AI/ML",
            tags: ["Restoration", "History", "Colorization", "Repair", "Photoshop"],
            language: "English",
            framework: "Generative Fill",
            difficulty: "Intermediate",
            license_type: "Public Domain",
            preview_url: "/previews/prompt3.jpg",
            creator_id: user.id,
            content: `Restore this photo with period-accurate techniques, addressing any age-related issues it may have, such as blurring, damage, fading, scratches, tears, folds, worn-out areas, or being in black and white. First, analyze the image to identify the approximate era and original photographic process to ensure a historically accurate restoration. Make it look fresh and clear by gently sharpening soft edges and facial features without overdoing it, smoothing out grainy spots or noise if present, and reconstructing missing parts with realistic textures that match the original. If colors are faded or absent, bring them back naturally and vibrantly but true to the era's photographic technology without looking artificial; balance colors to match natural lighting, adjust brightness and contrast so everything pops nicely, and maintain original tonality. Add subtle details to faces, objects, or backgrounds that might have been lost, like fine lines in clothing, lifelike skin textures, or small elements in the scenery, while keeping the overall feel authentic, preserving natural grain patterns, and not changing the composition. Ensure the whole image is balanced, with no harsh shadows or washed-out areas, remove technical defects while respecting the nostalgic charm and exposure qualities of the time. Finally, upscale it to a higher resolution like Full HD 32k for better clarity, outputting in a photo-realistic style that looks like a professionally restored or recent high-quality photo.`,
            readme_content: `# Historical Photo Restoration\n\nThis prompt is designed to instruct AI models to carefully restore old photographs without turning them into modern, artificial-looking renders. \n\n## Best Practices\n- **Do not overdo it**: If the model is making the skin look like plastic, reduce the denoise strength (in Stable Diffusion) or lower the HDR setting (in Magnific).\n- **Colorization**: The prompt explicitly asks to bring back colors naturally and vibrantly but true to the era's photographic technology. This prevents the neon/oversaturated look common in basic AI colorizers.`,
            likes_count: 1204,
            saves_count: 842,
            downloads_count: 301,
            views_count: 4521,
            average_rating: 4.7,
            ratings_count: 89,
          },
          {
            title: "Benefit Bridge - Government Schemes Portal",
            description:
              "A comprehensive digital initiative for a better India. Benefit Bridge helps you discover, understand, and apply for government schemes easily. Features include scheme matching, NGO portal, and multi-language support.",
            type: "Project",
            category: "Website Development",
            tags: ["Government", "Schemes", "NGO", "Capacitor", "Vercel", "India"],
            language: "TypeScript",
            framework: "React / Capacitor",
            difficulty: "Advanced",
            license_type: "MIT",
            preview_url: "/previews/benefit-1.png",
            creator_id: user.id,
            content: JSON.stringify({
              files: [
                {
                  filename: "build_apk.bat",
                  extension: ".bat",
                  language: "bat",
                  content: `@echo off\nsetlocal EnableDelayedExpansion\n\nset "ROOT=%~dp0"\nset "ANDROID_DIR=%ROOT%android"\n\nif not exist "%ANDROID_DIR%\\gradlew.bat" (\n  echo Android project not found in "%ANDROID_DIR%".\n  exit /b 1\n)\n\nif not defined JAVA_HOME (\n  for %%D in (\n    "C:\\Program Files\\Android\\Android Studio\\jbr"\n    "C:\\Program Files\\Android\\Android Studio\\jre"\n    "C:\\Program Files\\Java\\jdk-17"\n    "C:\\Program Files\\Java\\jdk-17.0.2"\n    "C:\\Program Files\\Java\\jdk-17.0.8"\n    "C:\\Program Files\\Eclipse Adoptium\\jdk-17*"\n    "C:\\Program Files\\Microsoft\\jdk-*"\n    "C:\\Program Files\\Zulu\\zulu-17*"\n  ) do (\n    for /d %%J in (%%~D) do (\n      if exist "%%~fJ\\bin\\java.exe" (\n        set "JAVA_HOME=%%~fJ"\n        goto :java_found\n      )\n    )\n  )\n)\n\nif not defined JAVA_HOME (\n  call :scan_java_root "C:\\Program Files"\n  if not defined JAVA_HOME call :scan_java_root "C:\\Program Files (x86)"\n  if not defined JAVA_HOME call :scan_java_root "%LOCALAPPDATA%"\n  if not defined JAVA_HOME call :scan_java_root "%USERPROFILE%"\n)\n\n:java_found\nif not defined JAVA_HOME (\n  echo JAVA_HOME could not be detected automatically.\n  echo Install JDK 17 or set JAVA_HOME before running this script.\n  exit /b 1\n)\n\necho Using JAVA_HOME=%JAVA_HOME%\nset "PATH=%JAVA_HOME%\\bin;%PATH%"\n\nif not defined ANDROID_SDK_ROOT (\n  for %%D in (\n    "%LOCALAPPDATA%\\Android\\Sdk"\n    "%USERPROFILE%\\AppData\\Local\\Android\\Sdk"\n    "C:\\Android\\Sdk"\n  ) do (\n    if exist "%%~D\\platform-tools" (\n      set "ANDROID_SDK_ROOT=%%~D"\n      goto :sdk_found\n    )\n  )\n)\n\nif not defined ANDROID_SDK_ROOT (\n  call :scan_sdk_root "%LOCALAPPDATA%"\n  if not defined ANDROID_SDK_ROOT call :scan_sdk_root "%USERPROFILE%"\n  if not defined ANDROID_SDK_ROOT call :scan_sdk_root "C:\\Program Files"\n  if not defined ANDROID_SDK_ROOT call :scan_sdk_root "C:\\Program Files (x86)"\n)\n\n:sdk_found\nif not defined ANDROID_SDK_ROOT (\n  echo ANDROID_SDK_ROOT could not be detected automatically.\n  echo Install Android SDK / Android Studio or set ANDROID_SDK_ROOT before running this script.\n  exit /b 1\n)\n\nset "ANDROID_HOME=%ANDROID_SDK_ROOT%"\necho Using ANDROID_SDK_ROOT=%ANDROID_SDK_ROOT%\n\n> "%ANDROID_DIR%\\local.properties" echo sdk.dir=%ANDROID_SDK_ROOT:\\=\\\\\\%\n\npushd "%ANDROID_DIR%"\ncall gradlew.bat assembleDebug\nset "GRADLE_EXIT=%ERRORLEVEL%"\npopd\n\nif not "%GRADLE_EXIT%"=="0" (\n  echo Gradle build failed with exit code %GRADLE_EXIT%.\n  exit /b %GRADLE_EXIT%\n)\n\nset "APK_PATH=%ANDROID_DIR%\\app\\build\\outputs\\apk\\debug\\app-debug.apk"\nif exist "%APK_PATH%" (\n  echo APK built successfully:\n  echo %APK_PATH%\n  exit /b 0\n)\n\necho Build finished but APK file was not found.\nexit /b 1\n\n:scan_java_root\nset "SCAN_ROOT=%~1"\nif not exist "%SCAN_ROOT%" exit /b 0\nfor /r "%SCAN_ROOT%" %%F in (java.exe) do (\n  if exist "%%~fF" (\n    for %%H in ("%%~dpF..") do set "JAVA_HOME=%%~fH"\n    exit /b 0\n  )\n)\nexit /b 0\n\n:scan_sdk_root\nset "SCAN_ROOT=%~1"\nif not exist "%SCAN_ROOT%" exit /b 0\nfor /r "%SCAN_ROOT%" %%F in (adb.exe) do (\n  if exist "%%~fF" (\n    for %%S in ("%%~dpF..") do set "ANDROID_SDK_ROOT=%%~fS"\n    exit /b 0\n  )\n)\nexit /b 0`,
                },
                {
                  filename: "capacitor.config.json",
                  extension: ".json",
                  language: "json",
                  content: `{\n  "appId": "com.benefitbridge.app",\n  "appName": "Benefit Bridge",\n  "webDir": "dist",\n  "bundledWebRuntime": false,\n  "android": {\n    "allowMixedContent": true,\n    "captureInput": true,\n    "webContentsDebuggingEnabled": false\n  },\n  "plugins": {\n    "SplashScreen": {\n      "launchShowDuration": 500,\n      "launchAutoHide": true,\n      "backgroundColor": "#0d2b55",\n      "androidSplashResourceName": "splash",\n      "showSpinner": false,\n      "androidScaleType": "CENTER_CROP"\n    },\n    "StatusBar": {\n      "style": "Dark",\n      "backgroundColor": "#0d2b55",\n      "overlaysWebView": false\n    },\n    "Keyboard": {\n      "resize": "body",\n      "style": "dark",\n      "resizeOnFullScreen": true\n    }\n  },\n  "server": {\n    "androidScheme": "https",\n    "cleartext": false\n  }\n}`,
                },
              ],
            }),
            readme_content: `# Benefit Bridge\n\nA Digital Initiative for a Better India. Benefit Bridge helps you discover, understand, and apply for government schemes easily. Empowering citizens. Bridging opportunities.\n\n![Screenshot 1](/previews/benefit-1.png)\n\n## Links\n- **Live Demo**: [https://benifit-bridge-one.vercel.app/](https://benifit-bridge-one.vercel.app/)\n- **GitHub Source**: [https://github.com/sunilkumar2007/benifit-bridge.git](https://github.com/sunilkumar2007/benifit-bridge.git)\n\n## Features\n\n1. **Government Schemes Directory**\n   Explore over 112 available schemes including Employment (MGNREGA), Agriculture (Soil Health Card), and Business (PM Mudra Loan).\n\n   ![Directory](/previews/benefit-2.png)\n\n2. **NGO Portal**\n   Applying for government schemes can be complicated. Connect with verified local NGOs who will guide you through the process, help you gather documents, and file applications on your behalf—completely free of charge.\n\n   ![NGO Portal](/previews/benefit-3.png)\n\n## Tech Stack\n- Capacitor for Android cross-platform packaging\n- React + TypeScript frontend\n- Hosted on Vercel`,
            likes_count: 512,
            saves_count: 213,
            downloads_count: 85,
            views_count: 4501,
            average_rating: 4.9,
            ratings_count: 73,
          },
        ];

        const { error: insertError } = await supabase.from("resources").insert(posts);

        if (insertError) {
          console.error("Auto seed insert failed:", insertError);
          toast.error(`Auto-Seed Insert Failed: ${insertError.message}`);
          return;
        }

        localStorage.setItem("auto_seeded_v1", "true");
        toast.success("Successfully posted 5 new resources automatically!");
      } catch (e: any) {
        toast.error(`Auto-Seed Error: ${e.message}`);
        console.error("Auto seed failed:", e);
      }
    };

    seedData();
  }, []);
}
