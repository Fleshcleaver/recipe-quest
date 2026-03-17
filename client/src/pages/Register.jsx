import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5555/api/register", form);
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create Your Account 🍳</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <p style={styles.error}>{error}</p>}
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} style={styles.input} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} style={styles.input} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} style={styles.input} required />
        <button type="submit" style={styles.button}>Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

const styles = {
  container: { maxWidth: "400px", margin: "5rem auto", padding: "2rem", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", borderRadius: "8px" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  input: { padding: "0.6rem", fontSize: "1rem", borderRadius: "4px", border: "1px solid #ccc" },
  button: { padding: "0.7rem", background: "#2d6a4f", color: "white", border: "none", borderRadius: "4px", fontSize: "1rem", cursor: "pointer" },
  error: { color: "red", margin: 0 },
};