import { eq } from "drizzle-orm";
import { getDb } from "../index";
import { users, userSettings } from "../schema";
import type { InferInsertModel } from "drizzle-orm";

export type UserSettingsInput = Partial<InferInsertModel<typeof userSettings>>;

export async function getUserById(id: string) {
  const db = await getDb();
  return db.query.users.findFirst({
    where: eq(users.id, id),
    with: {
      settings: true,
    },
  });
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  return db.query.users.findFirst({
    where: eq(users.email, email),
    with: {
      settings: true,
    },
  });
}

export async function updateUserSettings(userId: string, data: UserSettingsInput) {
  const db = await getDb();
  return db
    .insert(userSettings)
    .values({ userId, ...data })
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: data,
    })
    .returning();
}
