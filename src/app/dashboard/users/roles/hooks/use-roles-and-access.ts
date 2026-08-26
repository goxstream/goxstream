import { useState } from "react";
import { MOCK_ROLES, MOCK_TEAM_MEMBERS } from "../constants";
import type { RoleDefinition, TeamMember } from "../types";

export function useRolesAndAccess() {
  const [roles, setRoles] = useState<RoleDefinition[]>(MOCK_ROLES);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS);
  const [selectedRoleSlug, setSelectedRoleSlug] = useState<string>("super_admin");

  // Modal dialog states
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleTogglePermission = (roleSlug: string, permKey: string) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) => {
        if (role.slug === roleSlug) {
          const hasPerm = role.permissions.includes(permKey);
          const nextPerms = hasPerm
            ? role.permissions.filter((k) => k !== permKey)
            : [...role.permissions, permKey];

          return { ...role, permissions: nextPerms };
        }
        return role;
      })
    );
  };

  const handleAddRole = (newRoleData: { name: string; description: string; permissions: string[] }) => {
    const slug = newRoleData.name.toLowerCase().replace(/\s+/g, "_");
    const newRole: RoleDefinition = {
      id: `role-${Date.now()}`,
      name: newRoleData.name,
      slug,
      description: newRoleData.description,
      memberCount: 0,
      permissions: newRoleData.permissions,
      isDefault: false,
    };

    setRoles((prev) => [...prev, newRole]);
    setSelectedRoleSlug(slug);
    setIsRoleModalOpen(false);
  };

  const handleInviteStaff = (staffData: { name: string; email: string; roleSlug: string }) => {
    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      name: staffData.name,
      email: staffData.email,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      roleSlug: staffData.roleSlug,
      joinedAt: new Date().toISOString(),
    };

    setTeamMembers((prev) => [newMember, ...prev]);

    // Update member count in role
    setRoles((prev) =>
      prev.map((r) => (r.slug === staffData.roleSlug ? { ...r, memberCount: r.memberCount + 1 } : r))
    );

    setIsInviteModalOpen(false);
  };

  return {
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
  };
}
