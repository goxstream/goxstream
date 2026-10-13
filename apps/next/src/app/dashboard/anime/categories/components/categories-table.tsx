"use client";

import { Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CategoryItem } from "../types";

interface CategoriesTableProps {
  categories: CategoryItem[];
  onToggleStatus: (id: string) => void;
  onDeleteCategory: (id: string) => void;
  onEditCategory: (category: CategoryItem) => void;
}

export function CategoriesTable({
  categories,
  onToggleStatus,
  onDeleteCategory,
  onEditCategory,
}: CategoriesTableProps) {
  return (
    <div className="border-border/60 bg-card/60 overflow-hidden rounded-xl border shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="border-border/60 hover:bg-transparent">
            <TableHead className="w-[100px]">Code</TableHead>
            <TableHead>Category Name</TableHead>
            <TableHead className="hidden md:table-cell">Slug</TableHead>
            <TableHead className="text-right">Anime Count</TableHead>
            <TableHead className="hidden lg:table-cell">Description</TableHead>
            <TableHead className="w-[100px] text-center">Status</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow
              key={category.id}
              className="border-border/40 hover:bg-muted/40 transition-colors"
            >
              <TableCell className="font-mono text-xs font-semibold">
                <Badge variant="outline" className="rounded-md font-mono">
                  {category.code}
                </Badge>
              </TableCell>

              <TableCell>
                <span className="text-foreground text-sm font-semibold">{category.name}</span>
              </TableCell>

              <TableCell className="text-muted-foreground hidden font-mono text-xs md:table-cell">
                {category.slug}
              </TableCell>

              <TableCell className="text-foreground text-right text-sm font-medium">
                {category.animeCount.toLocaleString()}
              </TableCell>

              <TableCell className="text-muted-foreground hidden max-w-xs truncate text-xs lg:table-cell">
                {category.description}
              </TableCell>

              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Switch
                    checked={category.isActive}
                    onCheckedChange={() => onToggleStatus(category.id)}
                    aria-label={`Toggle ${category.name} status`}
                  />
                </div>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditCategory(category)}
                    className="text-muted-foreground hover:text-foreground size-8 rounded-lg"
                  >
                    <Edit2 className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteCategory(category.id)}
                    className="text-muted-foreground hover:text-destructive size-8 rounded-lg"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
