import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Pencil, Trash2, GripVertical, Package, MoreVertical, Camera } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  isEditor?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function ProductCard({ product, isEditor, onEdit, onDelete, dragHandleProps }: ProductCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const qcCount = product.qcImages.length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
      className="group relative flex flex-col"
    >
      {/* Card image area */}
      <Link href={`/c/${product.categoryId}/p/${product.id}`}>
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border cursor-pointer">
          {product.mainImage ? (
            <img
              src={product.mainImage}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Package className="w-10 h-10 text-muted-foreground/25" />
            </div>
          )}

          {/* Subtle bottom gradient for badge readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* QC badge — top left */}
          {qcCount > 0 && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/65 backdrop-blur-sm border border-white/10">
              <Camera className="w-3 h-3 text-white/80" />
              <span className="text-white text-[11px] font-semibold leading-none">QC {qcCount}</span>
            </div>
          )}

          {/* Three-dot menu — top right, always visible in editor */}
          {isEditor && (
            <div
              className="absolute top-2 right-2"
              onClick={(e) => e.preventDefault()}
            >
              <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-black/65 backdrop-blur-sm border border-white/10 text-white/80 hover:text-white hover:bg-black/80 transition-colors"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border min-w-[130px]">
                  {dragHandleProps && (
                    <DropdownMenuItem asChild>
                      <div
                        {...dragHandleProps}
                        className="flex items-center gap-2 cursor-grab active:cursor-grabbing px-2 py-1.5 text-sm"
                        onClick={(e) => e.preventDefault()}
                      >
                        <GripVertical className="w-4 h-4" />
                        Drag to reorder
                      </div>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={(e) => { e.preventDefault(); onEdit?.(); }}
                    className="gap-2 cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => { e.preventDefault(); onDelete?.(); }}
                    className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </Link>

      {/* Info below image */}
      <Link href={`/c/${product.categoryId}/p/${product.id}`}>
        <div className="pt-2.5 px-0.5">
          <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-1">
            {product.name}
          </h3>
          {product.price && (
            <p className="text-primary font-bold text-sm mt-0.5">
              {product.price}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
