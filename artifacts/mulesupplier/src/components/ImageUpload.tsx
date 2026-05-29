import { useRef } from "react";
import { Image, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
  placeholder?: string;
  compact?: boolean;
}

export function ImageUpload({ value, onChange, className, placeholder = "Upload image", compact = false }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") onChange(result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  if (compact) {
    return (
      <div className={cn("relative group", className)}>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        {value ? (
          <div className="relative">
            <img src={value} alt="uploaded" className="w-full h-full object-cover rounded-xl" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
            >
              <Upload className="w-4 h-4 text-white" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center gap-1 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
          >
            <Image className="w-5 h-5" />
            <span className="text-xs">{placeholder}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative group", className)}>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {value ? (
        <div className="relative rounded-xl overflow-hidden">
          <img src={value} alt="uploaded" className="w-full object-cover max-h-48" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white/10 rounded-lg text-white text-sm hover:bg-white/20 transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="px-3 py-1.5 bg-red-500/20 rounded-lg text-red-300 text-sm hover:bg-red-500/30 transition-colors flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-36 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
        >
          <Image className="w-6 h-6" />
          <span className="text-sm">{placeholder}</span>
          <span className="text-xs text-muted-foreground/60">PNG, JPG, WEBP</span>
        </button>
      )}
    </div>
  );
}
