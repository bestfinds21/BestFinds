import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ImageUpload";
import { actions } from "@/store";
import type { Category } from "@/types";
import { toast } from "sonner";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing?: Category | null;
}

export function CategoryDialog({ open, onOpenChange, editing }: CategoryDialogProps) {
  const [name, setName] = useState("");
  const [cover, setCover] = useState<string | null>(null);

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setCover(editing.coverImage);
    } else {
      setName("");
      setCover(null);
    }
  }, [editing, open]);

  function handleSave() {
    if (!name.trim()) return;
    if (editing) {
      actions.updateCategory(editing.id, { name: name.trim(), coverImage: cover });
      toast.success("Category updated");
    } else {
      actions.addCategory({ name: name.trim(), coverImage: cover });
      toast.success("Category added");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {editing ? "Edit category" : "Add category"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label>Cover image</Label>
            <ImageUpload value={cover} onChange={setCover} placeholder="Category cover" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cat-name">Name</Label>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sneakers"
              className="bg-muted border-border"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-full">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!name.trim()} className="rounded-full bg-primary text-white">
              {editing ? "Save changes" : "Add category"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
