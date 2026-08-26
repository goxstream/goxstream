import { hashPassword } from "../../src/lib/auth/password";
import { runCreateSuperAdminD1 } from "./admin-creator-d1";
import { runCreateSuperAdminPG } from "./admin-creator-pg";

function parseArgs(): Record<string, string> {
  const args: Record<string, string> = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith("--")) {
      const [key, value] = arg.slice(2).split("=");
      if (key && value) {
        args[key] = value;
      } else if (key && i + 1 < process.argv.length && !process.argv[i + 1].startsWith("--")) {
        args[key] = process.argv[i + 1];
        i++;
      }
    }
  }
  return args;
}

async function main() {
  try {
    process.loadEnvFile();
  } catch {}

  const args = parseArgs();

  const username = args.username || "superadmin";
  const email = args.email || "admin@goxstream.com";
  const rawPassword = args.password || "AdminPassword123!";
  const displayName = args["display-name"] || args.displayName || "Super Administrator";
  const isRemote = args.env === "remote" || args.remote === "true";

  console.log("=========================================================");
  console.log("[CLI SUPER ADMIN CREATOR] Generating Super Admin Credentials");
  console.log("=========================================================");

  const passwordHash = await hashPassword(rawPassword);
  const userId = `usr_admin_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

  const input = {
    id: userId,
    username,
    email,
    passwordHash,
    displayName,
    isRemote,
  };

  const connectionType = (process.env.DB_CONNECTION || "").toLowerCase();
  const dbUrl = process.env.DB_URL || process.env.DATABASE_URL;
  const targetArg = (args.target || args.db || "").toLowerCase();

  const isExplicitD1 = connectionType === "d1" || connectionType === "sqlite" || targetArg === "d1";
  const isPostgres =
    !isExplicitD1 &&
    (connectionType === "postgres" ||
      connectionType === "postgresql" ||
      Boolean(dbUrl));

  if (isPostgres) {
    await runCreateSuperAdminPG(input);
  } else {
    await runCreateSuperAdminD1(input);
  }

  console.log("=========================================================");
  console.log("SUCCESS! Created Super Admin account:");
  console.log(`- User ID:      ${userId}`);
  console.log(`- Username:     ${username}`);
  console.log(`- Email:        ${email}`);
  console.log(`- Password:     ${rawPassword}`);
  console.log(`- PasswordHash: ${passwordHash.substring(0, 20)}...`);
  console.log("=========================================================");
}

main().catch((err) => {
  console.error("[CLI SUPER ADMIN CREATOR] Unexpected error:", err);
  process.exit(1);
});
