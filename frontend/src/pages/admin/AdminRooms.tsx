import { useEffect, useState } from "react";
import { api } from "../../api/api";

type Hotel = {
  id: string;
  name: string;
};

type Room = {
  id: string;
  type: string;
  capacity: number;
  basePrice: number;
};

export default function AdminRooms() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotelId, setHotelId] = useState("");

  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState<number>();
  const [basePrice, setBasePrice] = useState<number>();

  useEffect(() => {
    api.get("/api/v1/hotels").then(res => setHotels(res.data));
  }, []);

  useEffect(() => {
    if (!hotelId) return;
    api.get(`/api/v1/hotels/${hotelId}/rooms`).then(res => setRooms(res.data));
  }, [hotelId]);

  const createRoom = async () => {
    await api.post("/api/v1/admin/rooms", {
      hotelId,
      type,
      capacity,
      basePrice,
    });

    setType("");
    setCapacity(1);
    setBasePrice(0);

    const res = await api.get(`/api/v1/hotels/${hotelId}/rooms`);
    setRooms(res.data);
  };

  return (
    <div>
      <h1>Rooms</h1>

      <select value={hotelId} onChange={e => setHotelId(e.target.value)}>
        <option value="">Select hotel</option>
        {hotels.map(h => (
          <option key={h.id} value={h.id}>{h.name}</option>
        ))}
      </select>

      {hotelId && (
        <>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <input placeholder="Type" value={type} onChange={e => setType(e.target.value)} />
            <input  placeholder="Capacity" type="number" value={capacity} onChange={e => setCapacity(+e.target.value)} />
            <input placeholder="Base Price" type="number" value={basePrice} onChange={e => setBasePrice(+e.target.value)} />
            <button onClick={createRoom}>Add Room</button>
          </div>

          <ul style={{ marginTop: 24 }}>
            {rooms.map(r => (
              <li key={r.id}>
                {r.type} – {r.capacity} pax – {r.basePrice} ₺
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}