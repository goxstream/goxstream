"use client";

import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { CommentInputForm } from "./comments/comment-input-form";
import { CommentItem, type CommentData } from "./comments/comment-item";

interface CommentsSectionProps {
  animeId?: string;
  episodeId?: string;
}

const DEMO_COMMENTS: CommentData[] = [
  {
    id: "c-1",
    user: "ShadowMonarch99",
    avatarBg: "bg-indigo-600",
    timeAgo: "2 hours ago",
    text: "The animation in the second half of this episode was absolutely peak! MAPPA/A-1 outdid themselves with the shading during the fight scenes.",
    likes: 42,
    replies: [
      {
        id: "c-1-1",
        user: "SoloLevelingFan",
        avatarBg: "bg-purple-600",
        timeAgo: "1 hour ago",
        text: "Totally agree! The camera rotation in 3D background was insane.",
        likes: 12,
      },
    ],
  },
  {
    id: "c-2",
    user: "AnimeExplorer",
    avatarBg: "bg-emerald-600",
    timeAgo: "4 hours ago",
    text: "That cliffhanger at the end is criminal! Can't wait for next week's episode.",
    likes: 19,
    isSpoiler: true,
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

export function CommentsSection({ animeId, episodeId }: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentData[]>(DEMO_COMMENTS);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch real comments from database API endpoint if episodeId is provided
  useEffect(() => {
    if (!episodeId) return;

    let isMounted = true;
    setIsLoading(true);

    fetch(`/api/comments?episodeId=${encodeURIComponent(episodeId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: any) => {
        if (isMounted && data && Array.isArray(data.comments) && data.comments.length > 0) {
          // Transform DB rows to CommentData structure
          const dbCommentsMap = new Map<string, CommentData>();
          const roots: CommentData[] = [];

          data.comments.forEach((row: any) => {
            dbCommentsMap.set(row.id, {
              id: row.id,
              user: row.guestName || "Otaku Fan",
              isGuest: !row.userId,
              avatarBg: "bg-primary",
              timeAgo: new Date(row.createdAt).toLocaleDateString(),
              text: row.content,
              likes: 0,
              isSpoiler: Boolean(row.isSpoiler),
              replies: [],
            });
          });

          data.comments.forEach((row: any) => {
            const commentObj = dbCommentsMap.get(row.id);
            if (!commentObj) return;

            if (row.parentId && dbCommentsMap.has(row.parentId)) {
              const parent = dbCommentsMap.get(row.parentId);
              if (parent) {
                parent.replies = parent.replies || [];
                parent.replies.push(commentObj);
              }
            } else {
              roots.push(commentObj);
            }
          });

          setComments(roots);
        }
      })
      .catch((err) => {
        console.error("Could not fetch real comments, keeping demo data:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [episodeId]);

  const countTotalComments = (list: CommentData[]): number => {
    return list.reduce((total, c) => {
      const replyCount = c.replies ? countTotalComments(c.replies) : 0;
      return total + 1 + replyCount;
    }, 0);
  };

  const handlePostRootComment = async (text: string, isSpoiler: boolean, guestName: string) => {
    const newComment: CommentData = {
      id: `c-${Date.now()}`,
      user: guestName,
      isGuest: true,
      avatarBg: "bg-primary",
      timeAgo: "Just now",
      text,
      likes: 0,
      isSpoiler,
    };
    setComments([newComment, ...comments]);

    // Send to DB endpoint asynchronously if ids exist
    if (animeId && episodeId) {
      try {
        await fetch("/api/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            animeId,
            episodeId,
            content: text,
            isSpoiler,
            guestName,
          }),
        });
      } catch (e) {
        console.error("Failed to post comment to DB API:", e);
      }
    }
  };

  const handleAddReply = async (parentId: string, text: string, isSpoiler: boolean, guestName: string) => {
    const newReply: CommentData = {
      id: `reply-${Date.now()}`,
      user: guestName,
      isGuest: true,
      avatarBg: "bg-primary",
      timeAgo: "Just now",
      text,
      likes: 0,
      isSpoiler,
    };

    const addReplyRecursive = (list: CommentData[]): CommentData[] => {
      return list.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            replies: [...(item.replies || []), newReply],
          };
        }
        if (item.replies && item.replies.length > 0) {
          return {
            ...item,
            replies: addReplyRecursive(item.replies),
          };
        }
        return item;
      });
    };

    setComments(addReplyRecursive(comments));

    // Send reply to DB endpoint asynchronously if ids exist
    if (animeId && episodeId) {
      try {
        await fetch("/api/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            animeId,
            episodeId,
            parentId,
            content: text,
            isSpoiler,
            guestName,
          }),
        });
      } catch (e) {
        console.error("Failed to post reply to DB API:", e);
      }
    }
  };

  const handleLikeRecursive = (id: string) => {
    const updateLike = (list: CommentData[]): CommentData[] => {
      return list.map((item) => {
        if (item.id === id) {
          const nextIsLiked = !item.isLiked;
          return {
            ...item,
            likes: nextIsLiked ? item.likes + 1 : item.likes - 1,
            isLiked: nextIsLiked,
            isDisliked: false,
          };
        }
        if (item.replies && item.replies.length > 0) {
          return { ...item, replies: updateLike(item.replies) };
        }
        return item;
      });
    };
    setComments(updateLike(comments));
  };

  const handleDislikeRecursive = (id: string) => {
    const updateDislike = (list: CommentData[]): CommentData[] => {
      return list.map((item) => {
        if (item.id === id) {
          const nextIsDisliked = !item.isDisliked;
          return {
            ...item,
            isDisliked: nextIsDisliked,
            isLiked: false,
          };
        }
        if (item.replies && item.replies.length > 0) {
          return { ...item, replies: updateDislike(item.replies) };
        }
        return item;
      });
    };
    setComments(updateDislike(comments));
  };

  const totalCount = countTotalComments(comments);

  return (
    <div className="flex flex-col gap-5 mt-6 p-4 md:p-6 bg-card border border-border/60 rounded-xl shadow-xs">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3.5">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4 text-primary shrink-0" />
          <h2 className="text-base font-bold text-foreground">Comments</h2>
        </div>
        <span className="text-xs text-muted-foreground font-mono bg-muted/60 px-2 py-0.5 rounded-full font-semibold">
          {totalCount} Comments
        </span>
      </div>

      {/* Root Comment Form */}
      <CommentInputForm onSubmit={handlePostRootComment} />

      {/* Nested Thread Comment List */}
      <div className="flex flex-col gap-3.5 mt-2">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onLike={handleLikeRecursive}
            onDislike={handleDislikeRecursive}
            onReplySubmit={handleAddReply}
          />
        ))}
      </div>
    </div>
  );
}
