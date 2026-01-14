import { useEffect, useState } from "react";
import { login } from "../auth/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { role, loading } = useAuth();
  const navigate = useNavigate();

  // ✅ HOOK BURADA – COMPONENT LEVEL
  useEffect(() => {
    if(loading) return;
    if (role === "ADMIN") navigate("/admin");
    if (role === "USER") navigate("/search");
  }, [role, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      // ❌ burada hook YOK
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={{ marginBottom: 16 }}>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" disabled={submitting} style={styles.button}>
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "calc(100vh - 64px)", // header yüksekliği
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#181818",
  },
  card: {
    background: "#fff",
    padding: 32,
    width: 340,
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  input: {
    padding: 10,
    fontSize: 14,
  },
  button: {
    padding: 10,
    fontSize: 16,
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: 13,
  },
};
