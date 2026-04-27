import { useState, useEffect } from "react";
import "./StatsPanel.css";

export default function StatsPanel() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (!res.ok) throw new Error("Failed to load stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="state-msg">Loading stats...</div>;
  if (error) return <div className="state-msg error">⚠ {error}</div>;

  const statusMap = {};
  stats.statusBreakdown.forEach((s) => {
    statusMap[s._id] = s.count;
  });

  const STATUS_COLORS = {
    Backlog: "#64748b",
    Playing: "#22c55e",
    Completed: "#6c63ff",
    Dropped: "#ef4444",
  };

  return (
    <div>
      <h2 className="section-title" style={{ marginBottom: "1.5rem" }}>
        Backlog Stats
      </h2>

      {/* Summary cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalGames}</div>
          <div className="stat-label">Total Games</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalHours}h</div>
          <div className="stat-label">Total Hours Played</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.avgRating ?? "—"}</div>
          <div className="stat-label">Avg Review Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{statusMap["Completed"] || 0}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      {/* Status breakdown */}
      <div className="breakdown-section">
        <h3>Status Breakdown</h3>
        <div className="breakdown-bars">
          {["Backlog", "Playing", "Completed", "Dropped"].map((s) => {
            const count = statusMap[s] || 0;
            const pct =
              stats.totalGames > 0
                ? Math.round((count / stats.totalGames) * 100)
                : 0;
            return (
              <div key={s} className="bar-row">
                <span className="bar-label">{s}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${pct}%`, background: STATUS_COLORS[s] }}
                  />
                </div>
                <span className="bar-count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Genre breakdown */}
      <div className="breakdown-section">
        <h3>Top Genres</h3>
        <div className="genre-list">
          {stats.genreBreakdown.slice(0, 6).map((g) => (
            <div key={g._id} className="genre-item">
              <span className="genre-name">{g._id}</span>
              <span className="genre-count">
                {g.count} game{g.count !== 1 ? "s" : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
