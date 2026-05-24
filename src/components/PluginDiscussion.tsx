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
    <div className="card" style={{ padding: "var(--space-6)" }}>
      <h3
        style={{
          fontSize: "1.125rem",
          fontWeight: 600,
          marginBottom: "var(--space-4)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <MessageCircle size={20} /> Discussion
      </h3>

      {session && (
        <form
          onSubmit={handleSubmit}
          style={{ marginBottom: "var(--space-6)" }}
        >
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your thoughts..."
            style={{
              width: "100%",
              minHeight: "80px",
              padding: "var(--space-3)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-color)",
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              fontSize: "0.875rem",
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "var(--space-2)",
            }}
          >
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!body.trim() || submitting}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.8125rem",
              }}
            >
              {submitting ? (
                <Loader2
                  size={14}
                  style={{ animation: "spin 1s linear infinite" }}
                />
              ) : (
                <Send size={14} />
              )}
              Post
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "var(--space-6)",
            color: "var(--text-muted)",
          }}
        >
          <Loader2
            size={24}
            style={{ animation: "spin 1s linear infinite", margin: "0 auto" }}
          />
        </div>
      ) : comments.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "var(--space-6)",
            color: "var(--text-muted)",
          }}
        >
          <p>No comments yet. Be the first to start a discussion!</p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          {comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                borderBottom: "1px solid var(--border-color)",
                paddingBottom: "var(--space-4)",
              }}
            >
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
                <div
                  style={{
                    marginLeft: "var(--space-6)",
                    marginTop: "var(--space-3)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-3)",
                  }}
                >
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
                <div
                  style={{
                    marginLeft: "var(--space-6)",
                    marginTop: "var(--space-3)",
                  }}
                >
                  <textarea
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    placeholder="Write a reply..."
                    style={{
                      width: "100%",
                      minHeight: "60px",
                      padding: "var(--space-3)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      fontSize: "0.8125rem",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--space-2)",
                      marginTop: "var(--space-2)",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyBody("");
                      }}
                      style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleReply(comment.id)}
                      disabled={!replyBody.trim() || submitting}
                      style={{
                        fontSize: "0.75rem",
                        padding: "0.25rem 0.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {submitting ? (
                        <Loader2
                          size={12}
                          style={{ animation: "spin 1s linear infinite" }}
                        />
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
              className="btn btn-secondary"
              onClick={() => fetchComments(page + 1)}
              style={{ alignSelf: "center", fontSize: "0.8125rem" }}
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
    <div style={{ display: "flex", gap: "var(--space-3)" }}>
      <div
        style={{
          width: isReply ? "28px" : "32px",
          height: isReply ? "28px" : "32px",
          borderRadius: "var(--radius-full)",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {comment.user.avatarUrl ? (
          <img
            src={comment.user.avatarUrl}
            alt={comment.user.username}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isReply ? "0.6875rem" : "0.75rem",
              fontWeight: 600,
              color: "var(--text-muted)",
            }}
          >
            {(comment.user.displayName ||
              comment.user.username)[0].toUpperCase()}
          </div>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexWrap: "wrap",
          }}
        >
          <a
            href={`https://github.com/${comment.user.username}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontWeight: 600,
              fontSize: isReply ? "0.8125rem" : "0.875rem",
              color: "var(--text-primary)",
              textDecoration: "none",
            }}
          >
            {comment.user.displayName || comment.user.username}
          </a>
          {comment.user.trustLevel === "ADMIN" && (
            <span
              style={{
                fontSize: "0.625rem",
                padding: "1px 6px",
                borderRadius: "var(--radius-full)",
                background: "rgba(14, 165, 233, 0.1)",
                color: "var(--accent-primary)",
                fontWeight: 600,
              }}
            >
              Staff
            </span>
          )}
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            {timeAgo(comment.createdAt)}
          </span>
        </div>
        <p
          style={{
            marginTop: "4px",
            fontSize: isReply ? "0.8125rem" : "0.875rem",
            color: "var(--text-secondary)",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {comment.body}
        </p>
        <div
          style={{ display: "flex", gap: "var(--space-3)", marginTop: "6px" }}
        >
          {showReplyBtn && !isReply && onReply && (
            <button
              onClick={onReply}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <Reply size={12} /> Reply
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(comment.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.75rem",
                color: "var(--status-error)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                opacity: 0.7,
              }}
            >
              <Trash2 size={12} /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
