"use client";

import { useState, useMemo } from "react";
import { UserDirectoryHeader } from "./components/user-directory-header";
import { UserDirectoryStats } from "./components/user-directory-stats";
import { UserDirectoryFilters } from "./components/user-directory-filters";
import { UserDirectoryTable } from "./components/user-directory-table";
import { UserDetailSheet } from "./components/user-detail-sheet";
import { MOCK_USERS } from "./constants";
import type { UserAccount, UserFilters } from "./types";

export default function UserDirectoryPage() {
  const [users, setUsers] = useState<UserAccount[]>(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    role: "all",
    status: "all",
    membershipTier: "all",
  });

  const handleFilterChange = (newFilters: Partial<UserFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      role: "all",
      status: "all",
      membershipTier: "all",
    });
  };

  const handleSelectUser = (user: UserAccount) => {
    setSelectedUser(user);
    setIsSheetOpen(true);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === "suspended" ? "active" : "suspended";
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );

    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser((prev) =>
        prev
          ? {
              ...prev,
              status: prev.status === "suspended" ? "active" : "suspended",
            }
          : null
      );
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Search filter
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(query);
        const matchesEmail = u.email.toLowerCase().includes(query);
        const matchesUsername = u.username.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesUsername) return false;
      }

      // Role filter
      if (filters.role !== "all" && u.role !== filters.role) {
        return false;
      }

      // Status filter
      if (filters.status !== "all" && u.status !== filters.status) {
        return false;
      }

      // Membership tier filter
      if (filters.membershipTier !== "all" && u.membershipTier !== filters.membershipTier) {
        return false;
      }

      return true;
    });
  }, [users, filters]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <UserDirectoryHeader />
      <UserDirectoryStats users={users} />
      <UserDirectoryFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />
      <UserDirectoryTable
        users={filteredUsers}
        onSelectUser={handleSelectUser}
        onToggleStatus={handleToggleStatus}
      />
      <UserDetailSheet
        user={selectedUser}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}
