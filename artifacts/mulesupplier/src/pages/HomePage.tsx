import { useSyncExternalStore, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Plus, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { subscribeStore, getStore, reorderCategories } from "@/store";
import { CategoryCard } from "@/components/CategoryCard";
import { CategoryDialog } from "@/components/dialogs/CategoryDialog";
import { EditStoreDialog } from "@/components/dialogs/EditStoreDialog";
import { StoreHeader } from "@/components/StoreHeader";
import { ThemePicker } from "@/components/ThemePicker";
import type { Category } from "@/types";

export function HomePage({ isEditor }: { isEditor: boolean }) {
  const store = useSyncExternalStore(subscribeStore, getStore);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [editStoreOpen, setEditStoreOpen] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [order, setOrder] = useState<Category[]>([]);

  function startReorder() {
    setOrder([...store.categories]);
    setReordering(true);
  }

  function moveCategory(index: number, dir: -1 | 1) {
    const next = [...order];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
  }

  function saveReorder() {
    reorderCategories(order);
    setReordering(false);
  }

  const cats = reordering ? order : store.categories;

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader
        store={store}
        isEditor={isEditor}
        onEdit={() => setEditStoreOpen(true)}
      />

      <div className="max-w-2xl mx-auto px-4 pb-24">
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
                <Button size="sm" onClick={() => { setEditingCat(null); setDialogOpen(true); }}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Category
                </Button>
              </>
            )}
          </div>
        )}

        {cats.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground text-lg">
              {isEditor ? "No categories yet. Add your first one!" : "No categories yet."}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {cats.map((cat, i) => (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
              >
                {reordering ? (
                  <CategoryCard
                    category={cat}
                    isEditor={isEditor}
                    reordering
                    onMoveUp={i > 0 ? () => moveCategory(i, -1) : undefined}
                    onMoveDown={i < cats.length - 1 ? () => moveCategory(i, 1) : undefined}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                ) : (
                  <Link href={`/c/${cat.id}`}>
                    <CategoryCard
                      category={cat}
                      isEditor={isEditor}
                      onEdit={() => { setEditingCat(cat); setDialogOpen(true); }}
                      onDelete={() => {}}
                    />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {isEditor && (
        <>
          <ThemePicker />
          <CategoryDialog
            open={dialogOpen}
            category={editingCat}
            onOpenChange={setDialogOpen}
          />
          <EditStoreDialog
            open={editStoreOpen}
            store={store}
            onOpenChange={setEditStoreOpen}
          />
        </>
      )}
    </div>
  );
}
