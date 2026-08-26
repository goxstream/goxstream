import type { RoleDefinition, PermissionItem, TeamMember } from "./types";
import { ROLE_DEFAULT_SCOPES } from "@/lib/auth/permissions";

export const PERMISSION_ITEMS: PermissionItem[] = [
  {
    id: "perm-1",
    key: "anime:read",
    name: "View Anime Catalog",
    description: "Browse and read anime series titles and metadata",
    category: "content",
  },
  {
    id: "perm-2",
    key: "anime:create",
    name: "Create Anime Series",
    description: "Add new anime series titles and cover artwork",
    category: "content",
  },
  {
    id: "perm-3",
    key: "anime:update",
    name: "Edit Anime Titles",
    description: "Update existing anime synopses, metadata, and banners",
    category: "content",
  },
  {
    id: "perm-4",
    key: "anime:delete",
    name: "Delete Anime Series",
    description: "Permanently remove anime titles from the database",
    category: "content",
  },
  {
    id: "perm-5",
    key: "episodes:publish",
    name: "Publish Video Episodes",
    description: "Upload and publish video streams to Cloudflare R2 / CDN",
    category: "content",
  },
  {
    id: "perm-6",
    key: "comments:moderate",
    name: "Moderate Comments",
    description: "Approve, delete, or mute toxic user comments & reports",
    category: "community",
  },
  {
    id: "perm-7",
    key: "users:suspend",
    name: "Suspend & Manage Accounts",
    description: "Suspend user accounts, reset passwords, and manage staff",
    category: "users",
  },
  {
    id: "perm-8",
    key: "analytics:read",
    name: "View Platform Analytics",
    description: "Access bandwidth, CDN usage, and watch time statistics",
    category: "analytics",
  },
  {
    id: "perm-9",
    key: "system:update",
    name: "Configure System & Secrets",
    description: "Manage D1 Database, Cloudflare Workers, and API keys",
    category: "system",
  },
];

export const MOCK_ROLES: RoleDefinition[] = [
  {
    id: "role-1",
    name: "Super Admin",
    slug: "super_admin",
    description: "Full unrestricted access to all platform features, infrastructure, and billing.",
    memberCount: 2,
    permissions: ROLE_DEFAULT_SCOPES.super_admin,
    isDefault: false,
  },
  {
    id: "role-2",
    name: "Content Manager",
    slug: "content_manager",
    description: "Responsible for uploading anime series, managing episodes, and metadata.",
    memberCount: 5,
    permissions: ROLE_DEFAULT_SCOPES.content_manager,
    isDefault: true,
  },
  {
    id: "role-3",
    name: "Community Moderator",
    slug: "moderator",
    description: "Focuses on maintaining community guidelines and managing reported comments.",
    memberCount: 8,
    permissions: ROLE_DEFAULT_SCOPES.moderator,
    isDefault: false,
  },
  {
    id: "role-4",
    name: "Analytics Viewer",
    slug: "analytics_viewer",
    description: "Read-only access to watch time, audience metrics, and CDN statistics.",
    memberCount: 3,
    permissions: ["analytics:read"],
    isDefault: false,
  },
];

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "team-1",
    name: "Alex Vance",
    email: "alex.vance@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    roleSlug: "super_admin",
    joinedAt: "2024-01-15T08:30:00Z",
  },
  {
    id: "team-2",
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    roleSlug: "moderator",
    joinedAt: "2024-03-22T14:15:00Z",
  },
  {
    id: "team-3",
    name: "Kenji Sato",
    email: "kenji.sato@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    roleSlug: "content_manager",
    joinedAt: "2024-05-10T11:20:00Z",
  },
];
