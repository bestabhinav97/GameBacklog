import "./App.css";
import { useState } from "react";
import GameList from "./components/GameList";
import ReviewsPanel from "./components/ReviewsPanel";

function App() {
  const [tab, setTab] = useState("games");
  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🎮</span>
            <h1>GameBacklog</h1>
          </div>
          <nav className="nav">
            <button
              className={tab === "games" ? "nav-btn active" : "nav-btn"}
              onClick={() => setTab("games")}
            >
              My Games
            </button>
            <button
              className={tab === "reviews" ? "nav-btn active" : "nav-btn"}
              onClick={() => setTab("reviews")}
            >
              Reviews
            </button>
            <button
              className={tab === "stats" ? "nav-btn active" : "nav-btn"}
              onClick={() => setTab("stats")}
            >
              Stats
            </button>
          </nav>
        </div>
      </header>
      <main className="main">
        {tab === "games" && <GameList />}
        {tab === "reviews" && <ReviewsPanel />}
      </main>
    </div>
  );
}

export default App;
