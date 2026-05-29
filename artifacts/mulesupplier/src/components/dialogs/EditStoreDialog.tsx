import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ImageUpload";
import { actions } from "@/store";
import type { StoreData } from "@/types";
import { toast } from "sonner";

interface EditStoreDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  store: StoreData;
}

export function EditStoreDialog({ open, onOpenChange, store }: EditStoreDialogProps) {
  const [name, setName] = useState(store.storeName);
  const [tagline, setTagline] = useState(store.tagline);
  const [logo, setLogo] = useState<string | null>(store.logoImage);

  function handleSave() {
    if (!name.trim()) return;
    actions.updateSettings({ storeName: name.trim(), tagline: tagline.trim(), logoImage: logo });
    onOpenChange(false);
    toast.success("Store updated");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Edit store</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label>Logo</Label>
            <div className="w-28 h-28 mx-auto">
              <ImageUpload value={logo} onChange={setLogo} className="w-28 h-28" compact placeholder="Logo" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="store-name">Store name</Label>
            <Input
              id="store-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mulesupplier"
              className="bg-muted border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Your private showroom"
              className="bg-muted border-border"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-full">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!name.trim()} className="rounded-full bg-primary text-white">
              Save changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
