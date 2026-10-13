import React from "react";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import type { UserItem } from "../../types";

interface DeleteConfirmModalProps {
  selectedUsers: UserItem[];
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  selectedUsers,
  onConfirm,
  onCancel,
}) => {
  return (
    <Box flexDirection="column" marginY={1} borderStyle="double" borderColor="red" padding={1}>
      <Text bold color="red">
        CONFIRM DELETE {selectedUsers.length} USER(S) PERMANENTLY:
      </Text>
      <Box marginY={1} flexDirection="column">
        {selectedUsers.map((u) => (
          <Text key={u.id} color="yellow">
            - [{u.role.toUpperCase()}] {u.username} ({u.email}) — ID: {u.id}
          </Text>
        ))}
      </Box>
      <Box marginTop={1}>
        <SelectInput
          items={[
            { label: `YES, Permanently Delete ${selectedUsers.length} User(s)`, value: "confirm" },
            { label: "Cancel & Go Back", value: "cancel" },
          ]}
          onSelect={(item) => {
            if (item.value === "confirm") {
              onConfirm();
            } else {
              onCancel();
            }
          }}
        />
      </Box>
    </Box>
  );
};
