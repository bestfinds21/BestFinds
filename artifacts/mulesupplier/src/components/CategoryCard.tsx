import { motion } from "framer-motion";
import { Link } from "wouter";
import { Pencil, Trash2, GripVertical, Tag } from "lucide-react";
import type { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
  productCount: number;
  isEditor?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function CategoryCard({ category, productCount, isEditor, onEdit, onDelete, dragHandleProps }: CategoryCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="group relative"
    >
      <Link href={`/c/${category.id}`}>
        <div className="card-premium relative overflow-hidden rounded-2xl border border-border bg-card cursor-pointer aspect-[4/3]">
          {category.coverImage ? (
            <img
              src={category.coverImage}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-107"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/12 via-primary/6 to-transparent">
              <Tag className="w-10 h-10 text-primary/35" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

          {/* Subtle top shine */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-display font-semibold text-lg text-white drop-shadow-sm leading-tight">
              {category.name}
            </h3>
            <p className="text-white/55 text-sm mt-0.5 font-medium">
              {productCount} {productCount === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
      </Link>

      {isEditor && (
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <div
            {...dragHandleProps}
            className="p-1.5 rounded-lg backdrop-blur-sm bg-black/55 text-white/65 cursor-grab active:cursor-grabbing hover:text-white hover:bg-black/75 transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onEdit?.(); }}
            className="p-1.5 rounded-lg backdrop-blur-sm bg-black/55 text-white/65 hover:text-white hover:bg-black/75 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onDelete?.(); }}
            className="p-1.5 rounded-lg backdrop-blur-sm bg-black/55 text-red-400/75 hover:text-red-400 hover:bg-black/75 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
