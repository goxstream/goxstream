import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import SelectInput from "ink-select-input";
import type { UserItem } from "../types";

interface UserSearchProps {
  users: UserItem[];
  actionLabel: string;
  onSelectUser: (user: UserItem) => void;
  onCancel: () => void;
}

export const UserSearch: React.FC<UserSearchProps> = ({
  users,
  actionLabel,
  onSelectUser,
  onCancel,
}) => {
  const [query, setQuery] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);

  useInput((input, key) => {
    if (!isFiltering) {
      if (key.tab || input === "/") {
        setIsFiltering(true);
      } else if (key.escape) {
        onCancel();
      }
    }
  });

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      u.displayName.toLowerCase().includes(query.toLowerCase()) ||
      u.role.toLowerCase().includes(query.toLowerCase()) ||
      u.id.toLowerCase().includes(query.toLowerCase())
  );

  const selectItems = [
    ...filteredUsers.map((u) => ({
      label: `[${u.role.toUpperCase()}] ${u.username} (${u.email}) — ID: ${u.id}`,
      value: u.id,
    })),
    { label: "🔍 Filter Search Results", value: "__filter__" },
    { label: "Cancel / Back to Menu", value: "__cancel__" },
  ];

  const handleSelect = (item: { value: string }) => {
    if (item.value === "__cancel__") {
      onCancel();
    } else if (item.value === "__filter__") {
      setIsFiltering(true);
    } else {
      const selected = users.find((u) => u.id === item.value);
      if (selected) {
        onSelectUser(selected);
      }
    }
  };

  return (
    <Box flexDirection="column" marginY={1}>
      <Text bold color="yellow">
        Search User to {actionLabel}:
      </Text>

      <Box marginY={1}>
        <Text color={isFiltering ? "green" : "cyan"} bold={isFiltering}>
          {isFiltering ? "[Editing Filter] " : "[Filter (Tab or / to edit)]: "}
        </Text>
        {isFiltering ? (
          <TextInput
            value={query}
            onChange={setQuery}
            onSubmit={() => setIsFiltering(false)}
            placeholder="Search by username, email, ID..."
          />
        ) : (
          <Text color={query ? "white" : "gray"}>{query || "(All users)"}</Text>
        )}
      </Box>

      <Text color="gray">Matches ({filteredUsers.length}):</Text>

      {!isFiltering && (
        <Box marginTop={1}>
          <SelectInput items={selectItems} onSelect={handleSelect} />
        </Box>
      )}

      {isFiltering && (
        <Box marginTop={1}>
          <Text color="yellow">
            Press [Enter] or [Tab] when finished typing to navigate and select with Arrow Keys.
          </Text>
        </Box>
      )}
    </Box>
  );
};
