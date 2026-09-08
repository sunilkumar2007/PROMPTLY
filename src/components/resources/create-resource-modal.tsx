import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Image as ImageIcon, Upload, Loader2 } from "lucide-react";

export function CreateResourceModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Prompt" as any,
    category: "AI/ML" as any,
    preview_url: "",
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Check file type
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Please upload an image or video");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("resource-previews")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("resource-previews")
        .getPublicUrl(filePath);

      setPreviewUrl(publicUrl);
      setFormData(prev => ({ ...prev, preview_url: publicUrl }));
      toast.success("File uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.title || !formData.preview_url) {
      toast.error("Title and preview media are required");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("resources").insert({
        title: formData.title,
        description: formData.description,
        type: formData.type as any,
        category: formData.category as any,
        preview_url: formData.preview_url,
        creator_id: user.id,
        content: "", // Content should be a string or JSON string depending on table definition, using empty string for now
      });

      if (error) throw error;

      toast.success("Resource created successfully!");
      onSuccess?.();
      onClose();
      // Reset form
      setFormData({
        title: "",
        description: "",
        type: "Prompt",
        category: "AI/ML",
        preview_url: "",
      });
      setPreviewUrl(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to create resource");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">Create New Resource</DialogTitle>
          <DialogDescription>
            Share your discovery with the Promptly community.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="preview">Preview Media (Required)</Label>
            <div className="relative group aspect-video w-full bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center overflow-hidden transition-colors hover:border-neutral-300">
              {previewUrl ? (
                <>
                  {previewUrl.endsWith(".mp4") ? (
                    <video src={previewUrl} className="w-full h-full object-cover" autoPlay muted loop />
                  ) : (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  )}
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
                      <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">Upload Image or Video</p>
                      <p className="text-[10px] text-neutral-400 mt-1">PNG, JPG, MP4 recommended</p>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Modern Dashboard UI..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="h-11 rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(val) => setFormData({ ...formData, type: val })}
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Prompt', 'Code', 'UI/UX', 'Component', 'Template', 'Project'].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(val) => setFormData({ ...formData, category: val })}
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['AI/ML', 'Website Development', 'UI/UX', 'Mobile Applications', 'Data Science', 'Automation'].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Tell us more about this resource..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[100px] rounded-xl resize-none"
            />
          </div>

          <Button type="submit" className="w-full h-12 rounded-xl bg-black text-white font-bold" disabled={loading || uploading}>
            {loading ? "Creating..." : "Publish Resource"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
