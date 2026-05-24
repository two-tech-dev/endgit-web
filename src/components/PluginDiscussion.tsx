"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { MessageCircle, Send, Loader2, Trash2, Reply } from "lucide-react";

interface Comment {
  id: string;
  body: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    trustLevel: string;
  };
  replies: Comment[];
}

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function PluginDiscussion({ slug }: { slug: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const token = (session?.user as any)?.apiToken;

  const fetchComments = useCallback(
    async (p: number = 1) => {
      try {
        const res = await fetch(
          `${apiUrl}/api/v1/comments/${slug}?page=${p}&limit=20`,
        );
        const json = await res.json();
        if (json.success) {
          if (p === 1) {
            setComments(json.data);
          } else {
            setComments((prev) => [...prev, ...json.data]);
          }
          setPage(p);
          setTotalPages(json.pagination?.totalPages || 1);
        }
      } finally {
        setLoading(false);
      }
    },
    [apiUrl, slug],
  );

  useEffect(() => {
    fetchComments(1);
  }, [fetchComments]);

  useEffect(() => {
    const eventSource = new EventSource(
      `${apiUrl}/api/v1/comments/${slug}/stream`,
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "new") {
          if (data.parentId) {
            setComments((prev) =>
              prev.map((c) =>
                c.id === data.parentId
                  ? { ...c, replies: [...c.replies, data.comment] }
                  : c,
              ),
            );
          } else {
            setComments((prev) => {
              if (prev.some((c) => c.id === data.comment.id)) return prev;
              return [data.comment, ...prev];
            });
          }
        } else if (data.type === "delete") {
          if (data.parentId) {
            setComments((prev) =>
              prev.map((c) =>
                c.id === data.parentId
                  ? {
                      ...c,
                      replies: c.replies.filter((r) => r.id !== data.commentId),
                    }
                  : c,
              ),
            );
          } else {
            setComments((prev) => prev.filter((c) => c.id !== data.commentId));
          }
        }
      } catch {}
    };

    return () => eventSource.close();
  }, [apiUrl, slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || !token) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/api/v1/comments/${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body: body.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        setBody("");
        setComments((prev) => [{ ...json.data, replies: [] }, ...prev]);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId: string) => {
    if (!replyBody.trim() || !token) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/api/v1/comments/${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body: replyBody.trim(), parentId }),
      });
      const json = await res.json();
      if (json.success) {
        setReplyBody("");
        setReplyingTo(null);
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentId
              ? { ...c, replies: [...c.replies, json.data] }
              : c,
          ),
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string, parentId?: string) => {
    if (!token) return;
    const res = await fetch(`${apiUrl}/api/v1/comments/${slug}/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (json.success) {
      if (parentId) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentId
              ? { ...c, replies: c.replies.filter((r) => r.id !== commentId) }
              : c,
          ),
        );
      } else {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
    }
  };

  const currentUserId = (session?.user as any)?.id;
  const isAdmin = (session?.user as any)?.trustLevel === "ADMIN";

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <MessageCircle size={20} /> Discussion
      </h3>

      {session && (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full min-h-[80px] p-3 rounded-sm border border-border bg-surface-secondary text-text-primary text-sm resize-y font-inherit"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="btn btn-primary flex items-center gap-1.5 text-xs"
              disabled={!body.trim() || submitting}
            >
              {submitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
              Post
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center p-6 text-text-muted">
          <Loader2 size={24} className="animate-spin mx-auto" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center p-6 text-text-muted">
          <p>No comments yet. Be the first to start a discussion!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-border pb-4">
              <CommentItem
                comment={comment}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
                onDelete={(id) => handleDelete(id)}
                onReply={() =>
                  setReplyingTo(replyingTo === comment.id ? null : comment.id)
                }
                showReplyBtn={!!session}
              />

              {comment.replies.length > 0 && (
                <div className="ml-6 mt-3 flex flex-col gap-3">
                  {comment.replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      currentUserId={currentUserId}
                      isAdmin={isAdmin}
                      onDelete={(id) => handleDelete(id, comment.id)}
                      isReply
                    />
                  ))}
                </div>
              )}

              {replyingTo === comment.id && (
                <div className="ml-6 mt-3">
                  <textarea
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full min-h-[60px] p-3 rounded-sm border border-border bg-surface-secondary text-text-primary text-xs resize-y font-inherit"
                  />
                  <div className="flex gap-2 mt-2 justify-end">
                    <button
                      className="btn btn-secondary text-xs py-1 px-2"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyBody("");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary text-xs py-1 px-2 flex items-center gap-1"
                      onClick={() => handleReply(comment.id)}
                      disabled={!replyBody.trim() || submitting}
                    >
                      {submitting ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Send size={12} />
                      )}
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {page < totalPages && (
            <button
              className="btn btn-secondary self-center text-xs"
              onClick={() => fetchComments(page + 1)}
            >
              Load more
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function CommentItem({
  comment,
  currentUserId,
  isAdmin,
  onDelete,
  onReply,
  showReplyBtn,
  isReply,
}: {
  comment: Comment;
  currentUserId?: string;
  isAdmin?: boolean;
  onDelete: (id: string) => void;
  onReply?: () => void;
  showReplyBtn?: boolean;
  isReply?: boolean;
}) {
  const canDelete = currentUserId === comment.user.id || isAdmin;

  return (
    <div className="flex gap-3">
      <div
        className={`rounded-full bg-surface-secondary border border-border overflow-hidden shrink-0 ${
          isReply ? "w-7 h-7" : "w-8 h-8"
        }`}
      >
        {comment.user.avatarUrl ? (
          <img
            src={comment.user.avatarUrl}
            alt={comment.user.username}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center font-semibold text-text-muted ${
              isReply ? "text-[11px]" : "text-xs"
            }`}
          >
            {(comment.user.displayName ||
              comment.user.username)[0].toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <a
            href={`https://github.com/${comment.user.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-semibold text-text-primary no-underline ${
              isReply ? "text-xs" : "text-sm"
            }`}
          >
            {comment.user.displayName || comment.user.username}
          </a>
          {comment.user.trustLevel === "ADMIN" && (
            <span className="text-[10px] px-1.5 py-px rounded-full bg-accent/10 text-accent font-semibold">
              Staff
            </span>
          )}
          <span className="text-xs text-text-muted">
            {timeAgo(comment.createdAt)}
          </span>
        </div>
        <p
          className={`mt-1 text-text-secondary whitespace-pre-wrap wrap-break-word ${
            isReply ? "text-xs" : "text-sm"
          }`}
        >
          {comment.body}
        </p>
        <div className="flex gap-3 mt-1.5">
          {showReplyBtn && !isReply && onReply && (
            <button
              onClick={onReply}
              className="flex items-center gap-1 text-xs text-text-muted bg-transparent border-none cursor-pointer p-0"
            >
              <Reply size={12} /> Reply
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(comment.id)}
              className="flex items-center gap-1 text-xs text-error bg-transparent border-none cursor-pointer p-0 opacity-70"
            >
              <Trash2 size={12} /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
