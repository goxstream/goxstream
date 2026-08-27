import React, { useState, useEffect } from "react";
import { Box, Text, useApp } from "ink";
import Spinner from "ink-spinner";
import SelectInput from "ink-select-input";
import { Header } from "./Header";
import { DatabaseSelector } from "./DatabaseSelector";
import { UserTable } from "./UserTable";
import { UserSearch } from "./UserSearch";
import { UserMultiSelect } from "./UserMultiSelect";
import { UserForm } from "./UserForm";
import { HelpView } from "./HelpView";
import { MenuView } from "./views/MenuView";
import { DeleteConfirmModal } from "./views/DeleteConfirmModal";
import { scanAvailableDatabases } from "../db-scanner";
import { listUsers, createUser, updateUser, deleteUsersBatch } from "../db";
import type { DbTargetInfo, DbTarget, UserItem, CreateUserInput } from "../types";

interface AppProps {
  initialTarget?: DbTarget;
  initialAction?: string;
  initialFlags?: Record<string, any>;
}

type ViewState =
  | "SCANNING_DB"
  | "SELECT_DB"
  | "MENU"
  | "LIST"
  | "CREATE"
  | "EDIT_SEARCH"
  | "EDIT_FORM"
  | "DELETE_SEARCH"
  | "DELETE_CONFIRM"
  | "HELP";

export const App: React.FC<AppProps> = ({ initialTarget, initialAction }) => {
  const { exit } = useApp();
  const [dbTargets, setDbTargets] = useState<DbTargetInfo[]>([]);
  const [selectedDb, setSelectedDb] = useState<DbTarget | undefined>(initialTarget);
  const [view, setView] = useState<ViewState>("SCANNING_DB");
  const [users, setUsers] = useState<UserItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<UserItem[]>([]);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function initScan() {
      const scanned = await scanAvailableDatabases();
      setDbTargets(scanned);

      if (initialTarget && scanned.some((t) => t.id === initialTarget && t.isAvailable)) {
        setSelectedDb(initialTarget);
        if (initialAction === "help") setView("HELP");
        else if (initialAction === "list") loadUsers(initialTarget);
        else if (initialAction === "create") setView("CREATE");
        else setView("MENU");
        return;
      }

      const available = scanned.filter((t) => t.isAvailable);
      if (available.length === 1) {
        setSelectedDb(available[0].id);
        setView("MENU");
      } else {
        setView("SELECT_DB");
      }
    }
    initScan();
  }, []);

  const loadUsers = async (target: DbTarget) => {
    setLoading(true);
    try {
      setUsers(await listUsers(target));
      setView("LIST");
    } catch (err: any) {
      setMessage({ text: err.message || String(err), type: "error" });
      setView("MENU");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuSelect = async (item: { value: string }) => {
    setMessage(null);
    if (!selectedDb) return;
    if (item.value === "list") await loadUsers(selectedDb);
    else if (item.value === "create") setView("CREATE");
    else if (item.value === "change_db") setView("SELECT_DB");
    else if (item.value === "help") setView("HELP");
    else if (item.value === "exit") exit();
    else if (item.value === "edit" || item.value === "delete") {
      setLoading(true);
      try {
        setUsers(await listUsers(selectedDb));
        setView(item.value === "edit" ? "EDIT_SEARCH" : "DELETE_SEARCH");
      } catch (err: any) {
        setMessage({ text: err.message, type: "error" });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreate = async (data: CreateUserInput) => {
    if (!selectedDb) return;
    setLoading(true);
    try {
      const created = await createUser(selectedDb, data);
      setMessage({ text: `Created user '${created.username}' (${created.id})`, type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
      setView("MENU");
    }
  };

  const handleEdit = async (data: CreateUserInput) => {
    if (!selectedDb || !selectedUser) return;
    setLoading(true);
    try {
      const updated = await updateUser(selectedDb, selectedUser.id, data);
      setMessage({ text: `Updated user '${updated.username}' (${updated.id})`, type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setSelectedUser(null);
      setLoading(false);
      setView("MENU");
    }
  };

  const handleDelete = async () => {
    if (!selectedDb || selectedUsers.length === 0) return;
    setLoading(true);
    try {
      const count = await deleteUsersBatch(selectedDb, selectedUsers.map((u) => u.id));
      setMessage({ text: `Deleted ${count} user(s) permanently`, type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setSelectedUsers([]);
      setLoading(false);
      setView("MENU");
    }
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Header dbName={selectedDb} />

      {message && (
        <Box marginY={1}>
          <Text bold color={message.type === "success" ? "green" : "red"}>
            {message.type === "success" ? "[SUCCESS] " : "[ERROR] "}
            {message.text}
          </Text>
        </Box>
      )}

      {(view === "SCANNING_DB" || loading) && (
        <Box marginY={1}>
          <Text color="cyan">
            <Spinner type="dots" /> {view === "SCANNING_DB" ? "Scanning environment..." : "Executing operation..."}
          </Text>
        </Box>
      )}

      {!loading && view === "SELECT_DB" && (
        <DatabaseSelector
          targets={dbTargets}
          onSelect={(t) => {
            setSelectedDb(t);
            setView("MENU");
          }}
        />
      )}

      {!loading && view === "MENU" && <MenuView onSelect={handleMenuSelect} />}

      {!loading && view === "LIST" && (
        <Box flexDirection="column">
          <UserTable users={users} title={`Users in ${selectedDb?.toUpperCase()}`} />
          <Box marginTop={1}>
            <SelectInput items={[{ label: "Back to Main Menu", value: "back" }]} onSelect={() => setView("MENU")} />
          </Box>
        </Box>
      )}

      {!loading && view === "CREATE" && <UserForm onSubmit={handleCreate} onCancel={() => setView("MENU")} />}

      {!loading && view === "EDIT_SEARCH" && (
        <UserSearch
          users={users}
          actionLabel="Edit"
          onSelectUser={(u) => {
            setSelectedUser(u);
            setView("EDIT_FORM");
          }}
          onCancel={() => setView("MENU")}
        />
      )}

      {!loading && view === "EDIT_FORM" && selectedUser && (
        <UserForm initialValues={selectedUser} isEdit onSubmit={handleEdit} onCancel={() => setView("MENU")} />
      )}

      {!loading && view === "DELETE_SEARCH" && (
        <UserMultiSelect
          users={users}
          actionLabel="Delete"
          onSubmit={(sel) => {
            setSelectedUsers(sel);
            setView("DELETE_CONFIRM");
          }}
          onCancel={() => setView("MENU")}
        />
      )}

      {!loading && view === "DELETE_CONFIRM" && selectedUsers.length > 0 && (
        <DeleteConfirmModal selectedUsers={selectedUsers} onConfirm={handleDelete} onCancel={() => setView("MENU")} />
      )}

      {view === "HELP" && (
        <Box flexDirection="column">
          <HelpView />
          <Box marginTop={1}>
            <SelectInput items={[{ label: "Back to Main Menu", value: "back" }]} onSelect={() => setView("MENU")} />
          </Box>
        </Box>
      )}
    </Box>
  );
};
