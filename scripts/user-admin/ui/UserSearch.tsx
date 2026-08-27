import React, { useState } from "react";
import { Box, Text } from "ink";
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
    { label: "Cancel / Back to Menu", value: "__cancel__" },
  ];

  const handleSelect = (item: { value: string }) => {
    if (item.value === "__cancel__") {
      onCancel();
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
        <Text color="cyan">Type to filter: </Text>
        <TextInput value={query} onChange={setQuery} placeholder="Search by username, email, ID..." />
      </Box>

      <Text color="gray">Matches ({filteredUsers.length}):</Text>
      <Box marginTop={1}>
        <SelectInput items={selectItems} onSelect={handleSelect} />
      </Box>
    </Box>
  );
};
