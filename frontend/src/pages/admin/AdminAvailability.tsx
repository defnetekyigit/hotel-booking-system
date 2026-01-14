import { useEffect, useState } from "react";
import { api } from "../../api/api";

type Hotel = {
  id: string;
  name: string;
};

type Room = {
  id: string;
  type: string;
};

type Availability = {
  date: string;
  price: number;
};

export default function AdminAvailability() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);

  const [hotelId, setHotelId] = useState("");
  const [roomId, setRoomId] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [price, setPrice] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // HOTELS
  useEffect(() => {
    api.get("/api/v1/hotels").then(res => setHotels(res.data));
  }, []);

  // ROOMS
  useEffect(() => {
    if (!hotelId) return;
    api.get(`/api/v1/hotels/${hotelId}/rooms`).then(res => setRooms(res.data));
  }, [hotelId]);

  // AVAILABILITY
  useEffect(() => {
    if (!roomId) return;
    api
      .get(`/api/v1/rooms/${roomId}/availability`)
      .then(res => setAvailability(res.data));
  }, [roomId]);

  const createAvailability = async () => {
    if (!roomId || !startDate || !endDate || !price) {
      setMessage("Fill all fields");
      return;
    }

    try {
      setLoading(true);
      await api.post(`/api/v1/admin/rooms/${roomId}/availability`, {
        startDate,
        endDate,
        price,
      });

      const res = await api.get(`/api/v1/rooms/${roomId}/availability`);
      setAvailability(res.data);
      setMessage("✅ Availability added");
    } catch {
      setMessage("❌ Failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteAvailability = async (date: string) => {
    await api.delete(
      `/api/v1/admin/rooms/${roomId}/availability/${date}`
    );

    setAvailability(prev => prev.filter(a => a.date !== date));
  };

  return (
    <div style={{ padding: 32, color: "white", maxWidth: 700 }}>
      <h2>Room Availability</h2>

      {/* HOTEL */}
      <select value={hotelId} onChange={e => setHotelId(e.target.value)}>
        <option value="">Select hotel</option>
        {hotels.map(h => (
          <option key={h.id} value={h.id}>
            {h.name}
          </option>
        ))}
      </select>

      {/* ROOM */}
      {hotelId && (
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
          style={{ marginTop: 12 }}
        >
          <option value="">Select room</option>
          {rooms.map(r => (
            <option key={r.id} value={r.id}>
              {r.type}
            </option>
          ))}
        </select>
      )}

      {/* ADD */}
      {roomId && (
        <>
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>

          <input
            type="number"
            placeholder="Daily price"
            value={price}
            onChange={e => setPrice(+e.target.value)}
            style={{ marginTop: 12 }}
          />

          <button onClick={createAvailability} disabled={loading} style={btn}>
            Add Availability
          </button>
        </>
      )}

      {/* LIST */}
      {availability.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3>Existing Availability</h3>

          {availability.map(a => (
            <div
              key={a.date}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 8,
                background: "#2a2a2a",
                marginBottom: 6,
                borderRadius: 6,
              }}
            >
              <span>{a.date.slice(0, 10)} – {a.price} ₺</span>
              <button onClick={() => deleteAvailability(a.date)}>❌</button>
            </div>
          ))}
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

const btn = {
  marginTop: 16,
  padding: "10px 14px",
  background: "#0f62fe",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};