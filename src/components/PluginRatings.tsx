"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Star, Send, Loader2 } from "lucide-react";

interface RatingData {
  id: string;
  score: number;
  comment: string | null;
  createdAt: string;
  user: { username: string; displayName: string | null; avatarUrl: string | null };
}

interface RatingSummary {
  average: number;
  total: number;
  distribution: { star: number; count: number; percentage: number }[];
}

export default function PluginRatings({ slug }: { slug: string }) {
  const { data: session } = useSession();
  const [ratings, setRatings] = useState<RatingData[]>([]);
  const [summary, setSummary] = useState<RatingSummary>({ average: 0, total: 0, distribution: [5,4,3,2,1].map(s => ({ star: s, count: 0, percentage: 0 })) });
  const [myScore, setMyScore] = useState(0);
  const [hoverScore, setHoverScore] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => { fetchData(); }, [slug]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ratingsRes, summaryRes] = await Promise.all([
        fetch(`${apiUrl}/api/v1/ratings/${slug}`),
        fetch(`${apiUrl}/api/v1/ratings/${slug}/summary`)
      ]);
      const ratingsJson = await ratingsRes.json();
      const summaryJson = await summaryRes.json();
      if (ratingsJson.success) setRatings(ratingsJson.data);
      if (summaryJson.success) setSummary(summaryJson.data);
    } catch { /* noop */ }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (myScore === 0) return;
    setSubmitting(true);
    try {
      const token = (session?.user as any)?.apiToken;
      const res = await fetch(`${apiUrl}/api/v1/ratings/${slug}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ score: myScore, comment: myComment || null })
      });
      const json = await res.json();
      if (json.success) {
        setMyScore(0);
        setMyComment("");
        await fetchData(); // Refresh
      }
    } catch { /* noop */ }
    finally { setSubmitting(false); }
  };

  const timeAgo = (d: string) => {
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    if (s < 2592000) return `${Math.floor(s / 86400)}d ago`;
    return new Date(d).toLocaleDateString();
  };

  const StarDisplay = ({ score, size = 14 }: { score: number; size?: number }) => (
    <div style={{ display: "flex", gap: "1px" }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size} fill={i <= score ? "#f59e0b" : "transparent"} color={i <= score ? "#f59e0b" : "#d1d5db"} />
      ))}
    </div>
  );

  return (
    <div className="card" style={{ padding: "var(--space-6)" }}>
      <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "var(--space-5)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
        <Star size={20} color="#f59e0b" fill="#f59e0b" /> Ratings & Reviews
      </h3>

      {/* Summary */}
      <div style={{ display: "flex", gap: "var(--space-6)", marginBottom: "var(--space-6)", padding: "var(--space-5)", background: "var(--bg-secondary)", borderRadius: "var(--radius-md)" }}>
        <div style={{ textAlign: "center", minWidth: "100px" }}>
          <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>{summary.average}</div>
          <StarDisplay score={Math.round(summary.average)} size={16} />
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{summary.total} reviews</div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", justifyContent: "center" }}>
          {summary.distribution.map(d => (
            <div key={d.star} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "0.75rem" }}>
              <span style={{ width: "12px", textAlign: "right", color: "var(--text-muted)" }}>{d.star}</span>
              <Star size={10} fill="#f59e0b" color="#f59e0b" />
              <div style={{ flex: 1, height: "6px", background: "var(--border-color)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${d.percentage}%`, height: "100%", background: "#f59e0b", borderRadius: "3px", transition: "width 300ms" }} />
              </div>
              <span style={{ width: "28px", textAlign: "right", color: "var(--text-muted)" }}>{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review (only if logged in) */}
      {session && (
        <div style={{ marginBottom: "var(--space-6)", padding: "var(--space-5)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}>
          <h4 style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "var(--space-3)" }}>Write a Review</h4>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
            <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Your rating:</span>
            <div style={{ display: "flex", gap: "2px" }}>
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i} onClick={() => setMyScore(i)} onMouseEnter={() => setHoverScore(i)} onMouseLeave={() => setHoverScore(0)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", padding: "2px" }}>
                  <Star size={22} fill={i <= (hoverScore || myScore) ? "#f59e0b" : "transparent"} color={i <= (hoverScore || myScore) ? "#f59e0b" : "#d1d5db"} />
                </button>
              ))}
            </div>
            {myScore > 0 && <span style={{ fontSize: "0.8125rem", color: "#f59e0b", fontWeight: 600 }}>{myScore}/5</span>}
          </div>
          <textarea value={myComment} onChange={e => setMyComment(e.target.value)} placeholder="Share your experience... (optional)" rows={3}
            style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.875rem", resize: "vertical", fontFamily: "inherit", outline: "none", minHeight: "80px" }} />
          <div style={{ marginTop: "var(--space-3)", display: "flex", justifyContent: "flex-end" }}>
            <button onClick={handleSubmit} disabled={myScore === 0 || submitting}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "0.5rem 1.25rem", borderRadius: "var(--radius-md)", background: myScore > 0 ? "var(--text-primary)" : "var(--bg-secondary)", color: myScore > 0 ? "white" : "var(--text-muted)", border: "none", fontSize: "0.8125rem", fontWeight: 600, cursor: myScore > 0 ? "pointer" : "not-allowed", opacity: submitting ? 0.6 : 1 }}>
              <Send size={14} /> {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
          <Loader2 size={24} color="var(--text-muted)" style={{ animation: "spin 1s linear infinite" }} />
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Reviews List */}
      {!loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {ratings.length === 0 && (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "var(--space-6)", fontSize: "0.875rem" }}>
              No reviews yet. Be the first to review this plugin!
            </p>
          )}
          {ratings.map(rating => (
            <div key={rating.id} style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0, overflow: "hidden"
                }}>
                  {rating.user.avatarUrl ? <img src={rating.user.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : rating.user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{rating.user.displayName || rating.user.username}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                    <StarDisplay score={rating.score} size={12} />
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{timeAgo(rating.createdAt)}</span>
                  </div>
                </div>
              </div>
              {rating.comment && (
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0, paddingLeft: "44px" }}>
                  {rating.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
