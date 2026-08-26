"use client";

import { useRolesAndAccess } from "./hooks/use-roles-and-access";
import { RolesHeader } from "./components/roles-header";
import { RoleCardsGrid } from "./components/role-cards-grid";
import { PermissionsMatrixTable } from "./components/permissions-matrix-table";
import { TeamMembersList } from "./components/team-members-list";
import { RoleFormDialog } from "./components/role-form-dialog";
import { InviteStaffDialog } from "./components/invite-staff-dialog";
import { PERMISSION_ITEMS } from "./constants";

export default function RolesAndAccessPage() {
  const {
    roles,
    teamMembers,
    selectedRoleSlug,
    setSelectedRoleSlug,
    isRoleModalOpen,
    setIsRoleModalOpen,
    isInviteModalOpen,
    setIsInviteModalOpen,
    handleTogglePermission,
    handleAddRole,
    handleInviteStaff,
  } = useRolesAndAccess();

  return (
    <div className="flex flex-col gap-6 p-6">
      <RolesHeader
        onOpenCreateRole={() => setIsRoleModalOpen(true)}
        onOpenInviteStaff={() => setIsInviteModalOpen(true)}
      />
      <RoleCardsGrid
        roles={roles}
        selectedRoleSlug={selectedRoleSlug}
        onSelectRole={setSelectedRoleSlug}
      />
      <PermissionsMatrixTable
        roles={roles}
        permissions={PERMISSION_ITEMS}
        selectedRoleSlug={selectedRoleSlug}
        onTogglePermission={handleTogglePermission}
      />
      <TeamMembersList members={teamMembers} roles={roles} />
      <RoleFormDialog
        isOpen={isRoleModalOpen}
        onOpenChange={setIsRoleModalOpen}
        onSaveRole={handleAddRole}
      />
      <InviteStaffDialog
        isOpen={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        roles={roles}
        onInviteStaff={handleInviteStaff}
      />
    </div>
  );
}
