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
import { useDbScan } from "../hooks/useDbScan";
import { useUserManagement } from "../hooks/useUserManagement";
import type { DbTarget, UserItem } from "../types";

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
  const { dbTargets, selectedDb, setSelectedDb, isScanning } = useDbScan(initialTarget);
  const userMgmt = useUserManagement();

  const [view, setView] = useState<ViewState>("SCANNING_DB");
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<UserItem[]>([]);

  useEffect(() => {
    if (!isScanning) {
      if (initialAction === "help") {
        setView("HELP");
      } else if (initialAction === "list" && selectedDb) {
        userMgmt.loadUsers(selectedDb).then(() => setView("LIST"));
      } else if (initialAction === "create") {
        setView("CREATE");
      } else if (!selectedDb) {
        setView("SELECT_DB");
      } else {
        setView("MENU");
      }
    }
  }, [isScanning]);

  const handleMenuSelect = async (item: { value: string }) => {
    userMgmt.setMessage(null);
    if (!selectedDb) {
      setView("SELECT_DB");
      return;
    }
    if (item.value === "list") {
      await userMgmt.loadUsers(selectedDb);
      setView("LIST");
    } else if (item.value === "create") setView("CREATE");
    else if (item.value === "change_db") setView("SELECT_DB");
    else if (item.value === "help") setView("HELP");
    else if (item.value === "exit") exit();
    else if (item.value === "edit" || item.value === "delete") {
      await userMgmt.loadUsers(selectedDb);
      setView(item.value === "edit" ? "EDIT_SEARCH" : "DELETE_SEARCH");
    }
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Header dbName={selectedDb} />

      {userMgmt.message && (
        <Box marginY={1}>
          <Text bold color={userMgmt.message.type === "success" ? "green" : "red"}>
            {userMgmt.message.type === "success" ? "[SUCCESS] " : "[ERROR] "}
            {userMgmt.message.text}
          </Text>
        </Box>
      )}

      {(isScanning || userMgmt.loading) && (
        <Box marginY={1}>
          <Text color="cyan">
            <Spinner type="dots" /> {isScanning ? "Scanning environment database targets..." : "Executing operation..."}
          </Text>
        </Box>
      )}

      {!isScanning && !userMgmt.loading && view === "SELECT_DB" && (
        <DatabaseSelector
          targets={dbTargets}
          onSelect={(t) => {
            setSelectedDb(t);
            setView("MENU");
          }}
        />
      )}

      {!isScanning && !userMgmt.loading && view === "MENU" && <MenuView onSelect={handleMenuSelect} />}

      {!isScanning && !userMgmt.loading && view === "LIST" && (
        <Box flexDirection="column">
          <UserTable users={userMgmt.users} title={`Users in ${selectedDb?.toUpperCase()}`} />
          <Box marginTop={1}>
            <SelectInput items={[{ label: "Back to Main Menu", value: "back" }]} onSelect={() => setView("MENU")} />
          </Box>
        </Box>
      )}

      {!isScanning && !userMgmt.loading && view === "CREATE" && (
        <UserForm
          onSubmit={async (data) => {
            if (selectedDb) await userMgmt.handleCreate(selectedDb, data);
            setView("MENU");
          }}
          onCancel={() => setView("MENU")}
        />
      )}

      {!isScanning && !userMgmt.loading && view === "EDIT_SEARCH" && (
        <UserSearch
          users={userMgmt.users}
          actionLabel="Edit"
          onSelectUser={(u) => {
            setSelectedUser(u);
            setView("EDIT_FORM");
          }}
          onCancel={() => setView("MENU")}
        />
      )}

      {!isScanning && !userMgmt.loading && view === "EDIT_FORM" && selectedUser && (
        <UserForm
          initialValues={selectedUser}
          isEdit
          onSubmit={async (data) => {
            if (selectedDb) await userMgmt.handleEdit(selectedDb, selectedUser.id, data);
            setSelectedUser(null);
            setView("MENU");
          }}
          onCancel={() => setView("MENU")}
        />
      )}

      {!isScanning && !userMgmt.loading && view === "DELETE_SEARCH" && (
        <UserMultiSelect
          users={userMgmt.users}
          actionLabel="Delete"
          onSubmit={(sel) => {
            setSelectedUsers(sel);
            setView("DELETE_CONFIRM");
          }}
          onCancel={() => setView("MENU")}
        />
      )}

      {!isScanning && !userMgmt.loading && view === "DELETE_CONFIRM" && selectedUsers.length > 0 && (
        <DeleteConfirmModal
          selectedUsers={selectedUsers}
          onConfirm={async () => {
            if (selectedDb) await userMgmt.handleDeleteBatch(selectedDb, selectedUsers.map((u) => u.id));
            setSelectedUsers([]);
            setView("MENU");
          }}
          onCancel={() => setView("MENU")}
        />
      )}

      {!isScanning && !userMgmt.loading && view === "HELP" && (
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
