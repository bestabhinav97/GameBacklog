import { useState, useEffect } from "react";
import "./GameForm.css";

const GENRES = [
  "Action",
  "RPG",
  "Strategy",
  "Sports",
  "Horror",
  "Adventure",
  "Puzzle",
  "Shooter",
  "Platformer",
  "Simulation",
  "Fighting",
  "Other",
];
const STATUSES = ["Backlog", "Playing", "Completed", "Dropped"];

export default function GameForm({ platforms, game, onSaved, onCancel }) {
  const isEdit = Boolean(game);

  const [form, setForm] = useState({
    title: "",
    genre: "RPG",
    status: "Backlog",
    platformId: "",
    hoursPlayed: 0,
    releaseYear: "",
    coverUrl: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (game) {
      setForm({
        title: game.title || "",
        genre: game.genre || "RPG",
        status: game.status || "Backlog",
        platformId: game.platformId?._id || game.platformId || "",
        hoursPlayed: game.hoursPlayed || 0,
        releaseYear: game.releaseYear || "",
        coverUrl: game.coverUrl || "",
      });
    }
  }, [game]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!form.platformId) {
      setError("Please select a platform");
      return;
    }

    setSaving(true);
    try {
      const url = isEdit ? `/api/games/${game._id}` : "/api/games";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          hoursPlayed: Number(form.hoursPlayed),
          releaseYear: form.releaseYear ? Number(form.releaseYear) : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || data.error || "Failed to save");
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{isEdit ? "Edit Game" : "Add New Game"}</h3>
          <button className="close-btn" onClick={onCancel}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="game-form">
          <div className="form-row">
            <label>Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Elden Ring"
            />
          </div>

          <div className="form-grid">
            <div className="form-row">
              <label>Genre *</label>
              <select name="genre" value={form.genre} onChange={handleChange}>
                {GENRES.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label>Status *</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-row">
              <label>Platform *</label>
              <select
                name="platformId"
                value={form.platformId}
                onChange={handleChange}
              >
                <option value="">Select platform...</option>
                {platforms.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label>Hours Played</label>
              <input
                type="number"
                name="hoursPlayed"
                value={form.hoursPlayed}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-row">
              <label>Release Year</label>
              <input
                type="number"
                name="releaseYear"
                value={form.releaseYear}
                onChange={handleChange}
                placeholder="e.g. 2023"
                min="1970"
                max="2030"
              />
            </div>
            <div className="form-row">
              <label>Cover URL</label>
              <input
                name="coverUrl"
                value={form.coverUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>

          {error && <p className="form-error">⚠ {error}</p>}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Game"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
