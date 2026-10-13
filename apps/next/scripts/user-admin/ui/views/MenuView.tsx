import React from "react";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";

interface MenuViewProps {
  onSelect: (item: { value: string }) => void;
}

export const MenuView: React.FC<MenuViewProps> = ({ onSelect }) => {
  const menuItems = [
    { label: "List All Users", value: "list" },
    { label: "Create New User", value: "create" },
    { label: "Search & Edit User", value: "edit" },
    { label: "Search & Delete Users (Multi-select)", value: "delete" },
    { label: "Switch Database Connection", value: "change_db" },
    { label: "Help & Command Options", value: "help" },
    { label: "Exit", value: "exit" },
  ];

  return (
    <Box flexDirection="column" marginY={1}>
      <Text bold color="green">
        Main Action Menu:
      </Text>
      <Box marginTop={1}>
        <SelectInput items={menuItems} onSelect={onSelect} />
      </Box>
    </Box>
  );
};
