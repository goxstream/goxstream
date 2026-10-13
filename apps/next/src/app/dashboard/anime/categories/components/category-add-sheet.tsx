"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
                <Select value={code} onValueChange={(val) => val && setCode(val as FormatCategoryCode)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select format code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TV">TV Series</SelectItem>
                    <SelectItem value="MOVIE">Movie</SelectItem>
                    <SelectItem value="OVA">OVA</SelectItem>
                    <SelectItem value="ONA">ONA</SelectItem>
                    <SelectItem value="SPECIAL">Special</SelectItem>
                    <SelectItem value="MUSIC">Music</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            ) : (
              <Field>
                <FieldLabel htmlFor="group">Genre Group</FieldLabel>
                <Select value={group} onValueChange={(val) => val && setGroup(val as GenreGroup)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select genre group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Genre">Main Genre</SelectItem>
                    <SelectItem value="Demographic">Demographic</SelectItem>
                    <SelectItem value="Theme">Theme</SelectItem>
                    <SelectItem value="Explicit">Explicit</SelectItem>
                  </SelectContent>
                </Select>
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
