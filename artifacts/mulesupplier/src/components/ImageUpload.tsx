import { useRef } from "react";
import { Image, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resizeImage } from "@/lib/resizeImage";

interface ImageUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, label = "Image", className = "" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    try {
      const resized = await resizeImage(file);
      onChange(resized);
    } catch (e) {
      console.error("Failed to process image", e);
    }
  }

  return (
    <div className={className}>
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

      {value ? (
        <div className="relative rounded-xl overflow-hidden aspect-square bg-card border border-border">
          <img src={value} alt={label} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 h-7 w-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white"
          >
            <Upload className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Image className="h-8 w-8" />
          <span className="text-xs">{label}</span>
        </button>
      )}
    </div>
  );
}


interface MultiImageUploadProps {
  values: string[];
  onChange: (values: string[]) => void;
  label?: string;
  maxCount?: number;
}

export function MultiImageUpload({ values, onChange, label = "Add photos", maxCount = 10 }: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    const resized = await Promise.all(
      Array.from(files)
        .slice(0, maxCount - values.length)
        .map((f) => resizeImage(f))
    );
    onChange([...values, ...resized]);
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {values.map((v, i) => (
        <div key={i} className="relative rounded-xl overflow-hidden aspect-square bg-card border border-border">
          <img src={v} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(values.filter((_, j) => j !== i))}
            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      {values.length < maxCount && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-xs"
          >
            <Upload className="h-5 w-5" />
            {label}
          </button>
        </>
      )}
    </div>
  );
}
