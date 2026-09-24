"use client";

import { useRef, useState } from "react";
import { ImageOff, Upload, Loader2 } from "lucide-react";
import { uploadProductImageAction } from "@/app/actions/upload";
import { useToastStore } from "@/lib/store/toast";

export function ImageUploader({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const show = useToastStore((s) => s.show);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadProductImageAction(formData);
      if (!result.ok || !result.url) {
        show(result.error ?? "Upload failed.", "error");
        return;
      }
      onChange(result.url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div
        className="relative flex aspect-square w-40 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-surface"
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
        ) : value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Product preview" className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted">
            <ImageOff className="h-6 w-6" />
            <span className="text-[11px]">No image</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-black/60 py-1.5 text-[11px] text-white">
          <Upload className="h-3 w-3" /> {value ? "Replace" : "Upload"}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
