import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.brand}>🍳 Recipe Quest</Link>
      {user ? (
        <div style={styles.links}>
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/recipes" style={styles.link}>Recipes</Link>
          <Link to="/cook-log" style={styles.link}>Cook Log</Link>
          <span style={styles.user}>👨‍🍳 {user.username}</span>
          <button onClick={handleLogout} style={styles.button}>Logout</button>
        </div>
      ) : (
        <div style={styles.links}>
          <Link to="/login" style={styles.link}>Login</Link>
          <Link to="/register" style={styles.link}>Register</Link>
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", background: "#2d6a4f", color: "white" },
  brand: { color: "white", textDecoration: "none", fontWeight: "bold", fontSize: "1.3rem" },
  links: { display: "flex", alignItems: "center", gap: "1.2rem" },
  link: { color: "white", textDecoration: "none" },
  user: { color: "#b7e4c7" },
  button: { background: "#ff6b6b", color: "white", border: "none", padding: "0.4rem 0.8rem", borderRadius: "4px", cursor: "pointer" },
};