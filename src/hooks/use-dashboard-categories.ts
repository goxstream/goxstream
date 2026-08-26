"use client";

import { useState, useEffect } from "react";
import { MOCK_CATEGORIES } from "@/app/dashboard/anime/categories/constants";
import type { CategoryItem } from "@/app/dashboard/anime/categories/types";

export function useDashboardCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>(MOCK_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchCategories() {
      try {
        const res = await fetch("/api/dashboard/categories");
        if (res.ok) {
          const data = (await res.json()) as { categories?: CategoryItem[] };
          if (isMounted && data.categories && data.categories.length > 0) {
            setCategories(data.categories);
          }
        }
      } catch {
        // Fallback
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
