import React, { useRef, useState } from "react";
import { Camera, X, ImagePlus, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

export default function PhotoUpload({ photos, onChange, max = 5 }) {
  const inputRef = useRef(null);
  const cameraRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files) => {
    const remaining = max - photos.length;
    const toUpload = Array.from(files).slice(0, remaining);
    if (toUpload.length === 0) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(
        toUpload.map(async (file) => {
          const { file_url } = await base44.integrations.Core.UploadFile({ file });
          return file_url;
        })
      );
      onChange([...photos, ...uploaded]);
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
      if (cameraRef.current) cameraRef.current.value = "";
    }
  };

  const removePhoto = (idx) => {
    onChange(photos.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2.5">
          {photos.map((url, idx) => (
            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-border bg-muted">
              <Image src={url} alt={`Photo ${idx + 1}`} className="h-full w-full object-cover" fittingType="fill" />
              <button
                type="button"
                onClick={() => removePhoto(idx)}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length < max && (
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            disabled={uploading}
            className={cn(
              "flex flex-col items-center justify-center gap-2 h-28 rounded-xl border-2 border-dashed border-border bg-muted/50 hover:border-primary hover:bg-primary/5 transition-all",
              uploading && "opacity-60"
            )}
          >
            {uploading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <Camera className="h-6 w-6 text-primary" />}
            <span className="text-xs font-medium text-muted-foreground">Take Photo</span>
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={cn(
              "flex flex-col items-center justify-center gap-2 h-28 rounded-xl border-2 border-dashed border-border bg-muted/50 hover:border-primary hover:bg-primary/5 transition-all",
              uploading && "opacity-60"
            )}
          >
            {uploading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <ImagePlus className="h-6 w-6 text-primary" />}
            <span className="text-xs font-medium text-muted-foreground">Choose File</span>
          </button>
        </div>
      )}

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-xs text-muted-foreground text-center">
        {photos.length} of {max} photos • Camera or gallery
      </p>
    </div>
  );
}