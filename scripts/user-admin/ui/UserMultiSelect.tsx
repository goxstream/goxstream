import React from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import { useMultiSelect } from "../hooks/useMultiSelect";
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
  const { query, handleQueryChange, selectedIndex, selectedIds, filteredUsers, isFiltering, setIsFiltering } =
    useMultiSelect(users, onSubmit, onCancel);

  return (
    <Box flexDirection="column" marginY={1}>
      <Text bold color="yellow">
        Multi-Select Users to {actionLabel}:
      </Text>

      <Box marginY={1}>
        <Text color={isFiltering ? "green" : "cyan"} bold={isFiltering}>
          {isFiltering ? "[Typing Filter] " : "[Filter: / or Tab to Edit] "}
        </Text>
        {isFiltering ? (
          <TextInput
            value={query}
            onChange={handleQueryChange}
            onSubmit={() => setIsFiltering(false)}
            placeholder="Type search query..."
          />
        ) : (
          <Text color={query ? "white" : "gray"}>{query || "(No filter active)"}</Text>
        )}
      </Box>

      {filteredUsers.length === 0 ? (
        <Text color="red">No users match filter "{query}".</Text>
      ) : (
        <Box flexDirection="column">
          {filteredUsers.map((u, i) => {
            const isHighlighted = i === selectedIndex && !isFiltering;
            const isChecked = selectedIds.has(u.id);

            return (
              <Box key={u.id}>
                <Text color={isHighlighted ? "cyan" : "gray"}>{isHighlighted ? "> " : "  "}</Text>
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

      <Box marginTop={1} flexDirection="column" borderStyle="single" borderColor="cyan" paddingX={1}>
        <Text color="green" bold>
          Selected Count: {selectedIds.size} user(s)
        </Text>
        <Text color="gray">
          {isFiltering
            ? "Press [Enter] or [Tab] when finished typing to return to navigation"
            : "Keybindings: [space] select/unselect | [a] select all | [x] unselect all | [/] or [Tab] filter | [enter] continue | [esc] cancel"}
        </Text>
      </Box>
    </Box>
  );
};
