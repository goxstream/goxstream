import React from "react";
import { Box, Text } from "ink";

export const HelpView: React.FC = () => {
  return (
    <Box flexDirection="column" marginY={1} borderStyle="round" borderColor="yellow" padding={1}>
      <Text bold color="yellow">
        GoxStream User Management CLI — Help & Documentation
      </Text>
      <Box marginTop={1} flexDirection="column">
        <Text bold color="cyan">
          Usage Syntax:
        </Text>
        <Text color="white">  pnpm user-admin [command] [options]</Text>

        <Box marginTop={1} flexDirection="column">
          <Text bold color="cyan">
            Available Commands:
          </Text>
          <Text color="green">  list               <Text color="white">Display list of users in a CLI table</Text></Text>
          <Text color="green">  create             <Text color="white">Create a new user (super_admin, admin, user, etc.)</Text></Text>
          <Text color="green">  edit               <Text color="white">Search and edit existing user details</Text></Text>
          <Text color="green">  delete             <Text color="white">Multi-select and delete users in batch</Text></Text>
          <Text color="green">  help               <Text color="white">Show this help menu</Text></Text>
        </Box>

        <Box marginTop={1} flexDirection="column">
          <Text bold color="cyan">
            Multi-Select Keyboard Shortcuts (Delete Mode):
          </Text>
          <Text color="white">  [space]            Toggle select/unselect highlighted item [x] / [ ]</Text>
          <Text color="white">  [a]                Select all visible filtered items</Text>
          <Text color="white">  [x]                Unselect all items</Text>
          <Text color="white">  [enter]            Confirm selected users and proceed</Text>
          <Text color="white">  [esc]              Cancel and return to menu</Text>
        </Box>

        <Box marginTop={1} flexDirection="column">
          <Text bold color="cyan">
            Command Options / Flags:
          </Text>
          <Text color="white">  --db               Database connection target ("postgres" | "d1-local" | "d1-remote")</Text>
          <Text color="white">  --username         Username for create/edit/delete (supports comma-separated for delete)</Text>
          <Text color="white">  --email            User email address</Text>
          <Text color="white">  --password         Plaintext password</Text>
          <Text color="white">  --role             Role ("super_admin" | "admin" | "user" | "moderator")</Text>
          <Text color="white">  --status           Account status ("active" | "inactive" | "suspended" | "banned")</Text>
          <Text color="white">  --display-name     User display name</Text>
          <Text color="white">  --non-interactive  Run headlessly without interactive TUI</Text>
        </Box>

        <Box marginTop={1} flexDirection="column">
          <Text bold color="cyan">
            Examples:
          </Text>
          <Text color="gray">  # 1. Interactive TUI (scans DBs automatically):</Text>
          <Text color="white">  pnpm user-admin</Text>
          <Text color="gray">  # 2. Non-interactive Super Admin Creation:</Text>
          <Text color="white">  pnpm user-admin create --username=admin2 --email=admin2@goxstream.com --password=Pass123! --role=super_admin --db=postgres</Text>
          <Text color="gray">  # 3. Batch Delete Users Non-Interactively:</Text>
          <Text color="white">  pnpm user-admin delete --username=user1,user2 --db=postgres</Text>
        </Box>
      </Box>
    </Box>
  );
};
