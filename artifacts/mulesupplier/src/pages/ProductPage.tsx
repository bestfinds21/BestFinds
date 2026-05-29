import { useSyncExternalStore, useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductDialog } from "@/components/dialogs/ProductDialog";
import { loadStore, subscribe, actions } from "@/store";
import { toast } from "sonner";

interface ProductPageProps {
  isEditor: boolean;
}

export function ProductPage({ isEditor }: ProductPageProps) {
  const { categoryId, productId } = useParams<{ categoryId: string; productId: string }>();
  const [, navigate] = useLocation();
  const store = useSyncExternalStore(subscribe, loadStore);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"gallery" | "qc">("gallery");

  const product = store.products.find((p) => p.id === productId);
  const category = store.categories.find((c) => c.id === categoryId);

  if (!product || !category) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-muted-foreground text-lg">Product not found.</p>
        <Link href={`/c/${categoryId}`}>
          <Button variant="outline" className="mt-4 rounded-full">Go back</Button>
        </Link>
      </div>
    );
  }

  const allImages = [
    ...(product.mainImage ? [product.mainImage] : []),
    ...product.extraImages,
  ];
  const qcImages = product.qcImages;
  const displayImages = activeTab === "gallery" ? allImages : qcImages;

  function handleDelete() {
    if (!confirm("Delete this product?")) return;
    actions.deleteProduct(product!.id);
    toast.success("Product deleted");
    navigate(`/c/${categoryId}`);
  }

  function prev() {
    setActiveImageIndex((i) => (i - 1 + displayImages.length) % displayImages.length);
  }
  function next() {
    setActiveImageIndex((i) => (i + 1) % displayImages.length);
  }

  return (
    <>
      <div className="min-h-[100dvh] pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-6 pb-4 flex items-center justify-between">
            <Link href={`/c/${categoryId}`}>
              <motion.button
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                {category.name}
              </motion.button>
            </Link>

            {isEditor && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setProductDialogOpen(true)}
                  className="rounded-full h-8 gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="rounded-full h-8 gap-1.5 text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image section */}
            <div className="space-y-4">
              {/* Tab selector */}
              {qcImages.length > 0 && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setActiveTab("gallery"); setActiveImageIndex(0); }}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      activeTab === "gallery"
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Gallery
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab("qc"); setActiveImageIndex(0); }}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      activeTab === "qc"
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    QC Photos
                  </button>
                </div>
              )}

              {/* Main image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border">
                <AnimatePresence mode="wait">
                  {displayImages.length > 0 ? (
                    <motion.img
                      key={`${activeTab}-${activeImageIndex}`}
                      src={displayImages[activeImageIndex]}
                      alt={`${product.name} ${activeImageIndex + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                      <div className="text-center">
                        <div className="text-6xl mb-2">📦</div>
                        <p className="text-sm">No image</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>

                {displayImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {displayImages.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveImageIndex(i)}
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            i === activeImageIndex ? "bg-white" : "bg-white/40"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {displayImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {displayImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImageIndex(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        i === activeImageIndex ? "border-primary" : "border-border"
                      }`}
                    >
                      <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info section */}
            <div className="flex flex-col py-4 md:py-8">
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4"
              >
                {product.name}
              </motion.h1>

              {product.price && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="mb-8"
                >
                  <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-bold text-xl rounded-xl border border-primary/20">
                    {product.price}
                  </span>
                </motion.div>
              )}

              {product.notes && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="prose prose-invert max-w-none"
                >
                  <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                    {product.notes}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ProductDialog
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
        categoryId={categoryId!}
        editing={product}
      />
    </>
  );
}
