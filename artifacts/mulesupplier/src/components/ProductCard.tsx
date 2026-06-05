import { Link } from "wouter";
import { MoreVertical, ShieldCheck, ArrowUp, ArrowDown, ImageIcon, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteProduct } from "@/store";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  categoryId: string;
  isEditor: boolean;
  reordering?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onEdit: () => void;
}

export function ProductCard({
  product,
  categoryId,
  isEditor,
  reordering,
  onMoveUp,
  onMoveDown,
  onEdit,
}: ProductCardProps) {
  const hasQc = product.qcImages.length > 0;

  const cardContent = (
    <div className="relative bg-card border border-border rounded-2xl overflow-hidden group cursor-pointer hover:border-primary/40 transition-colors">
      {/* Image */}
      <div className="aspect-square bg-card-foreground/5 flex items-center justify-center overflow-hidden">
        {product.mainImage ? (
          <img
            src={product.mainImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
        )}
      </div>

      {/* QC badge */}
      {hasQc && (
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-primary/90 text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
          <ShieldCheck className="h-2.5 w-2.5" />
          QC
        </div>
      )}

      {/* Three-dot menu */}
      {isEditor && !reordering && (
        <div className="absolute top-2 right-2" onClick={(e) => e.preventDefault()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-7 w-7 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors">
                <MoreVertical className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="h-3.5 w-3.5 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => deleteProduct(product.id)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Reorder arrows */}
      {reordering && (
        <div className="absolute top-2 right-2 flex flex-col gap-1" onClick={(e) => e.preventDefault()}>
          <button
            onClick={onMoveUp}
            disabled={!onMoveUp}
            className="h-6 w-6 rounded bg-black/50 hover:bg-black/70 flex items-center justify-center text-white disabled:opacity-30 transition-colors"
          >
            <ArrowUp className="h-3 w-3" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={!onMoveDown}
            className="h-6 w-6 rounded bg-black/50 hover:bg-black/70 flex items-center justify-center text-white disabled:opacity-30 transition-colors"
          >
            <ArrowDown className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Name & price */}
      <div className="p-2.5">
        <p className="text-sm font-medium text-foreground leading-tight truncate">{product.name}</p>
        <p className="text-primary font-bold text-sm mt-0.5">€{product.price}</p>
      </div>
    </div>
  );

  if (reordering) {
    return cardContent;
  }

  return (
    <Link href={`/c/${categoryId}/p/${product.id}`}>
      {cardContent}
    </Link>
  );
}
