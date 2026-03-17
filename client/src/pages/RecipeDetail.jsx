import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function RecipeDetail() {
  const { id } = useParams();
  const { token, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [showLogForm, setShowLogForm] = useState(false);
  const [logForm, setLogForm] = useState({ cooked_on: "", notes: "" });
  const [xpMessage, setXpMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`http://localhost:5555/api/recipes/${id}`, { headers })
      .then((res) => {
        setRecipe(res.data);
        setEditForm(res.data);
      })
      .catch(() => navigate("/recipes"));
  }, [id]);

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5555/api/cook-logs", {
        recipe_id: recipe.id,
        cooked_on: logForm.cooked_on || new Date().toISOString().split("T")[0],
        notes: logForm.notes,
      }, { headers });
      setXpMessage(`+25 XP! You're now level ${res.data.user.level} — ${res.data.user.rank} 🎉`);
      setShowLogForm(false);
      setLogForm({ cooked_on: "", notes: "" });
      refreshUser();
      setRecipe((prev) => ({ ...prev, times_cooked: prev.times_cooked + 1 }));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to log cook");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(`http://localhost:5555/api/recipes/${id}`, {
        ...editForm,
        cook_time: editForm.cook_time ? parseInt(editForm.cook_time) : null,
      }, { headers });
      setRecipe(res.data);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update recipe");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this recipe?")) return;
    await axios.delete(`http://localhost:5555/api/recipes/${id}`, { headers });
    navigate("/recipes");
  };

  if (!recipe) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;

  return (
    <div style={styles.container}>
      {xpMessage && <div style={styles.xpBanner}>{xpMessage}</div>}

      {editing ? (
        <form onSubmit={handleEditSubmit} style={styles.form}>
          <h2>Edit Recipe</h2>
          {error && <p style={styles.error}>{error}</p>}
          <input name="title" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} style={styles.input} required />
          <input name="description" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} style={styles.input} />
          <input name="cook_time" type="number" value={editForm.cook_time || ""} onChange={(e) => setEditForm({ ...editForm, cook_time: e.target.value })} style={styles.input} />
          <textarea name="ingredients" value={editForm.ingredients} onChange={(e) => setEditForm({ ...editForm, ingredients: e.target.value })} style={styles.textarea} required />
          <textarea name="instructions" value={editForm.instructions} onChange={(e) => setEditForm({ ...editForm, instructions: e.target.value })} style={styles.textarea} required />
          <div style={styles.buttonRow}>
            <button type="submit" style={styles.button}>Save Changes</button>
            <button type="button" onClick={() => setEditing(false)} style={styles.secondaryButton}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>{recipe.title}</h1>
              {recipe.description && <p style={styles.description}>{recipe.description}</p>}
              <div style={styles.meta}>
                {recipe.cook_time && <span>⏱ {recipe.cook_time} min</span>}
                <span>🍳 Cooked {recipe.times_cooked}x</span>
              </div>
            </div>
            <div style={styles.buttonRow}>
              <button onClick={() => setEditing(true)} style={styles.secondaryButton}>Edit</button>
              <button onClick={handleDelete} style={styles.deleteButton}>Delete</button>
            </div>
          </div>

          <div style={styles.section}>
            <h3>Ingredients</h3>
            <pre style={styles.pre}>{recipe.ingredients}</pre>
          </div>

          <div style={styles.section}>
            <h3>Instructions</h3>
            <pre style={styles.pre}>{recipe.instructions}</pre>
          </div>

          <div style={styles.logSection}>
            <button onClick={() => setShowLogForm(!showLogForm)} style={styles.button}>
              {showLogForm ? "Cancel" : "🍳 Log a Cook (+25 XP)"}
            </button>

            {showLogForm && (
              <form onSubmit={handleLogSubmit} style={styles.logForm}>
                <input type="date" value={logForm.cooked_on} onChange={(e) => setLogForm({ ...logForm, cooked_on: e.target.value })} style={styles.input} />
                <input placeholder="Notes (optional)" value={logForm.notes} onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })} style={styles.input} />
                <button type="submit" style={styles.button}>Submit</button>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "700px", margin: "2rem auto", padding: "0 1rem" },
  xpBanner: { background: "#b7e4c7", color: "#1b4332", padding: "1rem", borderRadius: "8px", marginBottom: "1rem", textAlign: "center", fontWeight: "bold" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" },
  title: { margin: "0 0 0.3rem" },
  description: { color: "#666", margin: "0 0 0.5rem" },
  meta: { display: "flex", gap: "1rem", color: "#888", fontSize: "0.9rem" },
  section: { background: "white", borderRadius: "12px", padding: "1.2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "1rem" },
  pre: { whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 },
  logSection: { marginTop: "1.5rem" },
  logForm: { marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.8rem" },
  form: { background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: "0.8rem" },
  input: { padding: "0.6rem", fontSize: "1rem", borderRadius: "4px", border: "1px solid #ccc" },
  textarea: { padding: "0.6rem", fontSize: "1rem", borderRadius: "4px", border: "1px solid #ccc", minHeight: "100px", resize: "vertical" },
  buttonRow: { display: "flex", gap: "0.8rem" },
  button: { background: "#2d6a4f", color: "white", border: "none", padding: "0.6rem 1.2rem", borderRadius: "6px", cursor: "pointer", fontSize: "1rem" },
  secondaryButton: { background: "#ccc", color: "#333", border: "none", padding: "0.6rem 1.2rem", borderRadius: "6px", cursor: "pointer", fontSize: "1rem" },
  deleteButton: { background: "#ff6b6b", color: "white", border: "none", padding: "0.6rem 1.2rem", borderRadius: "6px", cursor: "pointer", fontSize: "1rem" },
  error: { color: "red", margin: 0 },
};