import { motion } from "framer-motion";
import { MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StoreData } from "@/types";

interface StoreHeaderProps {
  store: StoreData;
  isEditor: boolean;
  onEdit: () => void;
}

export function StoreHeader({ store, isEditor, onEdit }: StoreHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 pt-8 pb-5 flex items-center gap-3"
    >
      {store.logoImage && (
        <img
          src={store.logoImage}
          alt="logo"
          className="h-10 w-10 rounded-xl object-cover flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-display font-bold text-foreground truncate">{store.storeName}</h1>
        {store.tagline && (
          <p className="text-sm text-muted-foreground truncate">{store.tagline}</p>
        )}
      </div>
      {isEditor && (
        <Button size="icon" variant="ghost" onClick={onEdit} className="flex-shrink-0">
          <Pencil className="h-4 w-4" />
        </Button>
      )}
    </motion.header>
  );
}
