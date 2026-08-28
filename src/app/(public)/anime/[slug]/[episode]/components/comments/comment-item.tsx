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
      <div className="flex gap-3 p-3.5 rounded-xl bg-card border border-border/60 shadow-xs transition-all hover:border-border">
        {/* User Avatar */}
        <div className={`size-8 rounded-full ${comment.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}>
          {comment.user.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header Info */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs font-bold text-foreground truncate">{comment.user}</span>
              {comment.isGuest && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-mono">
                  Guest
                </span>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0">{comment.timeAgo}</span>
          </div>

          {/* Comment Content (Discord / Reddit Style Blur Sensor Mask or Clean) */}
          {comment.isSpoiler ? (
            <div
              onClick={() => setIsSpoilerRevealed(!isSpoilerRevealed)}
              className="relative group cursor-pointer my-1 mb-2.5 inline-block w-full overflow-hidden rounded-lg border border-border/40 transition-colors hover:border-border"
            >
              <p className={`text-xs leading-relaxed p-2.5 whitespace-pre-line transition-all duration-300 ${
                isSpoilerRevealed
                  ? "text-muted-foreground blur-none select-text bg-background/40"
                  : "text-transparent bg-muted/80 backdrop-blur-md select-none blur-sm"
              }`}>
                {comment.text}
              </p>

              {!isSpoilerRevealed && (
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 text-xs font-semibold text-foreground/90 bg-background/50 backdrop-blur-xs transition-opacity group-hover:bg-background/40">
                  <EyeOff className="size-3.5 text-primary shrink-0" />
                  <span>Contains Spoiler — Click to reveal</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground leading-relaxed mb-2.5 whitespace-pre-line">
              {comment.text}
            </p>
          )}

          {/* Action Toolbar */}
          <div className="flex items-center justify-between gap-2 flex-wrap text-[11px] pt-1 border-t border-border/40">
            <div className="flex items-center gap-3">
              {/* Like Button */}
              <button
                type="button"
                onClick={() => onLike(comment.id)}
                className={`flex items-center gap-1 font-mono transition-colors ${
                  comment.isLiked ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
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
                  comment.isDisliked ? "text-destructive font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ThumbsDown className="size-3.5" />
              </button>

              {/* Reply Button */}
              <button
                type="button"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1 text-muted-foreground hover:text-primary font-medium transition-colors"
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
                reported ? "text-emerald-500 font-semibold" : "text-muted-foreground/80 hover:text-destructive"
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
        <div className="border-l-2 border-primary/20 dark:border-border/60 pl-3 sm:pl-4 space-y-2.5 ml-3 sm:ml-4">
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
