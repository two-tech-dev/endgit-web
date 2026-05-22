"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Star, Send, Loader2 } from "lucide-react";
import Image from "next/image";

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

function StarDisplay({ score, size = 14 }: { score: number; size?: number }) {
  return (
    <div className="flex gap-[1px]">
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

  return (
    <div className="card p-4 md:p-6">
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <h3 className="text-lg font-semibold flex items-center gap-2 m-0">
          <Star size={20} className="text-[#f59e0b] fill-[#f59e0b]" /> Ratings &
          Reviews
        </h3>

        {/* Star Selector in Header */}
        {session && (
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-text-muted">Your rating:</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onClick={() => setMyScore(i)}
                  onMouseEnter={() => setHoverScore(i)}
                  onMouseLeave={() => setHoverScore(0)}
                  className="bg-transparent border-none cursor-pointer p-1.5 flex items-center"
                >
                  <Star
                    size={22}
                    fill={
                      i <= (hoverScore || myScore) ? "#f59e0b" : "transparent"
                    }
                    color={i <= (hoverScore || myScore) ? "#f59e0b" : "#d1d5db"}
                  />
                </button>
              ))}
            </div>
            {myScore > 0 && (
              <span className="text-[13px] text-[#f59e0b] font-semibold w-6 text-right">
                {myScore}/5
              </span>
            )}
          </div>
        )}
      </div>

      {/* Write Review Comment Form */}
      {session && myScore > 0 && (
        <div className="mb-6">
          <textarea
            value={myComment}
            onChange={(e) => setMyComment(e.target.value)}
            placeholder="Share your experience... (optional)"
            rows={3}
            className="w-full p-3 rounded-md border border-border bg-surface-secondary text-text-primary text-sm resize-y font-inherit outline-none min-h-[80px]"
          />
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={myScore === 0 || submitting}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-md text-[13px] font-semibold transition-all duration-150 ${
                myScore > 0
                  ? "bg-accent text-white cursor-pointer hover:bg-accent-hover"
                  : "bg-surface-secondary text-text-muted cursor-not-allowed"
              } ${submitting ? "opacity-60" : "opacity-100"}`}
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
        <div className="text-center p-8">
          <Loader2
            size={24}
            color="var(--text-muted)"
            className="animate-spin"
          />
        </div>
      )}

      {/* Reviews List — Poggit-inspired clean style */}
      {!loading && (
        <div className="flex flex-col">
          {ratings.length === 0 && (
            <p className="text-text-muted text-center p-6 text-sm">
              No reviews yet. Be the first to review this plugin!
            </p>
          )}
          {ratings.map((rating) => (
            <div key={rating.id} className="py-4 border-b border-border">
              {/* Top row: avatar + username + stars + version badge + date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-[4px] bg-gradient-to-br from-accent to-accent flex items-center justify-center text-white text-[11px] font-bold shrink-0 overflow-hidden">
                    {rating.user.avatarUrl ? (
                      <Image
                        src={rating.user.avatarUrl}
                        alt=""
                        width={28}
                        height={28}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      rating.user.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <a
                    href={`https://github.com/${rating.user.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-sm text-accent no-underline flex items-center gap-1.5 hover:underline"
                  >
                    {rating.user.displayName || rating.user.username}
                    {rating.user.trustLevel === "ADMIN" && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-success/15 text-success font-bold uppercase tracking-wider">
                        Staff
                      </span>
                    )}
                  </a>
                  <StarDisplay score={rating.score} size={12} />
                </div>
                <span className="text-xs text-text-muted whitespace-nowrap">
                  {formatDate(rating.createdAt)}
                </span>
              </div>
              {/* Comment block — indented like Poggit */}
              {rating.comment && (
                <div className="rating-comment mt-2 ml-10 p-3 bg-surface-secondary rounded-md border border-border text-sm text-text-secondary leading-relaxed">
                  {rating.comment}
                </div>
              )}

              {/* Owner Reply */}
              {rating.ownerReply && (
                <div className="rating-reply mt-2 ml-14 p-3 bg-success/5 rounded-md border border-success/20 border-l-3 border-l-success text-sm text-text-secondary leading-relaxed">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs font-bold text-success uppercase">
                      Author Reply
                    </span>
                    <span className="text-xs text-text-muted">
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
                  <div className="rating-comment ml-10 mt-2">
                    {replyingTo === rating.id ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply..."
                          rows={2}
                          className="w-full p-2 rounded-md border border-border bg-surface-secondary text-text-primary text-sm resize-y outline-none font-inherit"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                            className="bg-transparent border border-border text-text-primary rounded-sm px-2 py-1 text-xs cursor-pointer hover:bg-surface-secondary transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReplySubmit(rating.id)}
                            disabled={replying}
                            className={`bg-accent border-none text-white rounded-sm px-2 py-1 text-xs transition-all ${
                              replying
                                ? "cursor-not-allowed opacity-60"
                                : "cursor-pointer hover:bg-accent-hover opacity-100"
                            }`}
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
                        className="bg-transparent border-none text-accent cursor-pointer text-xs font-semibold p-0 hover:underline"
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
