import type { DbTarget, UserItem, CreateUserInput, UpdateUserInput } from "../types";
import { listD1Users, createD1User, updateD1User, deleteD1UsersBatch } from "./d1-adapter";
import { listPgUsers, createPgUser, updatePgUser, deletePgUsersBatch } from "./pg-adapter";

export async function listUsers(target: DbTarget, searchFilter?: string): Promise<UserItem[]> {
  if (target === "postgres") {
    return listPgUsers(searchFilter);
  }
  return listD1Users(target, searchFilter);
}

export async function getUserById(target: DbTarget, idOrUsername: string): Promise<UserItem | null> {
  const usersList = await listUsers(target);
  return (
    usersList.find((u) => u.id === idOrUsername || u.username.toLowerCase() === idOrUsername.toLowerCase()) ||
    null
  );
}

export async function createUser(target: DbTarget, input: CreateUserInput): Promise<UserItem> {
  if (target === "postgres") {
    return createPgUser(input);
  }
  return createD1User(target, input);
}

export async function updateUser(
  target: DbTarget,
  id: string,
  input: UpdateUserInput
): Promise<UserItem> {
  const existing = await getUserById(target, id);
  if (!existing) {
    throw new Error(`User with ID or username '${id}' not found.`);
  }

  if (target === "postgres") {
    return updatePgUser(existing, input);
  }
  return updateD1User(target, existing, input);
}

export async function deleteUser(target: DbTarget, id: string): Promise<boolean> {
  const count = await deleteUsersBatch(target, [id]);
  if (count === 0) {
    throw new Error(`User with ID or username '${id}' not found.`);
  }
  return true;
}

export async function deleteUsersBatch(target: DbTarget, idsOrUsernames: string[]): Promise<number> {
  if (idsOrUsernames.length === 0) return 0;
  const allUsers = await listUsers(target);
  const targetIds = allUsers
    .filter((u) => idsOrUsernames.includes(u.id) || idsOrUsernames.includes(u.username))
    .map((u) => u.id);

  if (targetIds.length === 0) return 0;

  if (target === "postgres") {
    return deletePgUsersBatch(targetIds);
  }
  return deleteD1UsersBatch(target, targetIds);
}
