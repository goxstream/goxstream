import { useState } from "react";
import type { UserItem } from "../types";

export function useUserForm(initialValues?: Partial<UserItem>) {
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

  const nextStep = () => setStep((prev) => prev + 1);

  return {
    step,
    nextStep,
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    displayName,
    setDisplayName,
    role,
    setRole,
    status,
    setStatus,
  };
}
