import React from "react";
import { Box, Text } from "ink";

interface HeaderProps {
  dbName?: string;
}

export const Header: React.FC<HeaderProps> = ({ dbName }) => {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={1} marginY={1}>
      <Text bold color="cyan">
        GoxStream CLI User Management System
      </Text>
      <Text color="gray">
        Cloudflare-First, Multi-Target Database Architecture (D1 / PostgreSQL)
      </Text>
      {dbName && (
        <Box marginTop={1}>
          <Text bold color="yellow">
            Connected Database Target:{" "}
          </Text>
          <Text color="green" bold>
            [{dbName.toUpperCase()}]
          </Text>
        </Box>
      )}
    </Box>
  );
};
