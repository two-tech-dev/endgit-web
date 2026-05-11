"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Star, Send, Loader2 } from "lucide-react";

interface RatingData {
  id: string;
  score: number;
  comment: string | null;
  ownerReply: string | null;
  repliedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    trustLevel?: string;
  };
}

interface RatingSummary {
  average: number;
  total: number;
  distribution: { star: number; count: number; percentage: number }[];
}

export default function PluginRatings({
  slug,
  authorId,
}: {
  slug: string;
  authorId?: string;
}) {
  const { data: session } = useSession();
  const [ratings, setRatings] = useState<RatingData[]>([]);
  const [summary, setSummary] = useState<RatingSummary>({
    average: 0,
    total: 0,
    distribution: [5, 4, 3, 2, 1].map((s) => ({
      star: s,
      count: 0,
      percentage: 0,
    })),
  });
  const [myScore, setMyScore] = useState(0);
  const [hoverScore, setHoverScore] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [hasExistingRating, setHasExistingRating] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchData();
  }, [slug]);

  useEffect(() => {
    if (session?.user && ratings.length > 0) {
      const myRating = ratings.find(
        (r) => r.user.id === (session.user as any).id,
      );
      if (myRating) {
        setMyScore(myRating.score);
        setMyComment(myRating.comment || "");
        setHasExistingRating(true);
      }
    }
  }, [ratings, session]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ratingsRes, summaryRes] = await Promise.all([
        fetch(`${apiUrl}/api/v1/ratings/${slug}`),
        fetch(`${apiUrl}/api/v1/ratings/${slug}/summary`),
      ]);
      const ratingsJson = await ratingsRes.json();
      const summaryJson = await summaryRes.json();
      if (ratingsJson.success) setRatings(ratingsJson.data);
      if (summaryJson.success) setSummary(summaryJson.data);
    } catch {
      /* noop */
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (myScore === 0) return;
    setSubmitting(true);
    try {
      const token = (session?.user as any)?.apiToken;
      const res = await fetch(`${apiUrl}/api/v1/ratings/${slug}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ score: myScore, comment: myComment || null }),
      });
      const json = await res.json();
      if (json.success) {
        setHasExistingRating(true);
        await fetchData(); // Refresh
      }
    } catch {
      /* noop */
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (ratingId: string) => {
    if (!replyText.trim()) return;
    setReplying(true);
    try {
      const token = (session?.user as any)?.apiToken;
      const res = await fetch(
        `${apiUrl}/api/v1/ratings/${slug}/${ratingId}/reply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reply: replyText }),
        },
      );
      const json = await res.json();
      if (json.success) {
        setReplyingTo(null);
        setReplyText("");
        await fetchData(); // Refresh
      }
    } catch {
      /* noop */
    } finally {
      setReplying(false);
    }
  };

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  };

  const StarDisplay = ({
    score,
    size = 14,
  }: {
    score: number;
    size?: number;
  }) => (
    <div style={{ display: "flex", gap: "1px" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= score ? "#f59e0b" : "transparent"}
          color={i <= score ? "#f59e0b" : "#d1d5db"}
        />
      ))}
    </div>
  );

  return (
    <div className="card" style={{ padding: "var(--space-6)" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-5)",
          flexWrap: "wrap",
          gap: "var(--space-3)",
        }}
      >
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            margin: 0,
          }}
        >
          <Star size={20} color="#f59e0b" fill="#f59e0b" /> Ratings & Reviews
        </h3>

        {/* Star Selector in Header */}
        {session && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
              Your rating:
            </span>
            <div style={{ display: "flex", gap: "2px" }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onClick={() => setMyScore(i)}
                  onMouseEnter={() => setHoverScore(i)}
                  onMouseLeave={() => setHoverScore(0)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Star
                    size={18}
                    fill={
                      i <= (hoverScore || myScore) ? "#f59e0b" : "transparent"
                    }
                    color={i <= (hoverScore || myScore) ? "#f59e0b" : "#d1d5db"}
                  />
                </button>
              ))}
            </div>
            {myScore > 0 && (
              <span
                style={{
                  fontSize: "0.8125rem",
                  color: "#f59e0b",
                  fontWeight: 600,
                  width: "24px",
                  textAlign: "right",
                }}
              >
                {myScore}/5
              </span>
            )}
          </div>
        )}
      </div>

      {/* Write Review Comment Form */}
      {session && myScore > 0 && (
        <div style={{ marginBottom: "var(--space-6)" }}>
          <textarea
            value={myComment}
            onChange={(e) => setMyComment(e.target.value)}
            placeholder="Share your experience... (optional)"
            rows={3}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-color)",
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              fontSize: "0.875rem",
              resize: "vertical",
              fontFamily: "inherit",
              outline: "none",
              minHeight: "80px",
            }}
          />
          <div
            style={{
              marginTop: "var(--space-3)",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={handleSubmit}
              disabled={myScore === 0 || submitting}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.5rem 1.25rem",
                borderRadius: "var(--radius-md)",
                background:
                  myScore > 0 ? "var(--accent-purple)" : "var(--bg-secondary)",
                color: myScore > 0 ? "white" : "var(--text-muted)",
                border: "none",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: myScore > 0 ? "pointer" : "not-allowed",
                opacity: submitting ? 0.6 : 1,
                transition: "all 150ms",
              }}
            >
              <Send size={14} />{" "}
              {submitting
                ? "Submitting..."
                : hasExistingRating
                  ? "Update Review"
                  : "Submit Review"}
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
          <Loader2
            size={24}
            color="var(--text-muted)"
            style={{ animation: "spin 1s linear infinite" }}
          />
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Reviews List — Poggit-inspired clean style */}
      {!loading && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {ratings.length === 0 && (
            <p
              style={{
                color: "var(--text-muted)",
                textAlign: "center",
                padding: "var(--space-6)",
                fontSize: "0.875rem",
              }}
            >
              No reviews yet. Be the first to review this plugin!
            </p>
          )}
          {ratings.map((rating) => (
            <div
              key={rating.id}
              style={{
                padding: "var(--space-4) 0",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              {/* Top row: avatar + username + stars + version badge + date */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "4px",
                      background:
                        "linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    {rating.user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={rating.user.avatarUrl}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      rating.user.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <a
                    href={`https://github.com/${rating.user.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "var(--accent-cyan)",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {rating.user.displayName || rating.user.username}
                    {rating.user.trustLevel === "ADMIN" && (
                      <span
                        style={{
                          fontSize: "0.625rem",
                          padding: "1px 6px",
                          borderRadius: "4px",
                          background: "rgba(16, 185, 129, 0.15)",
                          color: "var(--status-success)",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Staff
                      </span>
                    )}
                  </a>
                  <StarDisplay score={rating.score} size={12} />
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatDate(rating.createdAt)}
                </span>
              </div>
              {/* Comment block — indented like Poggit */}
              {rating.comment && (
                <div
                  style={{
                    marginTop: "var(--space-2)",
                    marginLeft: "40px",
                    padding: "var(--space-3)",
                    background: "var(--bg-secondary)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-color)",
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {rating.comment}
                </div>
              )}

              {/* Owner Reply */}
              {rating.ownerReply && (
                <div
                  style={{
                    marginTop: "var(--space-2)",
                    marginLeft: "56px",
                    padding: "var(--space-3)",
                    background: "rgba(16, 185, 129, 0.05)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                    borderLeft: "3px solid var(--status-success)",
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--status-success)",
                        textTransform: "uppercase",
                      }}
                    >
                      Author Reply
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {formatDate(rating.repliedAt || rating.updatedAt)}
                    </span>
                  </div>
                  {rating.ownerReply}
                </div>
              )}

              {/* Reply Button for Author */}
              {!rating.ownerReply &&
                session?.user &&
                (session.user as any).id === authorId && (
                  <div
                    style={{ marginLeft: "40px", marginTop: "var(--space-2)" }}
                  >
                    {replyingTo === rating.id ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--space-2)",
                        }}
                      >
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply..."
                          rows={2}
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border-color)",
                            background: "var(--bg-secondary)",
                            color: "var(--text-primary)",
                            fontSize: "0.875rem",
                            resize: "vertical",
                            outline: "none",
                            fontFamily: "inherit",
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            gap: "var(--space-2)",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                            style={{
                              background: "transparent",
                              border: "1px solid var(--border-color)",
                              color: "var(--text-primary)",
                              borderRadius: "var(--radius-sm)",
                              padding: "4px 8px",
                              fontSize: "0.75rem",
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReplySubmit(rating.id)}
                            disabled={replying}
                            style={{
                              background: "var(--accent-purple)",
                              border: "none",
                              color: "white",
                              borderRadius: "var(--radius-sm)",
                              padding: "4px 8px",
                              fontSize: "0.75rem",
                              cursor: replying ? "not-allowed" : "pointer",
                              opacity: replying ? 0.6 : 1,
                            }}
                          >
                            {replying ? "Submitting..." : "Submit Reply"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setReplyingTo(rating.id);
                          setReplyText("");
                        }}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--accent-cyan)",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          padding: 0,
                        }}
                      >
                        Reply to this review
                      </button>
                    )}
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
