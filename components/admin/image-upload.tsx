// components/admin/image-upload.tsx
"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X } from "lucide-react";
import { uploadImage, deleteImage } from "@/lib/upload";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string | null;
  onUploaded: (url: string) => void;
}

export function ImageUpload({ value, onUploaded }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Aperçu local immédiat pendant l'upload
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadImage(formData);

    setIsUploading(false);

    if ("error" in result) {
      toast.error(result.error);
      setPreview(value ?? null); // revient à l'image précédente
      return;
    }

    // Libère l'URL objet locale
    URL.revokeObjectURL(localPreview);
    setPreview(result.url);
    onUploaded(result.url);

    // Reset input pour permettre de re-sélectionner le même fichier
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleRemove() {
    if (value) await deleteImage(value);
    setPreview(null);
    onUploaded("");
  }

  return (
    <div className="space-y-3">
      {preview && (
        <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-md border">
          <Image
            src={preview}
            alt="Aperçu"
            fill
            sizes="320px" // ✅ requis par Next.js avec fill
            className="object-cover"
          />
          {/* ✅ bouton ✕ toujours présent si preview existe */}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-1.5 top-1.5 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/70"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {preview ? "Changer l'image" : "Choisir une image"}
        </Button>
      </div>
    </div>
  );
}
