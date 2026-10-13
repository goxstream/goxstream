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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 bg-card/60 p-3 rounded-xl border border-border/60">
      <div className="flex items-center gap-2 text-xs">
        <User className="size-3.5 text-primary shrink-0" />
        <span className="text-muted-foreground font-medium">Posting as:</span>
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Guest Otaku (optional nickname)"
          className="bg-transparent border-b border-border/60 text-foreground font-semibold px-1 py-0.5 text-xs focus:outline-none focus:border-primary max-w-[180px]"
        />
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={isReply ? 2 : 3}
        className="w-full text-xs p-3 rounded-lg bg-background border border-border/60 focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground resize-none"
      />

      <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5">
        {/* Spoiler Toggle Button */}
        <button
          type="button"
          onClick={() => setIsSpoiler(!isSpoiler)}
          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md font-medium transition-colors border ${
            isSpoiler
              ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
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
              className="h-8 text-xs rounded-lg px-3"
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            size="sm"
            disabled={!text.trim()}
            className="h-8 text-xs rounded-lg px-4 shadow-xs font-semibold gap-1.5"
          >
            <Send className="size-3.5" />
            <span>{buttonLabel}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
