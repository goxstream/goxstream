import React, { useState } from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import SelectInput from "ink-select-input";
import type { CreateUserInput, UserItem } from "../types";

interface UserFormProps {
  initialValues?: Partial<UserItem>;
  isEdit?: boolean;
  onSubmit: (data: CreateUserInput) => void;
  onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  initialValues,
  isEdit = false,
  onSubmit,
  onCancel,
}) => {
  const [step, setStep] = useState<number>(0);
  const [username, setUsername] = useState(initialValues?.username || "");
  const [email, setEmail] = useState(initialValues?.email || "");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState(initialValues?.displayName || "");
  const [role, setRole] = useState<"super_admin" | "admin" | "user" | "moderator">(
    (initialValues?.role as any) || "user"
  );
  const [status, setStatus] = useState<"active" | "inactive" | "suspended" | "banned">(
    (initialValues?.status as any) || "active"
  );

  const roleOptions = [
    { label: "Super Admin (Full system permissions)", value: "super_admin" },
    { label: "Admin (Administrative permissions)", value: "admin" },
    { label: "User (Standard user)", value: "user" },
    { label: "Moderator (Content moderator)", value: "moderator" },
  ];

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Suspended", value: "suspended" },
    { label: "Banned", value: "banned" },
  ];

  const handleRoleSelect = (item: { value: string }) => {
    setRole(item.value as any);
    setStep((prev) => prev + 1);
  };

  const handleStatusSelect = (item: { value: string }) => {
    setStatus(item.value as any);
    setStep((prev) => prev + 1);
  };

  const steps = [
    {
      title: "Username",
      content: (
        <Box flexDirection="column">
          <Text color="cyan">Enter Username {isEdit ? `(current: ${initialValues?.username})` : ""}:</Text>
          <TextInput
            value={username}
            onChange={setUsername}
            onSubmit={() => {
              if (username.trim()) setStep((prev) => prev + 1);
            }}
          />
        </Box>
      ),
    },
    {
      title: "Email",
      content: (
        <Box flexDirection="column">
          <Text color="cyan">Enter Email {isEdit ? `(current: ${initialValues?.email})` : ""}:</Text>
          <TextInput
            value={email}
            onChange={setEmail}
            onSubmit={() => {
              if (email.trim()) setStep((prev) => prev + 1);
            }}
          />
        </Box>
      ),
    },
    {
      title: "Password",
      content: (
        <Box flexDirection="column">
          <Text color="cyan">
            {isEdit
              ? "Enter New Password (leave blank to keep current password):"
              : "Enter Password:"}
          </Text>
          <TextInput
            value={password}
            mask="*"
            onChange={setPassword}
            onSubmit={() => {
              if (isEdit || password.trim()) setStep((prev) => prev + 1);
            }}
          />
        </Box>
      ),
    },
    {
      title: "Display Name",
      content: (
        <Box flexDirection="column">
          <Text color="cyan">
            Enter Display Name {isEdit ? `(current: ${initialValues?.displayName})` : "(optional)"}:
          </Text>
          <TextInput
            value={displayName}
            onChange={setDisplayName}
            onSubmit={() => setStep((prev) => prev + 1)}
          />
        </Box>
      ),
    },
    {
      title: "Role",
      content: (
        <Box flexDirection="column">
          <Text color="cyan">Select Role:</Text>
          <SelectInput items={roleOptions} onSelect={handleRoleSelect} />
        </Box>
      ),
    },
    {
      title: "Status",
      content: (
        <Box flexDirection="column">
          <Text color="cyan">Select Account Status:</Text>
          <SelectInput items={statusOptions} onSelect={handleStatusSelect} />
        </Box>
      ),
    },
  ];

  if (step >= steps.length) {
    return (
      <Box flexDirection="column" marginY={1} borderStyle="single" borderColor="green" padding={1}>
        <Text bold color="green">
          {isEdit ? "Confirm User Update Details:" : "Confirm New User Creation Details:"}
        </Text>
        <Text>Username: {username}</Text>
        <Text>Email: {email}</Text>
        <Text>Password: {password ? "••••••••" : isEdit ? "(Unchanged)" : "(Not Set)"}</Text>
        <Text>Display Name: {displayName || username}</Text>
        <Text>Role: {role}</Text>
        <Text>Status: {status}</Text>
        <Box marginTop={1}>
          <SelectInput
            items={[
              { label: "Save User", value: "save" },
              { label: "Cancel", value: "cancel" },
            ]}
            onSelect={(item) => {
              if (item.value === "save") {
                onSubmit({
                  username,
                  email,
                  password,
                  displayName: displayName || username,
                  role,
                  status,
                });
              } else {
                onCancel();
              }
            }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginY={1}>
      <Text bold color="yellow">
        {isEdit ? `Editing User [${initialValues?.username}]` : "Creating New User"}{" "}
        (Step {step + 1}/{steps.length}: {steps[step].title})
      </Text>
      <Box marginTop={1}>{steps[step].content}</Box>
    </Box>
  );
};
