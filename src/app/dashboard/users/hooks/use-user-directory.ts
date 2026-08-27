import { useState, useEffect, useMemo } from "react";
import { useDashboardUsers } from "@/hooks/use-dashboard-users";
import type { UserAccount, UserFilters, MembershipTier } from "../types";

export function useUserDirectory() {
  const { users: fetchedProfiles, isLoading } = useDashboardUsers();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  
  // Form sheet state (Add & Edit)
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  useEffect(() => {
    if (fetchedProfiles) {
      const mapped: UserAccount[] = fetchedProfiles.map((p) => ({
        id: p.id,
        name: p.displayName,
        username: p.username,
        email: p.email,
        avatar: p.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        role: "user",
        status: "active",
        membershipTier: (p.isVip ? "vip" : "free") as MembershipTier,
        createdAt: p.joinDate || "2025-01-01",
        lastActiveAt: "Just now",
        watchHistory: {
          totalWatchedEpisodes: p.stats?.episodesWatched || 0,
          totalWatchTimeHours: p.stats?.hoursWatched || 0,
          favoriteGenre: p.stats?.favoriteGenres?.[0]?.genre || "Action",
          lastWatchedTitle: "Jujutsu Kaisen S2",
          lastWatchedAt: "2 hours ago",
        },
      }));
      setUsers(mapped);
    }
  }, [fetchedProfiles]);


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
    setIsDetailSheetOpen(true);
  };

  const handleOpenAddUser = () => {
    setEditingUser(null);
    setIsFormSheetOpen(true);
  };

  const handleOpenEditUser = (user: UserAccount) => {
    setEditingUser(user);
    setIsFormSheetOpen(true);
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

  const handleSaveUser = (userData: Partial<UserAccount>) => {
    if (editingUser) {
      // Edit mode
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? ({ ...u, ...userData } as UserAccount) : u))
      );
    } else {
      // Add mode
      const newUser: UserAccount = {
        id: `usr-${Date.now()}`,
        name: userData.name || "New User",
        username: userData.username || "newuser",
        email: userData.email || "user@example.com",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        role: userData.role || "user",
        status: userData.status || "active",
        membershipTier: userData.membershipTier || "free",
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        watchHistory: {
          totalWatchedEpisodes: 0,
          totalWatchTimeHours: 0,
          favoriteGenre: "None",
          lastWatchedTitle: "None",
          lastWatchedAt: "-",
        },
      };
      setUsers((prev) => [newUser, ...prev]);
    }
    setIsFormSheetOpen(false);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(query);
        const matchesEmail = u.email.toLowerCase().includes(query);
        const matchesUsername = u.username.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesUsername) return false;
      }
      if (filters.role !== "all" && u.role !== filters.role) return false;
      if (filters.status !== "all" && u.status !== filters.status) return false;
      if (filters.membershipTier !== "all" && u.membershipTier !== filters.membershipTier) return false;

      return true;
    });
  }, [users, filters]);

  return {
    users,
    filteredUsers,
    selectedUser,
    isDetailSheetOpen,
    setIsDetailSheetOpen,
    isFormSheetOpen,
    setIsFormSheetOpen,
    editingUser,
    filters,
    isLoading,
    handleFilterChange,
    handleResetFilters,
    handleSelectUser,
    handleOpenAddUser,
    handleOpenEditUser,
    handleToggleStatus,
    handleSaveUser,
  };
}
