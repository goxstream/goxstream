import React from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import SelectInput from "ink-select-input";
import { useUserForm } from "../hooks/useUserForm";
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
  const form = useUserForm(initialValues);

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

  const steps = [
    {
      title: "Username",
      content: (
        <Box flexDirection="column">
          <Text color="cyan">Enter Username {isEdit ? `(current: ${initialValues?.username})` : ""}:</Text>
          <TextInput
            value={form.username}
            onChange={form.setUsername}
            onSubmit={() => form.username.trim() && form.nextStep()}
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
            value={form.email}
            onChange={form.setEmail}
            onSubmit={() => form.email.trim() && form.nextStep()}
          />
        </Box>
      ),
    },
    {
      title: "Password",
      content: (
        <Box flexDirection="column">
          <Text color="cyan">
            {isEdit ? "Enter New Password (leave blank to keep current):" : "Enter Password:"}
          </Text>
          <TextInput
            value={form.password}
            mask="*"
            onChange={form.setPassword}
            onSubmit={() => (isEdit || form.password.trim()) && form.nextStep()}
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
          <TextInput value={form.displayName} onChange={form.setDisplayName} onSubmit={form.nextStep} />
        </Box>
      ),
    },
    {
      title: "Role",
      content: (
        <Box flexDirection="column">
          <Text color="cyan">Select Role:</Text>
          <SelectInput
            items={roleOptions}
            onSelect={(item) => {
              form.setRole(item.value as any);
              form.nextStep();
            }}
          />
        </Box>
      ),
    },
    {
      title: "Status",
      content: (
        <Box flexDirection="column">
          <Text color="cyan">Select Account Status:</Text>
          <SelectInput
            items={statusOptions}
            onSelect={(item) => {
              form.setStatus(item.value as any);
              form.nextStep();
            }}
          />
        </Box>
      ),
    },
  ];

  if (form.step >= steps.length) {
    return (
      <Box flexDirection="column" marginY={1} borderStyle="single" borderColor="green" padding={1}>
        <Text bold color="green">
          {isEdit ? "Confirm User Update Details:" : "Confirm New User Creation Details:"}
        </Text>
        <Text>Username: {form.username}</Text>
        <Text>Email: {form.email}</Text>
        <Text>Password: {form.password ? "••••••••" : isEdit ? "(Unchanged)" : "(Not Set)"}</Text>
        <Text>Display Name: {form.displayName || form.username}</Text>
        <Text>Role: {form.role}</Text>
        <Text>Status: {form.status}</Text>
        <Box marginTop={1}>
          <SelectInput
            items={[
              { label: "Save User", value: "save" },
              { label: "Cancel", value: "cancel" },
            ]}
            onSelect={(item) => {
              if (item.value === "save") {
                onSubmit({
                  username: form.username,
                  email: form.email,
                  password: form.password,
                  displayName: form.displayName || form.username,
                  role: form.role,
                  status: form.status,
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
        (Step {form.step + 1}/{steps.length}: {steps[form.step].title})
      </Text>
      <Box marginTop={1}>{steps[form.step].content}</Box>
    </Box>
  );
};
