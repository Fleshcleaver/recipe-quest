import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Recipes() {
  const { token } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", ingredients: "", instructions: "", cook_time: ""
  });
  const [error, setError] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get("http://localhost:5555/api/recipes", { headers })
      .then((res) => setRecipes(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5555/api/recipes", {
        ...form,
        cook_time: form.cook_time ? parseInt(form.cook_time) : null
      }, { headers });
      setRecipes([...recipes, res.data]);
      setForm({ title: "", description: "", ingredients: "", instructions: "", cook_time: "" });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create recipe");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>My Recipes 📖</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.button}>
          {showForm ? "Cancel" : "+ Add Recipe"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3>New Recipe</h3>
          {error && <p style={styles.error}>{error}</p>}
          <input name="title" placeholder="Recipe Title" value={form.title} onChange={handleChange} style={styles.input} required />
          <input name="description" placeholder="Short Description" value={form.description} onChange={handleChange} style={styles.input} />
          <input name="cook_time" type="number" placeholder="Cook Time (minutes)" value={form.cook_time} onChange={handleChange} style={styles.input} />
          <textarea name="ingredients" placeholder="Ingredients (one per line)" value={form.ingredients} onChange={handleChange} style={styles.textarea} required />
          <textarea name="instructions" placeholder="Instructions" value={form.instructions} onChange={handleChange} style={styles.textarea} required />
          <button type="submit" style={styles.button}>Save Recipe</button>
        </form>
      )}

      {recipes.length === 0 ? (
        <div style={styles.empty}>
          <p>No recipes yet! Add your first one to get started. 🍽️</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {recipes.map((recipe) => (
            <Link to={`/recipes/${recipe.id}`} key={recipe.id} style={styles.card}>
              <h3 style={styles.cardTitle}>{recipe.title}</h3>
              {recipe.description && <p style={styles.cardDesc}>{recipe.description}</p>}
              <div style={styles.cardFooter}>
                {recipe.cook_time && <span>⏱ {recipe.cook_time} min</span>}
                <span>🍳 Cooked {recipe.times_cooked}x</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" },
  button: { background: "#2d6a4f", color: "white", border: "none", padding: "0.6rem 1.2rem", borderRadius: "6px", cursor: "pointer", fontSize: "1rem" },
  form: { background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "0.8rem" },
  input: { padding: "0.6rem", fontSize: "1rem", borderRadius: "4px", border: "1px solid #ccc" },
  textarea: { padding: "0.6rem", fontSize: "1rem", borderRadius: "4px", border: "1px solid #ccc", minHeight: "100px", resize: "vertical" },
  error: { color: "red", margin: 0 },
  empty: { textAlign: "center", padding: "3rem", color: "#666" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" },
  card: { background: "white", borderRadius: "12px", padding: "1.2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", gap: "0.5rem" },
  cardTitle: { margin: 0, color: "#2d6a4f" },
  cardDesc: { margin: 0, color: "#666", fontSize: "0.9rem" },
  cardFooter: { display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#888", marginTop: "auto", paddingTop: "0.5rem" },
};