import { useSyncExternalStore, useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Plus, ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeStore, getStore, reorderProducts } from "@/store";
import { ProductCard } from "@/components/ProductCard";
import { ProductDialog } from "@/components/dialogs/ProductDialog";
import type { Product } from "@/types";

export function CategoryPage({ isEditor }: { isEditor: boolean }) {
  const { categoryId } = useParams<{ categoryId: string }>();
  const store = useSyncExternalStore(subscribeStore, getStore);
  const category = store.categories.find((c) => c.id === categoryId);
  const allProducts = store.products.filter((p) => p.categoryId === categoryId);

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [reordering, setReordering] = useState(false);
  const [order, setOrder] = useState<Product[]>([]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground text-lg mb-4">Category not found.</p>
          <Link href="/">
            <Button variant="outline">← Back to home</Button>
          </Link>
        </div>
      </div>
    );
  }

  function startReorder() {
    setOrder([...allProducts]);
    setReordering(true);
  }

  function moveProduct(index: number, dir: -1 | 1) {
    const next = [...order];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
  }

  function saveReorder() {
    reorderProducts(categoryId, order);
    setReordering(false);
  }

  const filtered = (reordering ? order : allProducts).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <Link href="/">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
          </Link>
          <h1 className="text-2xl font-display font-bold text-foreground">{category.name}</h1>
        </div>

        {/* Search */}
        <div className="relative mb-4 mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>

        {/* Editor actions */}
        {isEditor && (
          <div className="flex gap-2 mb-4">
            {reordering ? (
              <>
                <Button size="sm" variant="default" onClick={saveReorder}>
                  Save order
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setReordering(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={startReorder}>
                  <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
                  Reorder
                </Button>
                <Button size="sm" onClick={() => { setEditingProduct(null); setDialogOpen(true); }}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Product
                </Button>
              </>
            )}
          </div>
        )}

        {/* Product grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground text-lg">
              {search ? "No products match your search." : isEditor ? "No products yet. Add your first one!" : "No products yet."}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
              >
                <ProductCard
                  product={product}
                  categoryId={categoryId}
                  isEditor={isEditor}
                  reordering={reordering}
                  onMoveUp={reordering && i > 0 ? () => moveProduct(i, -1) : undefined}
                  onMoveDown={reordering && i < filtered.length - 1 ? () => moveProduct(i, 1) : undefined}
                  onEdit={() => { setEditingProduct(product); setDialogOpen(true); }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {isEditor && (
        <ProductDialog
          open={dialogOpen}
          product={editingProduct}
          categoryId={categoryId}
          onOpenChange={setDialogOpen}
        />
      )}
    </div>
  );
}
