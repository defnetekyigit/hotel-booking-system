import { useEffect, useState } from "react";
import { api } from "../../api/api";

type Hotel = {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
};

export default function AdminHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");

  const fetchHotels = async () => {
    const res = await api.get("/api/v1/hotels"); // 👈 PUBLIC GET
    setHotels(res.data);
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const createHotel = async () => {
    await api.post("/api/v1/admin/hotels", {
      name,
      city,
      country,
      address,
    });

    setName("");
    setCity("");
    setCountry("");
    setAddress("");

    fetchHotels();
  };

  return (
    <div>
      <h1>Hotels</h1>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
        <input placeholder="Country" value={country} onChange={e => setCountry(e.target.value)} />
        <input placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
        <button onClick={createHotel}>Add Hotel</button>
      </div>

      <ul style={{ marginTop: 24 }}>
        {hotels.map(h => (
          <li key={h.id}>
            {h.name} – {h.city}
          </li>
        ))}
      </ul>
    </div>
  );
}

