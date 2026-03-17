import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  const xpProgress = user.xp % 100;
  const xpPercent = (xpProgress / 100) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.rank}>{user.rank}</h1>
        <h2 style={styles.username}>{user.username}</h2>
        <p style={styles.level}>Level {user.level}</p>

        <div style={styles.xpBarContainer}>
          <div style={{ ...styles.xpBar, width: `${xpPercent}%` }} />
        </div>
        <p style={styles.xpText}>
          {user.xp} XP — {user.xp_to_next_level} XP to next level
        </p>
      </div>

      <div style={styles.actions}>
        <Link to="/recipes" style={styles.actionCard}>
          <span style={styles.actionIcon}>📖</span>
          <span>My Recipes</span>
        </Link>
        <Link to="/cook-log" style={styles.actionCard}>
          <span style={styles.actionIcon}>🍳</span>
          <span>Cook Log</span>
        </Link>
      </div>

      <div style={styles.rankLadder}>
        <h3>Chef Rank Ladder</h3>
        <ul style={styles.rankList}>
          {[
            { rank: "🥄 Line Cook", levels: "Levels 1–2" },
            { rank: "🍳 Home Chef", levels: "Levels 3–5" },
            { rank: "👨‍🍳 Sous Chef", levels: "Levels 6–9" },
            { rank: "⭐ Head Chef", levels: "Levels 10–14" },
            { rank: "👑 Executive Chef", levels: "Level 15+" },
          ].map((r) => (
            <li
              key={r.rank}
              style={{
                ...styles.rankItem,
                background: user.rank === r.rank ? "#b7e4c7" : "#f9f9f9",
                fontWeight: user.rank === r.rank ? "bold" : "normal",
              }}
            >
              <span>{r.rank}</span>
              <span style={styles.rankLevels}>{r.levels}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "600px", margin: "2rem auto", padding: "0 1rem" },
  card: { background: "#2d6a4f", color: "white", borderRadius: "12px", padding: "2rem", textAlign: "center", marginBottom: "1.5rem" },
  rank: { fontSize: "1.5rem", margin: "0 0 0.3rem" },
  username: { margin: "0 0 0.3rem" },
  level: { margin: "0 0 1rem", opacity: 0.85 },
  xpBarContainer: { background: "rgba(255,255,255,0.3)", borderRadius: "999px", height: "16px", overflow: "hidden", marginBottom: "0.5rem" },
  xpBar: { background: "#95d5b2", height: "100%", borderRadius: "999px", transition: "width 0.5s ease" },
  xpText: { fontSize: "0.9rem", opacity: 0.9, margin: 0 },
  actions: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" },
  actionCard: { display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", padding: "1.5rem", background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", textDecoration: "none", color: "#2d6a4f", fontWeight: "bold" },
  actionIcon: { fontSize: "2rem" },
  rankLadder: { background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  rankList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" },
  rankItem: { display: "flex", justifyContent: "space-between", padding: "0.6rem 1rem", borderRadius: "8px" },
  rankLevels: { color: "#666", fontWeight: "normal" },
};