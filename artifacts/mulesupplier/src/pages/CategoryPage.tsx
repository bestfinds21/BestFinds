import { useSyncExternalStore, useState } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence, Reorder, useDragControls } from "framer-motion";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { ProductDialog } from "@/components/dialogs/ProductDialog";
import { loadStore, subscribe, actions } from "@/store";
import type { Product } from "@/types";
import { toast } from "sonner";

interface CategoryPageProps {
  isEditor: boolean;
}

function DraggableProductItem({
  prod,
  isEditor,
  onEdit,
  onDelete,
}: {
  prod: Product;
  isEditor: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item value={prod} dragListener={false} dragControls={controls}>
      <ProductCard
        product={prod}
        isEditor={isEditor}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={{ onPointerDown: (e: React.PointerEvent) => controls.start(e) }}
      />
    </Reorder.Item>
  );
}

export function CategoryPage({ isEditor }: CategoryPageProps) {
  const { categoryId } = useParams<{ categoryId: string }>();
  const store = useSyncExternalStore(subscribe, loadStore);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const category = store.categories.find((c) => c.id === categoryId);
  const products = store.products.filter((p) => p.categoryId === categoryId);
  const [localProducts, setLocalProducts] = useState<Product[]>(products);

  if (JSON.stringify(localProducts.map((p) => p.id)) !== JSON.stringify(products.map((p) => p.id))) {
    setLocalProducts(products);
  }

  if (!category) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-muted-foreground text-lg">Category not found.</p>
        <Link href="/">
          <Button variant="outline" className="mt-4 rounded-full">
            Go back
          </Button>
        </Link>
      </div>
    );
  }

  function handleReorder(newOrder: Product[]) {
    setLocalProducts(newOrder);
    actions.reorderProducts(categoryId!, newOrder.map((p) => p.id));
  }

  function handleDeleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    actions.deleteProduct(id);
    toast.success("Product deleted");
  }

  return (
    <>
      <div className="min-h-[100dvh] pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-6 pb-4">
            <Link href="/">
              <motion.button
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </motion.button>
            </Link>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-6"
          >
            {category.name}
          </motion.h1>

          {isEditor ? (
            <Reorder.Group
              axis="y"
              values={localProducts}
              onReorder={handleReorder}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              <AnimatePresence>
                {localProducts.map((prod) => (
                  <DraggableProductItem
                    key={prod.id}
                    prod={prod}
                    isEditor={isEditor}
                    onEdit={() => {
                      setEditingProduct(prod);
                      setProductDialogOpen(true);
                    }}
                    onDelete={() => handleDeleteProduct(prod.id)}
                  />
                ))}
              </AnimatePresence>
            </Reorder.Group>
          ) : (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AnimatePresence>
                {products.map((prod) => (
                  <ProductCard key={prod.id} product={prod} isEditor={false} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {products.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">No products yet.</p>
              {isEditor && <p className="text-sm mt-1">Click "Add product" to get started.</p>}
            </div>
          )}

          {isEditor && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex justify-center"
            >
              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setProductDialogOpen(true);
                }}
                className="rounded-full gap-2 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
              >
                <Plus className="w-4 h-4" />
                Add product
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      <ProductDialog
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
        categoryId={categoryId!}
        editing={editingProduct}
      />
    </>
  );
}
