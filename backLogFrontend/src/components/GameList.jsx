import { useState, useEffect } from "react";
import GameForm from "./GameForm";
import GameRow from "./GameRow";
import "./GameList.css";

const STATUSES = ["All", "Backlog", "Playing", "Completed", "Dropped"];
const GENRES = [
  "All",
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

export default function GameList() {
  const [games, setGames] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editGame, setEditGame] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [genreFilter, setGenreFilter] = useState("All");

  const fetchGames = async () => {
    try {
      setError(null);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter !== "All") params.append("status", statusFilter);
      if (genreFilter !== "All") params.append("genre", genreFilter);

      const res = await fetch(`/api/games?${params}`);
      if (!res.ok) throw new Error("Failed to fetch games");
      const data = await res.json();
      setGames(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlatforms = async () => {
    const res = await fetch("/api/platforms");
    const data = await res.json();
    setPlatforms(data);
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchGames();
    fetchPlatforms();
    const interval = setInterval(fetchGames, 30000);
    return () => clearInterval(interval); // cleanup on unmount
  }, [search, statusFilter, genreFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this game from your backlog?")) return;
    const res = await fetch(`/api/games/${id}`, { method: "DELETE" });
    if (res.ok) fetchGames();
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditGame(null);
    fetchGames();
  };

  return (
    <div>
      <div className="list-header">
        <div>
          <h2 className="section-title">My Game Backlog</h2>
          <p className="subtitle">
            {games.length} game{games.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setEditGame(null);
            setShowForm(true);
          }}
        >
          + Add Game
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          className="search-input"
          placeholder="Search games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-pills">
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`pill ${statusFilter === s ? "pill-active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <select
          className="filter-select"
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          {GENRES.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Form modal */}
      {(showForm || editGame) && (
        <GameForm
          platforms={platforms}
          game={editGame}
          onSaved={handleSaved}
          onCancel={() => {
            setShowForm(false);
            setEditGame(null);
          }}
        />
      )}

      {/* States */}
      {loading && <div className="state-msg">Loading your games...</div>}
      {error && <div className="state-msg error">⚠ {error}</div>}

      {!loading && !error && (
        <div className="table-wrap">
          <table className="game-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Status</th>
                <th>Platform</th>
                <th>Hours</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-row">
                    No games found. Add one!
                  </td>
                </tr>
              )}
              {games.map((game) => (
                <GameRow
                  key={game._id}
                  game={game}
                  onEdit={() => setEditGame(game)}
                  onDelete={() => handleDelete(game._id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
