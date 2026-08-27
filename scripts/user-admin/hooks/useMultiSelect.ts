import { useState } from "react";
import { useInput } from "ink";
import type { UserItem } from "../types";

export function useMultiSelect(
  users: UserItem[],
  onSubmit: (selected: UserItem[]) => void,
  onCancel: () => void
) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isFiltering, setIsFiltering] = useState(false);

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      u.displayName.toLowerCase().includes(query.toLowerCase()) ||
      u.role.toLowerCase().includes(query.toLowerCase()) ||
      u.id.toLowerCase().includes(query.toLowerCase())
  );

  useInput((input, key) => {
    if (isFiltering) {
      if (key.return || key.tab || key.downArrow) {
        setIsFiltering(false);
      }
      return;
    }

    if (key.escape) {
      onCancel();
      return;
    }

    if (key.tab || input === "/") {
      setIsFiltering(true);
      return;
    }

    if (key.upArrow) {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, filteredUsers.length - 1)));
      return;
    }

    if (key.downArrow) {
      setSelectedIndex((prev) => (prev < filteredUsers.length - 1 ? prev + 1 : 0));
      return;
    }

    if (input === " ") {
      const item = filteredUsers[selectedIndex];
      if (item) {
        setSelectedIds((prev) => {
          const next = new Set(prev);
          if (next.has(item.id)) next.delete(item.id);
          else next.add(item.id);
          return next;
        });
      }
      return;
    }

    if (input === "a" || input === "A") {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredUsers.forEach((u) => next.add(u.id));
        return next;
      });
      return;
    }

    if (input === "x" || input === "X") {
      setSelectedIds(new Set());
      return;
    }

    if (key.return) {
      const selected = users.filter((u) => selectedIds.has(u.id));
      if (selected.length > 0) {
        onSubmit(selected);
      }
      return;
    }
  });

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setSelectedIndex(0);
  };

  return {
    query,
    handleQueryChange,
    selectedIndex,
    selectedIds,
    filteredUsers,
    isFiltering,
    setIsFiltering,
  };
}
