import React, { useState, useEffect } from "react";
import { Box, Text, useApp } from "ink";
import Spinner from "ink-spinner";
import SelectInput from "ink-select-input";
import { Header } from "./Header";
import { DatabaseSelector } from "./DatabaseSelector";
import { UserTable } from "./UserTable";
import { UserSearch } from "./UserSearch";
import { UserForm } from "./UserForm";
import { HelpView } from "./HelpView";
import { scanAvailableDatabases } from "../db-scanner";
import { listUsers, createUser, updateUser, deleteUser } from "../db-adapter";
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

export const App: React.FC<AppProps> = ({ initialTarget, initialAction, initialFlags }) => {
  const { exit } = useApp();
  const [dbTargets, setDbTargets] = useState<DbTargetInfo[]>([]);
  const [selectedDb, setSelectedDb] = useState<DbTarget | undefined>(initialTarget);
  const [view, setView] = useState<ViewState>("SCANNING_DB");
  const [users, setUsers] = useState<UserItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function initScan() {
      const scanned = await scanAvailableDatabases();
      setDbTargets(scanned);

      if (initialTarget) {
        const found = scanned.find((t) => t.id === initialTarget && t.isAvailable);
        if (found) {
          setSelectedDb(initialTarget);
          if (initialAction === "help") {
            setView("HELP");
          } else if (initialAction === "list") {
            loadUsers(initialTarget);
          } else if (initialAction === "create") {
            setView("CREATE");
          } else {
            setView("MENU");
          }
          return;
        }
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
      const data = await listUsers(target);
      setUsers(data);
      setView("LIST");
    } catch (err: any) {
      setMessage({ text: err.message || String(err), type: "error" });
      setView("MENU");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDb = (target: DbTarget) => {
    setSelectedDb(target);
    if (initialAction === "list") {
      loadUsers(target);
    } else if (initialAction === "create") {
      setView("CREATE");
    } else if (initialAction === "help") {
      setView("HELP");
    } else {
      setView("MENU");
    }
  };

  const handleMenuSelect = async (item: { value: string }) => {
    setMessage(null);
    if (item.value === "list") {
      if (selectedDb) await loadUsers(selectedDb);
    } else if (item.value === "create") {
      setView("CREATE");
    } else if (item.value === "edit") {
      if (selectedDb) {
        setLoading(true);
        try {
          const list = await listUsers(selectedDb);
          setUsers(list);
          setView("EDIT_SEARCH");
        } catch (err: any) {
          setMessage({ text: err.message, type: "error" });
        } finally {
          setLoading(false);
        }
      }
    } else if (item.value === "delete") {
      if (selectedDb) {
        setLoading(true);
        try {
          const list = await listUsers(selectedDb);
          setUsers(list);
          setView("DELETE_SEARCH");
        } catch (err: any) {
          setMessage({ text: err.message, type: "error" });
        } finally {
          setLoading(false);
        }
      }
    } else if (item.value === "change_db") {
      setView("SELECT_DB");
    } else if (item.value === "help") {
      setView("HELP");
    } else if (item.value === "exit") {
      exit();
    }
  };

  const handleCreateSubmit = async (data: CreateUserInput) => {
    if (!selectedDb) return;
    setLoading(true);
    try {
      const created = await createUser(selectedDb, data);
      setMessage({
        text: `Successfully created user '${created.username}' (ID: ${created.id})`,
        type: "success",
      });
      setView("MENU");
    } catch (err: any) {
      setMessage({ text: `Failed to create user: ${err.message}`, type: "error" });
      setView("MENU");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (data: CreateUserInput) => {
    if (!selectedDb || !selectedUser) return;
    setLoading(true);
    try {
      const updated = await updateUser(selectedDb, selectedUser.id, data);
      setMessage({
        text: `Successfully updated user '${updated.username}' (ID: ${updated.id})`,
        type: "success",
      });
      setSelectedUser(null);
      setView("MENU");
    } catch (err: any) {
      setMessage({ text: `Failed to update user: ${err.message}`, type: "error" });
      setView("MENU");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDb || !selectedUser) return;
    setLoading(true);
    try {
      await deleteUser(selectedDb, selectedUser.id);
      setMessage({
        text: `Successfully deleted user '${selectedUser.username}' (ID: ${selectedUser.id})`,
        type: "success",
      });
      setSelectedUser(null);
      setView("MENU");
    } catch (err: any) {
      setMessage({ text: `Failed to delete user: ${err.message}`, type: "error" });
      setView("MENU");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { label: "List All Users", value: "list" },
    { label: "Create New User", value: "create" },
    { label: "Search & Edit User", value: "edit" },
    { label: "Search & Delete User", value: "delete" },
    { label: "Switch Database Connection", value: "change_db" },
    { label: "Help & Command Options", value: "help" },
    { label: "Exit", value: "exit" },
  ];

  return (
    <Box flexDirection="column" padding={1}>
      <Header dbName={selectedDb} />

      {message && (
        <Box marginY={1}>
          <Text
            bold
            color={
              message.type === "success"
                ? "green"
                : message.type === "error"
                ? "red"
                : "yellow"
            }
          >
            {message.type === "success" ? "[SUCCESS] " : message.type === "error" ? "[ERROR] " : "[INFO] "}
            {message.text}
          </Text>
        </Box>
      )}

      {view === "SCANNING_DB" && (
        <Box marginY={1}>
          <Text color="cyan">
            <Spinner type="dots" /> Scanning environment database targets...
          </Text>
        </Box>
      )}

      {view === "SELECT_DB" && (
        <DatabaseSelector targets={dbTargets} onSelect={handleSelectDb} />
      )}

      {loading && view !== "SCANNING_DB" && (
        <Box marginY={1}>
          <Text color="yellow">
            <Spinner type="dots" /> Executing database operation...
          </Text>
        </Box>
      )}

      {!loading && view === "MENU" && (
        <Box flexDirection="column" marginY={1}>
          <Text bold color="green">
            Main Action Menu:
          </Text>
          <Box marginTop={1}>
            <SelectInput items={menuItems} onSelect={handleMenuSelect} />
          </Box>
        </Box>
      )}

      {!loading && view === "LIST" && (
        <Box flexDirection="column">
          <UserTable users={users} title={`Users in ${selectedDb?.toUpperCase()}`} />
          <Box marginTop={1}>
            <SelectInput
              items={[{ label: "Back to Main Menu", value: "back" }]}
              onSelect={() => setView("MENU")}
            />
          </Box>
        </Box>
      )}

      {!loading && view === "CREATE" && (
        <UserForm onSubmit={handleCreateSubmit} onCancel={() => setView("MENU")} />
      )}

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
        <UserForm
          initialValues={selectedUser}
          isEdit={true}
          onSubmit={handleEditSubmit}
          onCancel={() => setView("MENU")}
        />
      )}

      {!loading && view === "DELETE_SEARCH" && (
        <UserSearch
          users={users}
          actionLabel="Delete"
          onSelectUser={(u) => {
            setSelectedUser(u);
            setView("DELETE_CONFIRM");
          }}
          onCancel={() => setView("MENU")}
        />
      )}

      {!loading && view === "DELETE_CONFIRM" && selectedUser && (
        <Box flexDirection="column" marginY={1} borderStyle="double" borderColor="red" padding={1}>
          <Text bold color="red">
            CONFIRM DELETE USER PERMANENTLY:
          </Text>
          <Text>ID: {selectedUser.id}</Text>
          <Text>Username: {selectedUser.username}</Text>
          <Text>Email: {selectedUser.email}</Text>
          <Text>Role: {selectedUser.role}</Text>
          <Box marginTop={1}>
            <SelectInput
              items={[
                { label: "YES, Permanently Delete User", value: "confirm" },
                { label: "Cancel & Go Back", value: "cancel" },
              ]}
              onSelect={(item) => {
                if (item.value === "confirm") {
                  handleDeleteConfirm();
                } else {
                  setView("MENU");
                }
              }}
            />
          </Box>
        </Box>
      )}

      {view === "HELP" && (
        <Box flexDirection="column">
          <HelpView />
          <Box marginTop={1}>
            <SelectInput
              items={[{ label: "Back to Main Menu", value: "back" }]}
              onSelect={() => setView("MENU")}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};
