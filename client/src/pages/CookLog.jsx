import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function CookLog() {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get("http://localhost:5555/api/cook-logs", { headers })
      .then((res) => setLogs(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this cook log entry?")) return;
    await axios.delete(`http://localhost:5555/api/cook-logs/${id}`, { headers });
    setLogs(logs.filter((log) => log.id !== id));
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h1>Cook Log 🍳</h1>
      <p style={styles.subtitle}>Every entry here earned you 25 XP!</p>

      {logs.length === 0 ? (
        <div style={styles.empty}>
          <p>No cooks logged yet!</p>
          <Link to="/recipes" style={styles.link}>Go cook something 👨‍🍳</Link>
        </div>
      ) : (
        <div style={styles.list}>
          {logs.map((log) => (
            <div key={log.id} style={styles.card}>
              <div style={styles.cardLeft}>
                <Link to={`/recipes/${log.recipe_id}`} style={styles.recipeLink}>
                  {log.recipe_title}
                </Link>
                {log.notes && <p style={styles.notes}>{log.notes}</p>}
              </div>
              <div style={styles.cardRight}>
                <span style={styles.date}>{log.cooked_on}</span>
                <span style={styles.xp}>+25 XP</span>
                <button onClick={() => handleDelete(log.id)} style={styles.deleteButton}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={styles.total}>
        Total cooks: {logs.length} &nbsp;|&nbsp; Total XP earned: {logs.length * 25}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "700px", margin: "2rem auto", padding: "0 1rem" },
  subtitle: { color: "#666", marginTop: "-0.5rem", marginBottom: "1.5rem" },
  empty: { textAlign: "center", padding: "3rem", color: "#666" },
  link: { color: "#2d6a4f", fontWeight: "bold" },
  list: { display: "flex", flexDirection: "column", gap: "0.8rem" },
  card: { background: "white", borderRadius: "12px", padding: "1rem 1.2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardLeft: { display: "flex", flexDirection: "column", gap: "0.3rem" },
  recipeLink: { color: "#2d6a4f", fontWeight: "bold", textDecoration: "none", fontSize: "1.05rem" },
  notes: { margin: 0, color: "#666", fontSize: "0.9rem" },
  cardRight: { display: "flex", alignItems: "center", gap: "1rem" },
  date: { color: "#888", fontSize: "0.9rem" },
  xp: { background: "#b7e4c7", color: "#1b4332", padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.85rem", fontWeight: "bold" },
  deleteButton: { background: "none", border: "none", color: "#ff6b6b", cursor: "pointer", fontSize: "1rem", fontWeight: "bold" },
  total: { marginTop: "1.5rem", textAlign: "right", color: "#666", fontSize: "0.9rem" },
};