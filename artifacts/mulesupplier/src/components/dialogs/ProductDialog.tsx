import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload, MultiImageUpload } from "@/components/ImageUpload";
import { addProduct, updateProduct } from "@/store";
import type { Product } from "@/types";

interface ProductDialogProps {
  open: boolean;
  product: Product | null;
  categoryId: string;
  onOpenChange: (open: boolean) => void;
}

export function ProductDialog({ open, product, categoryId, onOpenChange }: ProductDialogProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [qcImages, setQcImages] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setName(product?.name ?? "");
      setPrice(product?.price ?? "");
      setNotes(product?.notes ?? "");
      setMainImage(product?.mainImage ?? null);
      setExtraImages(product?.extraImages ?? []);
      setQcImages(product?.qcImages ?? []);
    }
  }, [open, product]);

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const data = { name: trimmed, price: price.trim(), notes: notes.trim(), mainImage, extraImages, qcImages };
    if (product) {
      updateProduct(product.id, data);
    } else {
      addProduct(categoryId, data);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit product" : "Add product"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product name"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label>Price (€)</Label>
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              inputMode="decimal"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Size, color, description..."
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Main photo</Label>
            <ImageUpload value={mainImage} onChange={setMainImage} label="Upload main photo" />
          </div>
          <div className="space-y-1.5">
            <Label>Extra photos</Label>
            <MultiImageUpload values={extraImages} onChange={setExtraImages} label="Add photos" maxCount={8} />
          </div>
          <div className="space-y-1.5">
            <Label>QC photos</Label>
            <MultiImageUpload values={qcImages} onChange={setQcImages} label="QC photos" maxCount={10} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              {product ? "Save" : "Add"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
