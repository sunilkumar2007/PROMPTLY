import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Navigation } from "@/components/landing/navigation";

export const Route = createFileRoute("/seed")({
  component: SeedPage,
});

function SeedPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    if (!user) {
      toast.error("You must be logged in to seed data!");
      return;
    }
    setLoading(true);

    try {
      // First, update the user profile to username 'sunilkumar'
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          username: 'sunilkumar', 
          full_name: 'Sunil Kumar'
        })
        .eq('id', user.id);
        
      if (profileError) {
        console.warn("Could not update profile username. It might be taken or RLS prevented it.", profileError);
      }

      const post: any = {
        title: 'Benefit Bridge - Government Schemes Portal',
        description: 'A comprehensive digital initiative for a better India. Benefit Bridge helps you discover, understand, and apply for government schemes easily. Features include scheme matching, NGO portal, and multi-language support.',
        type: 'Project',
        category: 'Website Development',
        tags: ['Government', 'Schemes', 'NGO', 'Capacitor', 'Vercel', 'India'],
        language: 'TypeScript',
        framework: 'React / Capacitor',
        difficulty: 'Advanced',
        license_type: 'MIT',
        preview_url: '/previews/benefit-1.png',
        creator_id: user.id,
        content: JSON.stringify({
          files: [
            {
              filename: "build_apk.bat",
              extension: ".bat",
              language: "bat",
              content: `@echo off\nsetlocal EnableDelayedExpansion\n\nset "ROOT=%~dp0"\nset "ANDROID_DIR=%ROOT%android"\n\nif not exist "%ANDROID_DIR%\\gradlew.bat" (\n  echo Android project not found in "%ANDROID_DIR%".\n  exit /b 1\n)\n\nif not defined JAVA_HOME (\n  for %%D in (\n    "C:\\Program Files\\Android\\Android Studio\\jbr"\n    "C:\\Program Files\\Android\\Android Studio\\jre"\n    "C:\\Program Files\\Java\\jdk-17"\n    "C:\\Program Files\\Java\\jdk-17.0.2"\n    "C:\\Program Files\\Java\\jdk-17.0.8"\n    "C:\\Program Files\\Eclipse Adoptium\\jdk-17*"\n    "C:\\Program Files\\Microsoft\\jdk-*"\n    "C:\\Program Files\\Zulu\\zulu-17*"\n  ) do (\n    for /d %%J in (%%~D) do (\n      if exist "%%~fJ\\bin\\java.exe" (\n        set "JAVA_HOME=%%~fJ"\n        goto :java_found\n      )\n    )\n  )\n)\n\nif not defined JAVA_HOME (\n  call :scan_java_root "C:\\Program Files"\n  if not defined JAVA_HOME call :scan_java_root "C:\\Program Files (x86)"\n  if not defined JAVA_HOME call :scan_java_root "%LOCALAPPDATA%"\n  if not defined JAVA_HOME call :scan_java_root "%USERPROFILE%"\n)\n\n:java_found\nif not defined JAVA_HOME (\n  echo JAVA_HOME could not be detected automatically.\n  echo Install JDK 17 or set JAVA_HOME before running this script.\n  exit /b 1\n)\n\necho Using JAVA_HOME=%JAVA_HOME%\nset "PATH=%JAVA_HOME%\\bin;%PATH%"\n\nif not defined ANDROID_SDK_ROOT (\n  for %%D in (\n    "%LOCALAPPDATA%\\Android\\Sdk"\n    "%USERPROFILE%\\AppData\\Local\\Android\\Sdk"\n    "C:\\Android\\Sdk"\n  ) do (\n    if exist "%%~D\\platform-tools" (\n      set "ANDROID_SDK_ROOT=%%~D"\n      goto :sdk_found\n    )\n  )\n)\n\nif not defined ANDROID_SDK_ROOT (\n  call :scan_sdk_root "%LOCALAPPDATA%"\n  if not defined ANDROID_SDK_ROOT call :scan_sdk_root "%USERPROFILE%"\n  if not defined ANDROID_SDK_ROOT call :scan_sdk_root "C:\\Program Files"\n  if not defined ANDROID_SDK_ROOT call :scan_sdk_root "C:\\Program Files (x86)"\n)\n\n:sdk_found\nif not defined ANDROID_SDK_ROOT (\n  echo ANDROID_SDK_ROOT could not be detected automatically.\n  echo Install Android SDK / Android Studio or set ANDROID_SDK_ROOT before running this script.\n  exit /b 1\n)\n\nset "ANDROID_HOME=%ANDROID_SDK_ROOT%"\necho Using ANDROID_SDK_ROOT=%ANDROID_SDK_ROOT%\n\n> "%ANDROID_DIR%\\local.properties" echo sdk.dir=%ANDROID_SDK_ROOT:\\=\\\\\\%\n\npushd "%ANDROID_DIR%"\ncall gradlew.bat assembleDebug\nset "GRADLE_EXIT=%ERRORLEVEL%"\npopd\n\nif not "%GRADLE_EXIT%"=="0" (\n  echo Gradle build failed with exit code %GRADLE_EXIT%.\n  exit /b %GRADLE_EXIT%\n)\n\nset "APK_PATH=%ANDROID_DIR%\\app\\build\\outputs\\apk\\debug\\app-debug.apk"\nif exist "%APK_PATH%" (\n  echo APK built successfully:\n  echo %APK_PATH%\n  exit /b 0\n)\n\necho Build finished but APK file was not found.\nexit /b 1\n\n:scan_java_root\nset "SCAN_ROOT=%~1"\nif not exist "%SCAN_ROOT%" exit /b 0\nfor /r "%SCAN_ROOT%" %%F in (java.exe) do (\n  if exist "%%~fF" (\n    for %%H in ("%%~dpF..") do set "JAVA_HOME=%%~fH"\n    exit /b 0\n  )\n)\nexit /b 0\n\n:scan_sdk_root\nset "SCAN_ROOT=%~1"\nif not exist "%SCAN_ROOT%" exit /b 0\nfor /r "%SCAN_ROOT%" %%F in (adb.exe) do (\n  if exist "%%~fF" (\n    for %%S in ("%%~dpF..") do set "ANDROID_SDK_ROOT=%%~fS"\n    exit /b 0\n  )\n)\nexit /b 0`
            },
            {
              filename: "capacitor.config.json",
              extension: ".json",
              language: "json",
              content: `{\n  "appId": "com.benefitbridge.app",\n  "appName": "Benefit Bridge",\n  "webDir": "dist",\n  "bundledWebRuntime": false,\n  "android": {\n    "allowMixedContent": true,\n    "captureInput": true,\n    "webContentsDebuggingEnabled": false\n  },\n  "plugins": {\n    "SplashScreen": {\n      "launchShowDuration": 500,\n      "launchAutoHide": true,\n      "backgroundColor": "#0d2b55",\n      "androidSplashResourceName": "splash",\n      "showSpinner": false,\n      "androidScaleType": "CENTER_CROP"\n    },\n    "StatusBar": {\n      "style": "Dark",\n      "backgroundColor": "#0d2b55",\n      "overlaysWebView": false\n    },\n    "Keyboard": {\n      "resize": "body",\n      "style": "dark",\n      "resizeOnFullScreen": true\n    }\n  },\n  "server": {\n    "androidScheme": "https",\n    "cleartext": false\n  }\n}`
            }
          ]
        }),
        readme_content: `# Benefit Bridge\n\nA Digital Initiative for a Better India. Benefit Bridge helps you discover, understand, and apply for government schemes easily. Empowering citizens. Bridging opportunities.\n\n![Screenshot 1](/previews/benefit-1.png)\n\n## Links\n- **Live Demo**: [https://benifit-bridge-one.vercel.app/](https://benifit-bridge-one.vercel.app/)\n- **GitHub Source**: [https://github.com/sunilkumar2007/benifit-bridge.git](https://github.com/sunilkumar2007/benifit-bridge.git)\n\n## Features\n\n1. **Government Schemes Directory**\n   Explore over 112 available schemes including Employment (MGNREGA), Agriculture (Soil Health Card), and Business (PM Mudra Loan).\n\n   ![Directory](/previews/benefit-2.png)\n\n2. **NGO Portal**\n   Applying for government schemes can be complicated. Connect with verified local NGOs who will guide you through the process, help you gather documents, and file applications on your behalf—completely free of charge.\n\n   ![NGO Portal](/previews/benefit-3.png)\n\n## Tech Stack\n- Capacitor for Android cross-platform packaging\n- React + TypeScript frontend\n- Hosted on Vercel`,
        likes_count: 512,
        saves_count: 213,
        downloads_count: 85,
        views_count: 4501,
        average_rating: 4.9,
        ratings_count: 73
      };

      const { error } = await supabase.from('resources').insert(post);
      if (error) throw error;
      
      toast.success("Successfully posted Benefit Bridge to the app!");
    } catch (e: any) {
      toast.error(e.message || "Failed to post resources");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-2xl mx-auto px-6 pt-40 pb-32 flex flex-col items-center justify-center text-center space-y-8">
        <h1 className="text-4xl font-black uppercase tracking-tight">Post Benefit Bridge</h1>
        <p className="text-neutral-500">
          Click the button below to post the Benefit Bridge project using username 'sunilkumar'.
        </p>
        <Button 
          onClick={handleSeed} 
          disabled={loading || !user}
          className="h-14 px-8 text-sm font-black uppercase tracking-[0.2em] rounded-full"
        >
          {loading ? "Posting..." : "Post Benefit Bridge Now"}
        </Button>
      </div>
    </div>
  );
}
