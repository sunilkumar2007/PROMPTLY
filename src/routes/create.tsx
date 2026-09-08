import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Navigation } from "@/components/landing/navigation";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { createResource } from "@/lib/resources.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Sparkles, 
  Upload, 
  Loader2, 
  ArrowLeft, 
  Code2, 
  FileText, 
  Layers, 
  Box, 
  Cpu, 
  CheckCircle2,
  Wand2
} from "lucide-react";
import { PromptCreatorWorkflow } from "@/components/prompt-creator/prompt-creator-workflow";

export const Route = createFileRoute("/create")({
  head: () => ({
    title: "Create Resource | Promptly",
    meta: [
      {
        name: "description",
        content: "Publish prompts, code snippets, architectures, and AI projects to Promptly.",
      },
    ],
  }),
  component: CreatePage,
});

const CATEGORIES = [
  "Website Development",
  "Mobile Applications",
  "UI/UX",
  "AI/ML",
  "Data Science",
  "Automation",
  "Marketing",
  "Productivity",
];

const TYPES = ["Prompt", "Snippet", "Component", "Architecture", "Project"];

function CreatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"standard" | "ai_prompt">("standard");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Prompt",
    category: "AI/ML",
    content: "",
    tags: "",
    preview_url: "",
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Please upload an image or video");
      return;
    }

    setUploading(true);
    try {
      if (user) {
        const fileExt = file.name.split(".").pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("resource-previews")
          .upload(filePath, file);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from("resource-previews")
            .getPublicUrl(filePath);
          setPreviewUrl(publicUrl);
          setFormData(prev => ({ ...prev, preview_url: publicUrl }));
          toast.success("File uploaded successfully");
          return;
        }
      }

      // Fallback preview using Object URL for offline/guest mode
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      setFormData(prev => ({ ...prev, preview_url: localUrl }));
      toast.success("Image selected");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a title for your resource");
      return;
    }

    setLoading(true);
    try {
      const tagList = formData.tags
        .split(",")
        .map(t => t.trim())
        .filter(Boolean);

      const resolvedPreview = formData.preview_url || previewUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80";

      if (user) {
        const { data, error } = await supabase.from("resources").insert({
          title: formData.title,
          description: formData.description || null,
          type: formData.type as any,
          category: formData.category as any,
          preview_url: resolvedPreview,
          creator_id: user.id,
          content: formData.content || formData.description || "",
        }).select().single();

        if (error) {
          console.warn("Supabase insert error, using server function fallback:", error);
          await createResource({
            data: {
              title: formData.title,
              description: formData.description,
              content: formData.content || formData.description || "Resource content",
              category: formData.category,
              type: formData.type,
              tags: tagList,
              creator_id: user.id,
            }
          });
        }
      } else {
        await createResource({
          data: {
            title: formData.title,
            description: formData.description,
            content: formData.content || formData.description || "Resource content",
            category: formData.category,
            type: formData.type,
            tags: tagList,
            creator_id: "mock-creator-id",
          }
        });
      }

      toast.success("Resource created successfully!");
      navigate({ to: "/explore", search: { query: undefined, category: undefined, type: undefined } });
    } catch (error: any) {
      toast.error(error.message || "Failed to create resource");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white pb-32">
      <Navigation />

      <main className="max-w-4xl mx-auto px-6 pt-28 sm:pt-36 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Link
            to="/explore"
            search={{ query: undefined, category: undefined, type: undefined }}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Explore
          </Link>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase">
            Create Resource
          </h1>
          <p className="text-sm text-neutral-500 max-w-xl">
            Publish high-performing prompts, agent directives, system architectures, or UI snippets to the Promptly community.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 border-b border-black/10 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("standard")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "standard"
                ? "bg-black text-white shadow-md shadow-black/10"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            Standard Publisher
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ai_prompt")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "ai_prompt"
                ? "bg-black text-white shadow-md shadow-black/10"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" /> AI Prompt Studio
          </button>
          <Link
            to="/ai"
            className="ml-auto px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black hover:bg-neutral-100 transition-all flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5" /> Full AI Workspace
          </Link>
        </div>

        {activeTab === "ai_prompt" ? (
          <div className="bg-neutral-50/50 rounded-3xl border border-black/5 p-6 sm:p-8">
            <PromptCreatorWorkflow
              onPromptSaved={(prompt) => {
                setFormData(prev => ({
                  ...prev,
                  title: prompt.optimizedTitle || "AI Prompt",
                  description: prompt.tags?.join(", ") || "",
                  content: prompt.fullPrompt,
                  category: prompt.category || "AI/ML",
                  type: "Prompt",
                }));
                setActiveTab("standard");
                toast.success("Prompt loaded into publisher! Add details and publish.");
              }}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 bg-neutral-50/50 rounded-3xl border border-black/5 p-6 sm:p-10">
            {/* Title & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider">
                  Resource Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Next.js 15 SaaS Clean Architecture"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="h-12 bg-white rounded-xl border-black/10 focus:border-black text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-xs font-bold uppercase tracking-wider">
                  Type
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(val) => setFormData(prev => ({ ...prev, type: val }))}
                >
                  <SelectTrigger className="h-12 bg-white rounded-xl border-black/10 text-sm">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-black/10">
                    {TYPES.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                >
                  <SelectTrigger className="h-12 bg-white rounded-xl border-black/10 text-sm">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-black/10">
                    {CATEGORIES.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-xs font-bold uppercase tracking-wider">
                  Tags (comma separated)
                </Label>
                <Input
                  id="tags"
                  placeholder="react, tailwind, typescript"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="h-12 bg-white rounded-xl border-black/10 focus:border-black text-sm"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider">
                Summary / Description
              </Label>
              <Textarea
                id="description"
                placeholder="Explain what this prompt or snippet does, its key benefits, and how to use it..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-white rounded-xl border-black/10 focus:border-black text-sm min-h-[90px]"
              />
            </div>

            {/* Code / Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content" className="text-xs font-bold uppercase tracking-wider">
                  Prompt Text or Source Code *
                </Label>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono">
                  Markdown &amp; Code Supported
                </span>
              </div>
              <Textarea
                id="content"
                placeholder="Paste the raw prompt directive, system instructions, or code snippet here..."
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="font-mono bg-white rounded-xl border-black/10 focus:border-black text-xs sm:text-sm min-h-[180px]"
              />
            </div>

            {/* Preview Media */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider">
                Preview Media (Image or Video)
              </Label>
              <div className="relative group aspect-video sm:aspect-[21/9] w-full bg-white rounded-2xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center overflow-hidden transition-colors hover:border-neutral-400">
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Label htmlFor="file-upload" className="cursor-pointer bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:scale-105 transition-transform">
                        Change Media
                      </Label>
                    </div>
                  </>
                ) : (
                  <>
                    {uploading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-3">
                          <Upload className="w-5 h-5 text-neutral-400" />
                        </div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">Upload Media</p>
                        <p className="text-[10px] text-neutral-400 mt-1">PNG, JPG or MP4 (optional - default placeholder will be used)</p>
                      </>
                    )}
                    <Input
                      id="file-upload"
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleFileUpload}
                      accept="image/*,video/*"
                      disabled={uploading}
                    />
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Input
                  placeholder="Or paste external image URL (e.g. https://images.unsplash.com/...)"
                  value={formData.preview_url}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, preview_url: e.target.value }));
                    if (e.target.value) setPreviewUrl(e.target.value);
                  }}
                  className="h-10 bg-white rounded-xl border-black/10 text-xs"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate({ to: "/explore", search: { query: undefined, category: undefined, type: undefined } })}
                className="w-full sm:w-auto h-12 px-6 rounded-full text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto h-12 px-8 rounded-full bg-black text-white hover:bg-black/90 text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Publish Resource
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
