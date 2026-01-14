import { Link } from "react-router-dom";

export default function BookingSuccessPage() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>🎉 Booking Confirmed!</h2>
        <p>Your reservation was successful.</p>

        <Link to="/search">
          <button style={styles.btn}>Back to Search</button>
        </Link>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#181818",
  },
  card: {
    background: "#2a2a2a",
    color: "white",
    padding: 32,
    borderRadius: 10,
    textAlign: "center",
  },
  btn: {
    marginTop: 20,
    padding: "10px 16px",
    background: "#0f62fe",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};
