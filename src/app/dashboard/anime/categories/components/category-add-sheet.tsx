"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { NativeSelect } from "@/components/ui/native-select";
import type { FormatCategoryCode, GenreGroup } from "../types";

interface CategoryAddSheetProps {
  open: boolean;
  type: "category" | "genre";
  onOpenChange: (open: boolean) => void;
  onAddCategory: (data: { code: FormatCategoryCode; name: string; slug: string; description: string }) => void;
  onAddGenre: (data: { name: string; slug: string; group: GenreGroup; description: string }) => void;
}

export function CategoryAddSheet({
  open,
  type,
  onOpenChange,
  onAddCategory,
  onAddGenre,
}: CategoryAddSheetProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState<FormatCategoryCode>("TV");
  const [group, setGroup] = useState<GenreGroup>("Main Genre");
  const [description, setDescription] = useState("");

  const handleSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = handleSlug(name);
    if (type === "category") {
      onAddCategory({ code, name, slug, description });
    } else {
      onAddGenre({ name, slug, group, description });
    }

    setName("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md flex flex-col gap-6">
        <SheetHeader>
          <SheetTitle>
            {type === "category" ? "Add New Category Format" : "Add New Genre Tag"}
          </SheetTitle>
          <SheetDescription>
            {type === "category"
              ? "Create a primary anime media release format classification."
              : "Define a taxonomy genre or demographic theme tag."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Display Name</FieldLabel>
              <Input
                id="name"
                placeholder={type === "category" ? "e.g. Original Net Animation" : "e.g. Psychological"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field>

            {type === "category" ? (
              <Field>
                <FieldLabel htmlFor="code">Format Code</FieldLabel>
                <NativeSelect
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value as FormatCategoryCode)}
                >
                  <option value="TV">TV Series</option>
                  <option value="MOVIE">Movie</option>
                  <option value="OVA">OVA</option>
                  <option value="ONA">ONA</option>
                  <option value="SPECIAL">Special</option>
                  <option value="MUSIC">Music</option>
                </NativeSelect>
              </Field>
            ) : (
              <Field>
                <FieldLabel htmlFor="group">Genre Group</FieldLabel>
                <NativeSelect
                  id="group"
                  value={group}
                  onChange={(e) => setGroup(e.target.value as GenreGroup)}
                >
                  <option value="Main Genre">Main Genre</option>
                  <option value="Demographic">Demographic</option>
                  <option value="Theme">Theme</option>
                  <option value="Explicit">Explicit</option>
                </NativeSelect>
              </Field>
            )}

            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                placeholder="Brief explanation of this taxonomy classification..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </Field>
          </FieldGroup>

          <SheetFooter className="mt-auto">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save {type === "category" ? "Category" : "Genre"}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
