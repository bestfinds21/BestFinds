import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ImageUpload";
import { addCategory, updateCategory } from "@/store";
import type { Category } from "@/types";

interface CategoryDialogProps {
  open: boolean;
  category: Category | null;
  onOpenChange: (open: boolean) => void;
}

export function CategoryDialog({ open, category, onOpenChange }: CategoryDialogProps) {
  const [name, setName] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(category?.name ?? "");
      setCoverImage(category?.coverImage ?? null);
    }
  }, [open, category]);

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (category) {
      updateCategory(category.id, { name: trimmed, coverImage });
    } else {
      addCategory(trimmed, coverImage);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{category ? "Edit category" : "Add category"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label>Cover image</Label>
            <ImageUpload value={coverImage} onChange={setCoverImage} label="Upload cover" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              {category ? "Save" : "Add"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
