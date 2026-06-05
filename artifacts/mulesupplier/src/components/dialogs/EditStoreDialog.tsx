import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ImageUpload";
import { updateStoreInfo } from "@/store";
import type { StoreData } from "@/types";

interface EditStoreDialogProps {
  open: boolean;
  store: StoreData;
  onOpenChange: (open: boolean) => void;
}

export function EditStoreDialog({ open, store, onOpenChange }: EditStoreDialogProps) {
  const [storeName, setStoreName] = useState("");
  const [tagline, setTagline] = useState("");
  const [logoImage, setLogoImage] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setStoreName(store.storeName);
      setTagline(store.tagline);
      setLogoImage(store.logoImage);
    }
  }, [open, store]);

  function handleSave() {
    const trimmed = storeName.trim();
    if (!trimmed) return;
    updateStoreInfo({ storeName: trimmed, tagline: tagline.trim(), logoImage });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit store info</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Store name</Label>
            <Input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="My Showroom"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label>Tagline</Label>
            <Input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Premium finds, curated for you"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Logo</Label>
            <ImageUpload value={logoImage} onChange={setLogoImage} label="Upload logo" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
