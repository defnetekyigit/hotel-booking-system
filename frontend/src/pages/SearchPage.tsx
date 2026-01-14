import { useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import PageContainer from "../components/PageContainer";

type Room = {
  id: string;
  type: string;
  capacity: number;
  basePrice: number;
  hotel: {
    name: string;
    city: string;
  };
  availability?: { date: string; price: number }[];
};

export default function SearchPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);

  const [items, setItems] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/api/v1/search", {
        params: { city, startDate, endDate, guests },
      });

      setItems(res.data.items ?? []);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const goToBooking = (room: Room) => {
    if (!user) {
      navigate("/login");
      return;
    }

    navigate(`/booking/${room.id}`, {
      state: { room, startDate, endDate, guests },
    });
  };

  return (
    <PageContainer>
      <h1 style={{ fontSize: 48, marginBottom: 24 }}>Hotel Search</h1>

      {/* FORM */}
      <div style={styles.form}>
        <input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <input
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(+e.target.value)}
        />
        <button onClick={search}>{loading ? "Searching..." : "Search"}</button>
      </div>

      {user && <div style={styles.badge}>Discount applied ✅</div>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* RESULTS */}
      <div style={styles.grid}>
        {items.map((room) => (
          <div key={room.id} style={styles.card}>
            <h3>{room.hotel.name}</h3>
            <p>{room.hotel.city}</p>
            <p>Room: {room.type}</p>
            <p>Capacity: {room.capacity}</p>
            <p>Base price: {room.basePrice} ₺</p>
            {room.availability && (
              <ul style={{ marginTop: 8, fontSize: 14 }}>
                {room.availability.map((a) => (
                  <li key={a.date}>
                    {a.date.slice(0, 10)} → {a.price} ₺
                  </li>
                ))}
              </ul>
            )}
            <button style={styles.bookBtn} onClick={() => goToBooking(room)}>
              Book Now
            </button>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 24,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 20,
  },
  card: {
    background: "#2a2a2a",
    padding: 20,
    borderRadius: 12,
  },
  bookBtn: {
    marginTop: 12,
    padding: "10px 14px",
    background: "#0f62fe",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  badge: {
    display: "inline-block",
    marginBottom: 16,
    padding: "6px 12px",
    borderRadius: 999,
    background: "rgba(0,255,0,0.15)",
    border: "1px solid rgba(0,255,0,0.4)",
    color: "#7CFC98",
  },
};
