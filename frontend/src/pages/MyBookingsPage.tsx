import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useAuth } from "../auth/AuthContext";

type Booking = {
  id: string;
  startDate: string;
  endDate: string;
  room: {
    type: string;
    hotel: {
      name: string;
      city: string;
    };
  };
};

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 🔴 user yoksa veya auth hâlâ yükleniyorsa → ÇIK
    if (authLoading || !user) return;

    const fetchBookings = async () => {
      try {
        const res = await api.get("/api/v1/bookings");
        setBookings(res.data.items ?? res.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ??
            err?.message ??
            "Failed to load bookings"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, authLoading]);

  if (authLoading) {
    return <p style={{ color: "white", padding: 32 }}>Loading...</p>;
  }

  if (!user) {
    return <p style={{ color: "white", padding: 32 }}>Please login</p>;
  }

  if (loading) {
    return <p style={{ color: "white", padding: 32 }}>Loading bookings...</p>;
  }

  if (error) {
    return <p style={{ color: "red", padding: 32 }}>{error}</p>;
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 32, color: "white" }}>
      <h1>My Bookings</h1>

      {bookings.length === 0 && <p>No bookings yet.</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))",
          gap: 20,
        }}
      >
        {bookings.map((b) => (
          <div
            key={b.id}
            style={{
              background: "#2a2a2a",
              padding: 16,
              borderRadius: 10,
            }}
          >
            <h3>{b.room.hotel.name}</h3>
            <p>{b.room.hotel.city}</p>
            <p>Room: {b.room.type}</p>
            <p>
              Dates: {b.startDate.slice(0, 10)} →{" "}
              {b.endDate.slice(0, 10)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}