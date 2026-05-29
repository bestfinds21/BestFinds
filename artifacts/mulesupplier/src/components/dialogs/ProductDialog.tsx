import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ImageUpload";
import { actions } from "@/store";
import type { Product } from "@/types";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  categoryId: string;
  editing?: Product | null;
}

export function ProductDialog({ open, onOpenChange, categoryId, editing }: ProductDialogProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [qcImages, setQcImages] = useState<string[]>([]);

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setPrice(editing.price);
      setNotes(editing.notes);
      setMainImage(editing.mainImage);
      setExtraImages(editing.extraImages);
      setQcImages(editing.qcImages);
    } else {
      setName("");
      setPrice("");
      setNotes("");
      setMainImage(null);
      setExtraImages([]);
      setQcImages([]);
    }
  }, [editing, open]);

  function addExtra(type: "extra" | "qc", value: string) {
    if (type === "extra") setExtraImages((prev) => [...prev, value]);
    else setQcImages((prev) => [...prev, value]);
  }

  function removeExtra(type: "extra" | "qc", index: number) {
    if (type === "extra") setExtraImages((prev) => prev.filter((_, i) => i !== index));
    else setQcImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSave() {
    if (!name.trim()) return;
    const payload = { categoryId, name: name.trim(), price: price.trim(), notes: notes.trim(), mainImage, extraImages, qcImages };
    if (editing) {
      actions.updateProduct(editing.id, payload);
      toast.success("Product updated");
    } else {
      actions.addProduct(payload);
      toast.success("Product added");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90dvh] overflow-y-auto rounded-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {editing ? "Edit product" : "Add product"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label>Main image</Label>
            <ImageUpload value={mainImage} onChange={setMainImage} placeholder="Main product image" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prod-name">Name</Label>
              <Input
                id="prod-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Classic Low Grey"
                className="bg-muted border-border"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prod-price">Price</Label>
              <Input
                id="prod-price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. €25"
                className="bg-muted border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prod-notes">Notes</Label>
            <Textarea
              id="prod-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Sizing notes, batch info, etc."
              className="bg-muted border-border resize-none"
              rows={3}
            />
          </div>

          <ImageListSection
            label="Extra images"
            images={extraImages}
            onAdd={(v) => addExtra("extra", v)}
            onRemove={(i) => removeExtra("extra", i)}
          />

          <ImageListSection
            label="QC images"
            images={qcImages}
            onAdd={(v) => addExtra("qc", v)}
            onRemove={(i) => removeExtra("qc", i)}
          />

          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-full">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!name.trim()} className="rounded-full bg-primary text-white">
              {editing ? "Save changes" : "Add product"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ImageListSection({
  label,
  images,
  onAdd,
  onRemove,
}: {
  label: string;
  images: string[];
  onAdd: (v: string) => void;
  onRemove: (i: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") onAdd(result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((img, i) => (
            <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
