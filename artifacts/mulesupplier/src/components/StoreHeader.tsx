import { motion } from "framer-motion";
import { MoreHorizontal, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemePicker } from "@/components/ThemePicker";
import type { StoreData } from "@/types";

interface StoreHeaderProps {
  store: StoreData;
  isEditor?: boolean;
  onEdit?: () => void;
}

export function StoreHeader({ store, isEditor, onEdit }: StoreHeaderProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 relative">
      {/* Theme picker */}
      <div className="absolute top-4 left-4">
        <ThemePicker />
      </div>

      {/* Three-dot editor menu */}
      {isEditor && (
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem onClick={onEdit} className="gap-2 cursor-pointer">
                <Pencil className="w-4 h-4" />
                Edit name & logo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="mb-7"
      >
        {store.logoImage ? (
          <img
            src={store.logoImage}
            alt={store.storeName}
            className="logo-glow w-24 h-24 rounded-3xl object-cover border border-primary/25"
          />
        ) : (
          <div className="relative w-28 h-28 flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl logo-glow" />
            <div className="relative w-full h-full rounded-3xl bg-primary/15 border border-primary/25 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
              <span className="relative text-5xl select-none">🐴</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Name */}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-foreground mb-2"
      >
        {store.storeName}
      </motion.h1>

      {/* Tagline */}
      {store.tagline && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className="text-muted-foreground font-medium text-base"
        >
          {store.tagline}
        </motion.p>
      )}
    </div>
  );
}
