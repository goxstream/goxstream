"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Eye, EyeOff, User } from "lucide-react";

interface CommentInputFormProps {
  onSubmit: (text: string, isSpoiler: boolean, guestName: string) => void;
  placeholder?: string;
  buttonLabel?: string;
  isReply?: boolean;
  onCancel?: () => void;
}

export function CommentInputForm({
  onSubmit,
  placeholder = "Share your thoughts about this episode...",
  buttonLabel = "Post Comment",
  isReply = false,
  onCancel,
}: CommentInputFormProps) {
  const [text, setText] = useState("");
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("goxstream_comment_guest_name");
      if (saved) setGuestName(saved);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const finalGuestName = guestName.trim() || "Guest Otaku";
    if (typeof window !== "undefined" && guestName.trim()) {
      localStorage.setItem("goxstream_comment_guest_name", guestName.trim());
    }

    onSubmit(text.trim(), isSpoiler, finalGuestName);
    setText("");
    setIsSpoiler(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card/60 border-border/60 flex flex-col gap-2.5 rounded-xl border p-3"
    >
      <div className="flex items-center gap-2 text-xs">
        <User className="text-primary size-3.5 shrink-0" />
        <span className="text-muted-foreground font-medium">Posting as:</span>
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Guest Otaku (optional nickname)"
          className="border-border/60 text-foreground focus:border-primary max-w-[180px] border-b bg-transparent px-1 py-0.5 text-xs font-semibold focus:outline-none"
        />
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={isReply ? 2 : 3}
        className="bg-background border-border/60 focus:ring-primary text-foreground placeholder:text-muted-foreground w-full resize-none rounded-lg border p-3 text-xs focus:ring-1 focus:outline-none"
      />

      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
        {/* Spoiler Toggle Button */}
        <button
          type="button"
          onClick={() => setIsSpoiler(!isSpoiler)}
          className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
            isSpoiler
              ? "border-amber-500/30 bg-amber-500/15 text-amber-500"
              : "bg-muted/40 text-muted-foreground hover:text-foreground border-border/60"
          }`}
        >
          {isSpoiler ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          <span>{isSpoiler ? "Spoiler Marked" : "Mark as Spoiler"}</span>
        </button>

        <div className="flex items-center gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 rounded-lg px-3 text-xs"
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            size="sm"
            disabled={!text.trim()}
            className="h-8 gap-1.5 rounded-lg px-4 text-xs font-semibold shadow-xs"
          >
            <Send className="size-3.5" />
            <span>{buttonLabel}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
