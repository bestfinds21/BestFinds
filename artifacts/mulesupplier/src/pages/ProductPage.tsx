import { useSyncExternalStore, useState } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ShieldCheck, Pencil, ImageIcon, ChevronLeft as ChevLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { subscribeStore, getStore, deleteProduct } from "@/store";
import { ProductDialog } from "@/components/dialogs/ProductDialog";

export function ProductPage({ isEditor }: { isEditor: boolean }) {
  const { categoryId, productId } = useParams<{ categoryId: string; productId: string }>();
  const store = useSyncExternalStore(subscribeStore, getStore);
  const product = store.products.find((p) => p.id === productId && p.categoryId === categoryId);
  const category = store.categories.find((c) => c.id === categoryId);

  const [mainIdx, setMainIdx] = useState(0);
  const [qcIdx, setQcIdx] = useState(0);
  const [tab, setTab] = useState<"product" | "qc">("product");
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!product || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground text-lg mb-4">Product not found.</p>
          <Link href={`/c/${categoryId}`}>
            <Button variant="outline">← Back</Button>
          </Link>
        </div>
      </div>
    );
  }

  const productImages = [product.mainImage, ...product.extraImages].filter(Boolean) as string[];
  const qcImages = product.qcImages;
  const activeImages = tab === "qc" ? qcImages : productImages;
  const activeIdx = tab === "qc" ? qcIdx : mainIdx;
  const setActiveIdx = tab === "qc" ? setQcIdx : setMainIdx;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Link href={`/c/${categoryId}`}>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
          </Link>
          <h1 className="text-xl font-display font-bold text-foreground flex-1 truncate">{product.name}</h1>
          {isEditor && (
            <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Button>
          )}
        </div>

        {/* Image gallery */}
        {activeImages.length > 0 ? (
          <div className="relative rounded-2xl overflow-hidden bg-card mb-4 aspect-square">
            <AnimatePresence mode="wait">
              <motion.img
                key={`${tab}-${activeIdx}`}
                src={activeImages[activeIdx]}
                alt={product.name}
                className="w-full h-full object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </AnimatePresence>
            {activeImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveIdx(Math.max(0, activeIdx - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 rounded-full p-1 text-white"
                >
                  <ChevLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setActiveIdx(Math.min(activeImages.length - 1, activeIdx + 1))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 rounded-full p-1 text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {activeImages.map((_, j) => (
                    <button
                      key={j}
                      onClick={() => setActiveIdx(j)}
                      className={`h-1.5 rounded-full transition-all ${j === activeIdx ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="rounded-2xl bg-card flex items-center justify-center aspect-square mb-4">
            <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}

        {/* Tabs */}
        {qcImages.length > 0 && (
          <div className="flex gap-2 mb-4">
            <Button
              size="sm"
              variant={tab === "product" ? "default" : "outline"}
              onClick={() => setTab("product")}
            >
              Product photos
            </Button>
            <Button
              size="sm"
              variant={tab === "qc" ? "default" : "outline"}
              onClick={() => setTab("qc")}
              className="gap-1.5"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              QC photos
            </Button>
          </div>
        )}

        {/* Price & info */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-lg font-display font-semibold text-foreground">{product.name}</h2>
            <span className="text-primary font-bold text-lg ml-4 whitespace-nowrap">€{product.price}</span>
          </div>
          {product.notes && (
            <p className="text-muted-foreground text-sm whitespace-pre-wrap">{product.notes}</p>
          )}
          {product.qcImages.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{product.qcImages.length} QC photo{product.qcImages.length !== 1 ? "s" : ""} available</span>
            </div>
          )}
        </div>

        {/* Thumbnail row */}
        {activeImages.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {activeImages.map((img, j) => (
              <button
                key={j}
                onClick={() => setActiveIdx(j)}
                className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${j === activeIdx ? "border-primary" : "border-transparent"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Delete button (editor only) */}
        {isEditor && (
          <Button
            variant="destructive"
            size="sm"
            className="mt-6"
            onClick={() => {
              deleteProduct(product.id);
              window.history.back();
            }}
          >
            Delete product
          </Button>
        )}
      </div>

      {isEditor && (
        <ProductDialog
          open={dialogOpen}
          product={product}
          categoryId={categoryId}
          onOpenChange={setDialogOpen}
        />
      )}
    </div>
  );
}
