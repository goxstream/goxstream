# GoxStream CLI User Management System (`pnpm user-admin`)

A powerful, modern, hybrid (Interactive Ink TUI + Non-Interactive Flags) CLI tool for managing users across **Cloudflare D1 (Local & Remote)** and **PostgreSQL** databases.

---

## Key Features

- **Hybrid Execution Modes**:
  - **Interactive TUI Mode**: Full terminal user interface built with [Ink](https://github.com/vadimdemedes/ink) (React for CLIs) featuring step-by-step forms, live user search, CLI tables, and confirmation dialogs.
  - **Non-Interactive / Headless Mode**: Fast, direct command execution with CLI flags for CI/CD, deployment scripts, or automated workflows.
- **Dynamic Multi-Database Auto-Detection**:
  - Automatically scans environment variables and Wrangler state at startup.
  - Detects **PostgreSQL** (`DB_URL` / `DATABASE_URL` in `.env`).
  - Detects **Cloudflare D1 (Local)** (Miniflare SQLite storage).
  - Detects **Cloudflare D1 (Remote)** (Cloudflare production instance via Wrangler login).
  - Only displays available/connected target databases for selection.
- **Role & Account Status Management**:
  - Roles: `super_admin`, `admin`, `user`, `moderator`.
  - Account Status: `active`, `inactive`, `suspended`, `banned`.
  - Automatically handles PBKDF2-HMAC-SHA256 password hashing and populates `user_settings`.

---

## Quick Start

### 1. Interactive TUI Mode
Simply run the script without required arguments:
```bash
pnpm user-admin
```
The CLI will automatically scan for available databases and present an interactive menu to list, create, edit, or delete users.

### 2. Direct Flag Mode
To quickly create a Super Admin user directly:
```bash
pnpm user-admin create --username=admin --email=admin@goxstream.com --password=AdminPassword123! --role=super_admin
```

---

## CLI Commands Reference

### `list` — Display Users in CLI Table
Lists users formatted inside a clean CLI table.

- **Interactive**: Select `List All Users` from main menu.
- **Non-Interactive**:
  ```bash
  # List users in PostgreSQL
  pnpm user-admin list --db=postgres

  # List users in D1 Local
  pnpm user-admin list --db=d1-local

  # List users in D1 Remote
  pnpm user-admin list --db=d1-remote
  ```

---

### `create` — Create New User
Creates a new user with hashed password and default settings.

- **Interactive**: Select `Create New User` from main menu and complete the step-by-step form.
- **Non-Interactive**:
  ```bash
  pnpm user-admin create \
    --username=admin_john \
    --email=john@goxstream.com \
    --password=SecretPass123! \
    --role=admin \
    --status=active \
    --display-name="John Admin" \
    --db=postgres
  ```

---

### `edit` — Search & Update User
Modifies user fields (role, status, display name, email, or password).

- **Interactive**: Select `Search & Edit User`, type to filter user list in real-time, select user, and update fields.
- **Non-Interactive**:
  ```bash
  pnpm user-admin edit \
    --username=admin_john \
    --role=super_admin \
    --status=active \
    --db=postgres
  ```

---

### `delete` — Multi-Select & Batch Delete Users
Permanently removes single or multiple users and their settings from the target database.

- **Interactive Multi-Select Keyboard Controls**:
  - `[space]`: Toggle selection for highlighted item `[x]` / `[ ]`
  - `[a]`: Select all visible filtered items
  - `[x]`: Unselect all items
  - `[enter]`: Confirm selected items & open delete confirmation modal
  - `[esc]`: Cancel and return to menu
- **Non-Interactive**:
  ```bash
  # Delete single user
  pnpm user-admin delete --username=admin_john --db=postgres

  # Batch delete multiple users (comma-separated)
  pnpm user-admin delete --username=user1,user2,user3 --db=postgres
  ```

---

### `help` — Show Documentation
Displays command help and usage examples.
```bash
pnpm user-admin help
```

---

## Options & Flags Reference

| Flag | Short | Type | Description | Default |
| --- | --- | --- | --- | --- |
| `--db` | `-d` | `string` | Target database (`postgres`, `d1-local`, `d1-remote`) | Auto-detected |
| `--username` | `-u` | `string` | Target username for create/edit/delete | — |
| `--email` | `-e` | `string` | Email address for create/edit | — |
| `--password` | `-p` | `string` | Plaintext password (will be hashed automatically) | — |
| `--role` | `-r` | `string` | User role (`super_admin`, `admin`, `user`, `moderator`) | `user` |
| `--status` | `-s` | `string` | Account status (`active`, `inactive`, `suspended`, `banned`) | `active` |
| `--display-name` | `-n` | `string` | Display name for user | Username |
| `--non-interactive` | — | `boolean` | Forces headless execution without TUI | `false` |

---

## Database Target Detection Matrix

| Target ID | Target Name | Detection Criteria |
| --- | --- | --- |
| `postgres` | PostgreSQL Database | Checks `DB_URL` or `DATABASE_URL` in `.env` and tests connection |
| `d1-local` | Cloudflare D1 (Local) | Checks `.wrangler/state/v3/d1` & tests `wrangler d1 execute --local` |
| `d1-remote` | Cloudflare D1 (Remote) | Checks `wrangler whoami` login & tests `wrangler d1 execute --remote` |

---

## Architecture & Directory Structure

```
scripts/user-admin/
├── README.md                 # Dedicated CLI documentation
├── package.json              # Scoped ESM config
├── index.tsx                 # Lean CLI entrypoint (~40 lines)
├── db-scanner.ts             # Target detection scanner (~70 lines)
├── types.ts                  # Shared TypeScript definitions (~35 lines)
├── db/                       # Database Adapters (< 90 lines each)
│   ├── d1-adapter.ts         # D1 SQLite query execution
│   ├── pg-adapter.ts         # PostgreSQL Drizzle ORM operations
│   └── index.ts              # Unified DB access facade
├── cli/                      # Non-Interactive CLI Handlers (< 80 lines each)
│   └── handlers.ts           # Non-interactive CLI command handlers
└── ui/                       # React Ink UI Components (< 80 lines each)
    ├── App.tsx               # Root TUI Router & State Engine
    ├── Header.tsx            # Header Banner Component
    ├── DatabaseSelector.tsx  # DB Target Selection Component
    ├── UserTable.tsx         # CLI Table Renderer
    ├── UserSearch.tsx        # Real-time Single User Search
    ├── UserMultiSelect.tsx   # Interactive Multi-Select Checklist
    ├── UserForm.tsx          # Step-by-step Input Form
    ├── HelpView.tsx          # CLI Documentation View
    └── views/                # Modular Sub-Views
        ├── MenuView.tsx      # Main Menu View
        └── DeleteConfirmModal.tsx # Delete Confirmation Modal
```
