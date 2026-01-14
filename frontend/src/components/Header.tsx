import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const { user, role, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/search");
  };

  return (
    <header style={styles.header}>
      <Link to="/search" style={styles.logo}>
        Hotel Booking
      </Link>

      <div style={styles.right}>
        {loading ? null : user ? (
          <>
            {role === "USER" && (
              <Link to="/my-bookings">
                <button style={styles.button}>My Bookings</button>
              </Link>
            )}

            {role === "ADMIN" && (
              <Link to="/admin">
                <button style={styles.button}>Admin Panel</button>
              </Link>
            )}

            <span style={styles.email}>{user.email}</span>

            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <button style={styles.button}>Login</button>
          </Link>
        )}
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    height: 64,
    padding: "0 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#111",
    borderBottom: "1px solid #333",
  },
  logo: {
    color: "#fff",
    fontSize: 20,
    fontWeight: 700,
    textDecoration: "none",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  email: {
    color: "#aaa",
    fontSize: 14,
  },
  button: {
    padding: "6px 14px",
    borderRadius: 6,
    border: "1px solid #444",
    background: "#222",
    color: "#fff",
    cursor: "pointer",
  },
};