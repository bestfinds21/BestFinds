import { motion } from "framer-motion";
import { Link } from "wouter";
import { Pencil, Trash2, GripVertical, Package } from "lucide-react";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  isEditor?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function ProductCard({ product, isEditor, onEdit, onDelete, dragHandleProps }: ProductCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="group relative"
    >
      <Link href={`/c/${product.categoryId}/p/${product.id}`}>
        <div className="card-premium overflow-hidden rounded-2xl border border-border bg-card cursor-pointer">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            {product.mainImage ? (
              <img
                src={product.mainImage}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-107"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="w-10 h-10 text-muted-foreground/25" />
              </div>
            )}
            {/* Shine on hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Info */}
          <div className="p-3.5">
            <h3 className="font-semibold text-sm text-foreground truncate leading-snug">
              {product.name}
            </h3>
            {product.price && (
              <span className="inline-block mt-2 px-2.5 py-0.5 bg-primary/12 text-primary font-semibold text-sm rounded-lg border border-primary/18">
                {product.price}
              </span>
            )}
            {product.notes && (
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                {product.notes}
              </p>
            )}
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
