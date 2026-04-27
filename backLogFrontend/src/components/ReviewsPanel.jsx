import { useState, useEffect } from "react";
import "./ReviewsPanel.css";

export default function ReviewsPanel() {
  const [reviews, setReviews] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    gameId: "",
    rating: 7,
    notes: "",
    recommended: true,
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchReviews = async () => {
    try {
      setError(null);
      const res = await fetch("/api/reviews");
      if (!res.ok) throw new Error("Failed to load reviews");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGames = async () => {
    const res = await fetch("/api/games?status=Completed");
    const data = await res.json();
    setGames(data);
  };

  useEffect(() => {
    fetchReviews();
    fetchGames();
    const interval = setInterval(fetchReviews, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    fetchReviews();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.gameId) {
      setFormError("Please select a game");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating: Number(form.rating) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error);
      setShowForm(false);
      setForm({ gameId: "", rating: 7, notes: "", recommended: true });
      fetchReviews();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const ratingColor = (r) => {
    if (r >= 8) return "var(--green)";
    if (r >= 5) return "var(--yellow)";
    return "var(--red)";
  };

  return (
    <div>
      <div
        className="list-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h2 className="section-title">Game Reviews</h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              marginTop: 2,
            }}
          >
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          className="btn-primary"
          style={{
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            padding: "0.6rem 1.2rem",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Add Review"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-row">
            <label>Game (completed games)</label>
            <select
              value={form.gameId}
              onChange={(e) => setForm({ ...form, gameId: e.target.value })}
            >
              <option value="">Select a game...</option>
              {games.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.title}
                </option>
              ))}
            </select>
          </div>
          <div className="form-grid-2">
            <div className="form-row">
              <label>Rating (1–10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
              />
            </div>
            <div className="form-row">
              <label>Recommended?</label>
              <select
                value={form.recommended}
                onChange={(e) =>
                  setForm({ ...form, recommended: e.target.value === "true" })
                }
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <label>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Write your thoughts..."
              rows={3}
            />
          </div>
          {formError && <p className="form-error">⚠ {formError}</p>}
          <button type="submit" className="btn-save-review" disabled={saving}>
            {saving ? "Saving..." : "Save Review"}
          </button>
        </form>
      )}

      {loading && <div className="state-msg">Loading reviews...</div>}
      {error && <div className="state-msg error">⚠ {error}</div>}

      {!loading && !error && (
        <div className="reviews-list">
          {reviews.length === 0 && (
            <div className="state-msg">
              No reviews yet. Review a completed game!
            </div>
          )}
          {reviews.map((r) => (
            <div key={r._id} className="review-card">
              <div className="review-top">
                <div>
                  <div className="review-game">
                    {r.gameId?.title || "Unknown Game"}
                  </div>
                  <div className="review-meta">
                    {r.gameId?.genre && (
                      <span className="review-tag">{r.gameId.genre}</span>
                    )}
                    {r.gameId?.platformId?.name && (
                      <span className="review-tag">
                        {r.gameId.platformId.name}
                      </span>
                    )}
                    <span
                      className={`rec-badge ${r.recommended ? "rec-yes" : "rec-no"}`}
                    >
                      {r.recommended ? "✓ Recommended" : "✗ Not Recommended"}
                    </span>
                  </div>
                </div>
                <div className="review-right">
                  <div
                    className="rating-circle"
                    style={{
                      borderColor: ratingColor(r.rating),
                      color: ratingColor(r.rating),
                    }}
                  >
                    {r.rating}
                    <span>/10</span>
                  </div>
                  <button
                    className="del-review"
                    onClick={() => handleDelete(r._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {r.notes && <p className="review-notes">{r.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
