import "./GameRow.css";

const STATUS_COLORS = {
  Backlog: "#64748b",
  Playing: "#22c55e",
  Completed: "#6c63ff",
  Dropped: "#ef4444",
};

export default function GameRow({ game, onEdit, onDelete }) {
  const statusColor = STATUS_COLORS[game.status] || "#64748b";

  return (
    <tr>
      <td className="game-title">{game.title}</td>
      <td>
        <span className="genre-tag">{game.genre}</span>
      </td>
      <td>
        <span
          className="status-badge"
          style={{
            background: statusColor + "22",
            color: statusColor,
            border: `1px solid ${statusColor}44`,
          }}
        >
          {game.status}
        </span>
      </td>
      <td className="platform-cell">{game.platformId?.name || "—"}</td>
      <td>{game.hoursPlayed > 0 ? `${game.hoursPlayed}h` : "—"}</td>
      <td>{game.releaseYear || "—"}</td>
      <td>
        <div className="row-actions">
          <button className="action-btn edit" onClick={onEdit}>
            Edit
          </button>
          <button className="action-btn del" onClick={onDelete}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
