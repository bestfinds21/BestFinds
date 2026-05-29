import { useSyncExternalStore, useState } from "react";
import { motion, AnimatePresence, Reorder, useDragControls } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreHeader } from "@/components/StoreHeader";
import { CategoryCard } from "@/components/CategoryCard";
import { EditStoreDialog } from "@/components/dialogs/EditStoreDialog";
import { CategoryDialog } from "@/components/dialogs/CategoryDialog";
import { loadStore, subscribe, actions } from "@/store";
import type { Category } from "@/types";
import { toast } from "sonner";

interface HomePageProps {
  isEditor: boolean;
}

function DraggableCategoryItem({
  cat,
  productCount,
  isEditor,
  onEdit,
  onDelete,
}: {
  cat: Category;
  productCount: number;
  isEditor: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item value={cat} dragListener={false} dragControls={controls}>
      <CategoryCard
        category={cat}
        productCount={productCount}
        isEditor={isEditor}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={{ onPointerDown: (e: React.PointerEvent) => controls.start(e) }}
      />
    </Reorder.Item>
  );
}

export function HomePage({ isEditor }: HomePageProps) {
  const store = useSyncExternalStore(subscribe, loadStore);
  const [editStoreOpen, setEditStoreOpen] = useState(false);
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>(store.categories);

  const storeCategories = store.categories;
  if (JSON.stringify(categories.map((c) => c.id)) !== JSON.stringify(storeCategories.map((c) => c.id))) {
    setCategories(storeCategories);
  }

  function handleReorder(newOrder: Category[]) {
    setCategories(newOrder);
    actions.reorderCategories(newOrder.map((c) => c.id));
  }

  function handleDeleteCategory(id: string) {
    if (!confirm("Delete this category and all its products?")) return;
    actions.deleteCategory(id);
    toast.success("Category deleted");
  }

  function handleShare() {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => toast.success("Link copied to clipboard"))
      .catch(() => toast.error("Could not copy link"));
  }

  return (
    <>
      <div className="min-h-[100dvh] pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <StoreHeader
            store={store}
            isEditor={isEditor}
            onEdit={() => setEditStoreOpen(true)}
            onShare={handleShare}
          />

          <div className="mt-2">
            {isEditor ? (
              <Reorder.Group
                axis="y"
                values={categories}
                onReorder={handleReorder}
                className="grid grid-cols-2 sm:grid-cols-3 gap-4"
              >
                <AnimatePresence>
                  {categories.map((cat) => {
                    const count = store.products.filter((p) => p.categoryId === cat.id).length;
                    return (
                      <DraggableCategoryItem
                        key={cat.id}
                        cat={cat}
                        productCount={count}
                        isEditor={isEditor}
                        onEdit={() => {
                          setEditingCat(cat);
                          setCatDialogOpen(true);
                        }}
                        onDelete={() => handleDeleteCategory(cat.id)}
                      />
                    );
                  })}
                </AnimatePresence>
              </Reorder.Group>
            ) : (
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AnimatePresence>
                  {store.categories.map((cat) => {
                    const count = store.products.filter((p) => p.categoryId === cat.id).length;
                    return (
                      <CategoryCard
                        key={cat.id}
                        category={cat}
                        productCount={count}
                        isEditor={false}
                      />
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}

            {store.categories.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg">No categories yet.</p>
                {isEditor && <p className="text-sm mt-1">Click "Add category" to get started.</p>}
              </div>
            )}
          </div>

          {isEditor && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex justify-center"
            >
              <Button
                onClick={() => {
                  setEditingCat(null);
                  setCatDialogOpen(true);
                }}
                className="rounded-full gap-2 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
              >
                <Plus className="w-4 h-4" />
                Add category
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      <EditStoreDialog open={editStoreOpen} onOpenChange={setEditStoreOpen} store={store} />
      <CategoryDialog open={catDialogOpen} onOpenChange={setCatDialogOpen} editing={editingCat} />
    </>
  );
}
