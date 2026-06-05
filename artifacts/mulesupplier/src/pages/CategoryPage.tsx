import { useSyncExternalStore, useState, useMemo } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence, Reorder, useDragControls } from "framer-motion";
import { ChevronLeft, Plus, ArrowUpDown, Search, X } from "lucide-react";
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
  const [search, setSearch] = useState("");
  const [reorderMode, setReorderMode] = useState(false);

  const category = store.categories.find((c) => c.id === categoryId);
  const products = store.products.filter((p) => p.categoryId === categoryId);
  const [localProducts, setLocalProducts] = useState<Product[]>(products);

  if (JSON.stringify(localProducts.map((p) => p.id)) !== JSON.stringify(products.map((p) => p.id))) {
    setLocalProducts(products);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return localProducts;
    return localProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.price?.toLowerCase().includes(q) ||
        p.notes?.toLowerCase().includes(q)
    );
  }, [localProducts, search]);

  if (!category) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-muted-foreground text-lg">Category not found.</p>
        <Link href="/">
          <button className="mt-4 px-5 py-2 rounded-full border border-border text-sm text-foreground">
            Go back
          </button>
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

  const showReorder = isEditor && reorderMode;

  return (
    <>
      {/* Purple top accent bar */}
      <div className="h-1.5 w-full bg-primary fixed top-0 left-0 right-0 z-40" />

      <div className="min-h-[100dvh] pb-28 pt-1.5">
        {/* Header */}
        <div className="px-4 pt-4 pb-2">
          <Link href="/">
            <motion.button
              whileTap={{ scale: 0.93 }}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-3"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </motion.button>
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-display font-bold text-foreground mb-4"
          >
            {category.name}
          </motion.h1>

          {/* Search bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-10 rounded-2xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Editor action buttons */}
          {isEditor && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 mb-1"
            >
              <button
                type="button"
                onClick={() => setReorderMode((v) => !v)}
                className={`flex items-center justify-center gap-2 flex-1 h-11 rounded-2xl border text-sm font-semibold transition-all ${
                  reorderMode
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted border-border text-foreground hover:border-primary/40"
                }`}
              >
                <ArrowUpDown className="w-4 h-4" />
                Reorder
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setProductDialogOpen(true);
                }}
                className="flex items-center justify-center gap-2 flex-1 h-11 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </motion.div>
          )}
        </div>

        {/* Grid */}
        <div className="px-4">
          {showReorder ? (
            <Reorder.Group
              axis="y"
              values={localProducts}
              onReorder={handleReorder}
              className="grid grid-cols-2 gap-3"
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
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AnimatePresence>
                {filtered.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    isEditor={isEditor}
                    onEdit={() => {
                      setEditingProduct(prod);
                      setProductDialogOpen(true);
                    }}
                    onDelete={() => handleDeleteProduct(prod.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              {search ? (
                <p className="text-base">No results for "{search}"</p>
              ) : (
                <>
                  <p className="text-lg">No products yet.</p>
                  {isEditor && <p className="text-sm mt-1 opacity-60">Tap "Add Product" to get started.</p>}
                </>
              )}
            </div>
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
