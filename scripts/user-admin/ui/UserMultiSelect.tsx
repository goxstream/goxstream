import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import type { UserItem } from "../types";

interface UserMultiSelectProps {
  users: UserItem[];
  actionLabel: string;
  onSubmit: (selectedUsers: UserItem[]) => void;
  onCancel: () => void;
}

export const UserMultiSelect: React.FC<UserMultiSelectProps> = ({
  users,
  actionLabel,
  onSubmit,
  onCancel,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      u.displayName.toLowerCase().includes(query.toLowerCase()) ||
      u.role.toLowerCase().includes(query.toLowerCase()) ||
      u.id.toLowerCase().includes(query.toLowerCase())
  );

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
      return;
    }

    if (key.upArrow) {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, filteredUsers.length - 1)));
      return;
    }

    if (key.downArrow) {
      setSelectedIndex((prev) => (prev < filteredUsers.length - 1 ? prev + 1 : 0));
      return;
    }

    if (input === " ") {
      // Toggle current item
      const item = filteredUsers[selectedIndex];
      if (item) {
        setSelectedIds((prev) => {
          const next = new Set(prev);
          if (next.has(item.id)) {
            next.delete(item.id);
          } else {
            next.add(item.id);
          }
          return next;
        });
      }
      return;
    }

    if (input === "a" || input === "A") {
      // Select All filtered items
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredUsers.forEach((u) => next.add(u.id));
        return next;
      });
      return;
    }

    if (input === "x" || input === "X") {
      // Unselect All
      setSelectedIds(new Set());
      return;
    }

    if (key.return) {
      const selected = users.filter((u) => selectedIds.has(u.id));
      if (selected.length > 0) {
        onSubmit(selected);
      }
      return;
    }
  });

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setSelectedIndex(0);
  };

  return (
    <Box flexDirection="column" marginY={1}>
      <Text bold color="yellow">
        Multi-Select Users to {actionLabel}:
      </Text>
      
      <Box marginY={1}>
        <Text color="cyan">Filter: </Text>
        <TextInput
          value={query}
          onChange={handleQueryChange}
          placeholder="Type to search users..."
        />
      </Box>

      {filteredUsers.length === 0 ? (
        <Text color="red">No users match filter "{query}".</Text>
      ) : (
        <Box flexDirection="column">
          {filteredUsers.map((u, i) => {
            const isHighlighted = i === selectedIndex;
            const isChecked = selectedIds.has(u.id);

            return (
              <Box key={u.id}>
                <Text color={isHighlighted ? "cyan" : "gray"}>
                  {isHighlighted ? "> " : "  "}
                </Text>
                <Text color={isChecked ? "green" : "gray"} bold={isChecked}>
                  {isChecked ? "[x] " : "[ ] "}
                </Text>
                <Text color={isHighlighted ? "cyan" : "white"}>
                  [{u.role.toUpperCase()}] {u.username} ({u.email}) — ID: {u.id}
                </Text>
              </Box>
            );
          })}
        </Box>
      )}

      <Box
        marginTop={1}
        flexDirection="column"
        borderStyle="single"
        borderColor="cyan"
        paddingX={1}
      >
        <Text color="green" bold>
          Selected Count: {selectedIds.size} user(s)
        </Text>
        <Text color="gray">
          Keybindings: [space] select/unselect | [a] select all | [x] unselect all | [enter] continue | [esc] cancel
        </Text>
      </Box>
    </Box>
  );
};
