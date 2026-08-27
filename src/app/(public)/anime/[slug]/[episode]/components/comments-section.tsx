"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageSquare, Send, MessageCircle } from "lucide-react";

interface Comment {
  id: string;
  user: string;
  avatarBg: string;
  timeAgo: string;
  text: string;
  likes: number;
  isLiked?: boolean;
}

const INITIAL_COMMENTS: Comment[] = [
  {
    id: "c-1",
    user: "ShadowMonarch99",
    avatarBg: "bg-indigo-600",
    timeAgo: "2 hours ago",
    text: "The animation in the second half of this episode was absolutely peak! MAPPA/A-1 outdid themselves with the shading during the fight scenes.",
    likes: 42,
  },
  {
    id: "c-2",
    user: "AnimeExplorer",
    avatarBg: "bg-emerald-600",
    timeAgo: "4 hours ago",
    text: "That cliffhanger at the end is criminal! Can't wait for next week's episode.",
    likes: 19,
  },
  {
    id: "c-3",
    user: "OtakuSensei",
    avatarBg: "bg-rose-600",
    timeAgo: "6 hours ago",
    text: "The soundtrack transition right when the main theme dropped gave me chills. 10/10 episode!",
    likes: 28,
  },
];

export function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [newCommentText, setNewCommentText] = useState("");

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      user: "You (Guest)",
      avatarBg: "bg-primary",
      timeAgo: "Just now",
      text: newCommentText.trim(),
      likes: 0,
    };

    setComments([newComment, ...comments]);
    setNewCommentText("");
  };

  const handleLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            likes: c.isLiked ? c.likes - 1 : c.likes + 1,
            isLiked: !c.isLiked,
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="flex flex-col gap-4 mt-6 p-4 md:p-6 bg-card border border-border/60 rounded-xl shadow-xs">
      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-primary shrink-0" />
          <h2 className="text-base font-bold text-foreground">Episode Discussion</h2>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {comments.length} Comments
        </span>
      </div>

      {/* New Comment Input Form */}
      <form onSubmit={handlePostComment} className="flex flex-col gap-2">
        <div className="relative">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Share your thoughts about this episode..."
            rows={3}
            className="w-full text-xs p-3 rounded-lg bg-background border border-border/60 focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground resize-none"
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={!newCommentText.trim()}
            className="h-8 text-xs rounded-lg px-4 shadow-xs"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Post Comment
          </Button>
        </div>
      </form>

      {/* Comment List */}
      <div className="flex flex-col gap-4 mt-2">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex gap-3 p-3 rounded-lg bg-muted/20 border border-border/40"
          >
            <div
              className={`w-8 h-8 rounded-full ${comment.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
            >
              {comment.user.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-foreground">
                  {comment.user}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {comment.timeAgo}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                {comment.text}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleLike(comment.id)}
                  className={`flex items-center gap-1 text-[11px] font-mono transition-colors ${
                    comment.isLiked
                      ? "text-primary font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{comment.likes}</span>
                </button>

                <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-mono transition-colors">
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>

                <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-medium transition-colors">
                  <MessageSquare className="w-3 h-3" />
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
