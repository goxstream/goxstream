"use client";

import { useState, useEffect } from "react";
import type { CategoryItem } from "@/app/dashboard/anime/categories/types";

export function useDashboardCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchCategories() {
      try {
        const res = await fetch("/api/dashboard/categories");
        if (res.ok) {
          const data = (await res.json()) as { categories?: CategoryItem[] };
          if (isMounted) {
            setCategories(data.categories || []);
          }
        }
      } catch {
        if (isMounted) setCategories([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return { categories, isLoading, setCategories };
}
