"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare, AlertCircle, Eye, EyeOff, Check } from "lucide-react";
import { CommentInputForm } from "./comment-input-form";

export interface CommentData {
  id: string;
  user: string;
  isGuest?: boolean;
  avatarBg: string;
  timeAgo: string;
  text: string;
  likes: number;
  dislikes?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  isSpoiler?: boolean;
  replies?: CommentData[];
}

interface CommentItemProps {
  comment: CommentData;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  onReplySubmit: (parentId: string, text: string, isSpoiler: boolean, guestName: string) => void;
}

export function CommentItem({ comment, onLike, onDislike, onReplySubmit }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isSpoilerRevealed, setIsSpoilerRevealed] = useState(false);
  const [reported, setReported] = useState(false);

  const handleReport = () => {
    setReported(true);
    setTimeout(() => setReported(false), 3000);
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="bg-card border-border/60 hover:border-border flex gap-3 rounded-xl border p-3.5 shadow-xs transition-all">
        {/* User Avatar */}
        <div
          className={`size-8 rounded-full ${comment.avatarBg} flex shrink-0 items-center justify-center text-xs font-bold text-white shadow-xs`}
        >
          {comment.user.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          {/* Header Info */}
          <div className="mb-1 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="text-foreground truncate text-xs font-bold">{comment.user}</span>
              {comment.isGuest && (
                <span className="py-0.2 bg-muted text-muted-foreground rounded px-1.5 font-mono text-[9px]">
                  Guest
                </span>
              )}
            </div>
            <span className="text-muted-foreground shrink-0 text-[10px]">{comment.timeAgo}</span>
          </div>

          {/* Comment Content (Discord / Reddit Style Blur Sensor Mask or Clean) */}
          {comment.isSpoiler ? (
            <div
              onClick={() => setIsSpoilerRevealed(!isSpoilerRevealed)}
              className="group border-border/40 hover:border-border relative my-1 mb-2.5 inline-block w-full cursor-pointer overflow-hidden rounded-lg border transition-colors"
            >
              <p
                className={`p-2.5 text-xs leading-relaxed whitespace-pre-line transition-all duration-300 ${
                  isSpoilerRevealed
                    ? "text-muted-foreground bg-background/40 blur-none select-text"
                    : "bg-muted/80 text-transparent blur-sm backdrop-blur-md select-none"
                }`}
              >
                {comment.text}
              </p>

              {!isSpoilerRevealed && (
                <div className="text-foreground/90 bg-background/50 group-hover:bg-background/40 absolute inset-0 flex items-center justify-center gap-1.5 text-xs font-semibold backdrop-blur-xs transition-opacity">
                  <EyeOff className="text-primary size-3.5 shrink-0" />
                  <span>Contains Spoiler — Click to reveal</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground mb-2.5 text-xs leading-relaxed whitespace-pre-line">
              {comment.text}
            </p>
          )}

          {/* Action Toolbar */}
          <div className="border-border/40 flex flex-wrap items-center justify-between gap-2 border-t pt-1 text-[11px]">
            <div className="flex items-center gap-3">
              {/* Like Button */}
              <button
                type="button"
                onClick={() => onLike(comment.id)}
                className={`flex items-center gap-1 font-mono transition-colors ${
                  comment.isLiked
                    ? "text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ThumbsUp className="size-3.5" />
                <span>{comment.likes}</span>
              </button>

              {/* Dislike Button */}
              <button
                type="button"
                onClick={() => onDislike(comment.id)}
                className={`flex items-center gap-1 font-mono transition-colors ${
                  comment.isDisliked
                    ? "text-destructive font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ThumbsDown className="size-3.5" />
              </button>

              {/* Reply Button */}
              <button
                type="button"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-muted-foreground hover:text-primary flex items-center gap-1 font-medium transition-colors"
              >
                <MessageSquare className="size-3" />
                <span>Reply</span>
              </button>
            </div>

            {/* Report Comment Button */}
            <button
              type="button"
              onClick={handleReport}
              className={`flex items-center gap-1 text-[10px] transition-colors ${
                reported
                  ? "font-semibold text-emerald-500"
                  : "text-muted-foreground/80 hover:text-destructive"
              }`}
            >
              {reported ? <Check className="size-3" /> : <AlertCircle className="size-3" />}
              <span>{reported ? "Reported" : "Report"}</span>
            </button>
          </div>

          {/* Reply Input Form */}
          {showReplyForm && (
            <div className="mt-3">
              <CommentInputForm
                isReply={true}
                placeholder={`Reply to @${comment.user}...`}
                buttonLabel="Post Reply"
                onCancel={() => setShowReplyForm(false)}
                onSubmit={(text, isSpoiler, guestName) => {
                  onReplySubmit(comment.id, text, isSpoiler, guestName);
                  setShowReplyForm(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Nested Thread Replies (Reddit / Threads Style) */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="border-primary/20 dark:border-border/60 ml-3 space-y-2.5 border-l-2 pl-3 sm:ml-4 sm:pl-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onDislike={onDislike}
              onReplySubmit={onReplySubmit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
