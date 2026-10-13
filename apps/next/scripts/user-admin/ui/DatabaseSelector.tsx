import React from "react";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import type { DbTargetInfo, DbTarget } from "../types";

interface DatabaseSelectorProps {
  targets: DbTargetInfo[];
  onSelect: (target: DbTarget) => void;
}

export const DatabaseSelector: React.FC<DatabaseSelectorProps> = ({ targets, onSelect }) => {
  const availableTargets = targets.filter((t) => t.isAvailable);

  if (availableTargets.length === 0) {
    return (
      <Box flexDirection="column" marginY={1}>
        <Text color="red" bold>
          Error: No available database connections detected!
        </Text>
        <Text color="yellow">
          Please check your .env (DB_URL / DATABASE_URL) or ensure Wrangler is initialized/logged in.
        </Text>
      </Box>
    );
  }

  const items = availableTargets.map((t) => ({
    label: `${t.name} — ${t.description}`,
    value: t.id,
  }));

  const handleSelect = (item: { value: DbTarget }) => {
    onSelect(item.value);
  };

  return (
    <Box flexDirection="column" marginY={1}>
      <Text bold color="green">
        Select Database Target Connection:
      </Text>
      <Box marginTop={1}>
        <SelectInput items={items} onSelect={handleSelect} />
      </Box>
    </Box>
  );
};
