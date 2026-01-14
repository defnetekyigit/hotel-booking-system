import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/api";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function BookingPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation() as any;
  const { user } = useAuth();

  const { room, startDate, endDate, guests } = state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔒 LOGIN KONTROL
  if (!user) {
    navigate("/login");
    return null;
  }

  const book = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("📤 Booking payload:", {
        roomId,
        startDate,
        endDate,
        guestCount: guests,
      });

      const res = await api.post("/api/v1/bookings", {
        roomId,
        startDate,
        endDate,
        guestCount: guests,
      });

      console.log("✅ Booking response:", res.data);

      navigate("/booking-success");
    } catch (err: any) {
      console.error("❌ Booking failed:", err);
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Booking failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Confirm Booking</h2>

        <p><b>Hotel:</b> {room.hotel.name}</p>
        <p><b>City:</b> {room.hotel.city}</p>
        <p><b>Room:</b> {room.type}</p>
        <p><b>Guests:</b> {guests}</p>
        <p><b>Dates:</b> {startDate} → {endDate}</p>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button onClick={book} disabled={loading} style={styles.btn}>
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}

const styles = {
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
    width: 380,
  },
  btn: {
    marginTop: 20,
    width: "100%",
    padding: 12,
    background: "#0f62fe",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};
