import { useState } from "react";
import { listUsers, createUser, updateUser, deleteUsersBatch } from "../db";
import type { DbTarget, UserItem, CreateUserInput } from "../types";

export function useUserManagement() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const loadUsers = async (target: DbTarget) => {
    setLoading(true);
    try {
      setUsers(await listUsers(target));
    } catch (err: any) {
      setMessage({ text: err.message || String(err), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (target: DbTarget, data: CreateUserInput) => {
    setLoading(true);
    try {
      const created = await createUser(target, data);
      setMessage({ text: `Created user '${created.username}' (${created.id})`, type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (target: DbTarget, userId: string, data: CreateUserInput) => {
    setLoading(true);
    try {
      const updated = await updateUser(target, userId, data);
      setMessage({ text: `Updated user '${updated.username}' (${updated.id})`, type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBatch = async (target: DbTarget, targetIds: string[]) => {
    setLoading(true);
    try {
      const count = await deleteUsersBatch(target, targetIds);
      setMessage({ text: `Deleted ${count} user(s) permanently`, type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    setUsers,
    loading,
    setLoading,
    message,
    setMessage,
    loadUsers,
    handleCreate,
    handleEdit,
    handleDeleteBatch,
  };
}
