"use client";

import { useUserDirectory } from "./hooks/use-user-directory";
import { UserDirectoryHeader } from "./components/user-directory-header";
import { UserDirectoryStats } from "./components/user-directory-stats";
import { UserDirectoryFilters } from "./components/user-directory-filters";
import { UserDirectoryTable } from "./components/user-directory-table";
import { UserDetailSheet } from "./components/user-detail-sheet";
import { UserFormSheet } from "./components/user-form-sheet";

export default function UserDirectoryPage() {
  const {
    users,
    filteredUsers,
    selectedUser,
    isDetailSheetOpen,
    setIsDetailSheetOpen,
    isFormSheetOpen,
    setIsFormSheetOpen,
    editingUser,
    filters,
    handleFilterChange,
    handleResetFilters,
    handleSelectUser,
    handleOpenAddUser,
    handleOpenEditUser,
    handleToggleStatus,
    handleSaveUser,
  } = useUserDirectory();

  return (
    <div className="flex flex-col gap-6 p-6">
      <UserDirectoryHeader onAddUser={handleOpenAddUser} />
      <UserDirectoryStats users={users} />
      <UserDirectoryFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />
      <UserDirectoryTable
        users={filteredUsers}
        onSelectUser={handleSelectUser}
        onEditUser={handleOpenEditUser}
        onToggleStatus={handleToggleStatus}
      />
      <UserDetailSheet
        user={selectedUser}
        isOpen={isDetailSheetOpen}
        onOpenChange={setIsDetailSheetOpen}
        onToggleStatus={handleToggleStatus}
      />
      <UserFormSheet
        isOpen={isFormSheetOpen}
        onOpenChange={setIsFormSheetOpen}
        editingUser={editingUser}
        onSave={handleSaveUser}
      />
    </div>
  );
}
