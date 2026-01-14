import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useAuth } from "../auth/AuthContext";
import dayjs from "dayjs";

type Booking = {
  id: string;
  roomId: string;
  startDate: string;
  endDate: string;
  guestCount: number;
  createdAt: string;
};

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchBookings = async () => {
      try {
        const res = await api.get("/api/v1/bookings");
        setBookings(res.data);
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

  /**
   * ✅ roomId bazlı gruplama
   */
  const groupedBookings = bookings.reduce<Record<string, Booking[]>>(
    (acc, booking) => {
      if (!acc[booking.roomId]) {
        acc[booking.roomId] = [];
      }
      acc[booking.roomId].push(booking);
      return acc;
    },
    {}
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 32, color: "white" }}>
      <h1 style={{ marginBottom: 24 }}>My Bookings</h1>

      {bookings.length === 0 && <p>No bookings yet.</p>}

      {Object.entries(groupedBookings).map(([roomId, roomBookings]) => (
        <div key={roomId} style={{ marginBottom: 40 }}>
          {/* ROOM HEADER */}
          <h2 style={{ marginBottom: 4 }}>🛏 Room</h2>
          <p style={{ fontSize: 12, opacity: 0.6, marginBottom: 16 }}>
            {roomId}
          </p>

          {/* BOOKINGS UNDER THIS ROOM */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))",
              gap: 16,
            }}
          >
            {roomBookings.map((b) => (
              <div
                key={b.id}
                style={{
                  background: "#2a2a2a",
                  padding: 16,
                  borderRadius: 10,
                }}
              >
                <p>
                  <strong>Dates:</strong>{" "}
                  {dayjs(b.startDate).format("YYYY-MM-DD")} →{" "}
                  {dayjs(b.endDate).format("YYYY-MM-DD")}
                </p>

                <p>
                  <strong>Guests:</strong> {b.guestCount}
                </p>

                <p style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
                  Created: {dayjs(b.createdAt).format("YYYY-MM-DD HH:mm")}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}