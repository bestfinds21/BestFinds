import { MoreVertical, ArrowUp, ArrowDown, Pencil, Trash2, ImageIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteCategory } from "@/store";
import type { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
  isEditor: boolean;
  reordering?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CategoryCard({
  category,
  isEditor,
  reordering,
  onMoveUp,
  onMoveDown,
  onEdit,
}: CategoryCardProps) {
  return (
    <div className="relative bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:border-primary/40 transition-colors group">
      {/* Image */}
      <div className="aspect-square bg-card-foreground/5 flex items-center justify-center overflow-hidden">
        {category.coverImage ? (
          <img
            src={category.coverImage}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
        )}
      </div>

      {/* Editor controls */}
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
                onClick={() => deleteCategory(category.id)}
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

      {/* Name */}
      <div className="p-2.5">
        <p className="text-sm font-semibold text-foreground truncate">{category.name}</p>
      </div>
    </div>
  );
}
