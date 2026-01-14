import { useState } from "react";
import AdminHotels from "./AdminHotels";
import AdminRooms from "./AdminRooms";
import AdminAvailability from "./AdminAvailability";

type Tab = "HOTELS" | "ROOMS" | "AVAILABILITY";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("HOTELS");

  return (
    <div style={styles.page}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <h2 style={{ marginBottom: 24 }}>Admin</h2>

        <button
          style={tab === "HOTELS" ? styles.activeBtn : styles.btn}
          onClick={() => setTab("HOTELS")}
        >
          🏨 Hotels
        </button>

        <button
          style={tab === "ROOMS" ? styles.activeBtn : styles.btn}
          onClick={() => setTab("ROOMS")}
        >
          🛏 Rooms
        </button>

        <button
          style={tab === "AVAILABILITY" ? styles.activeBtn : styles.btn}
          onClick={() => setTab("AVAILABILITY")}
        >
          📅 Availability
        </button>
      </aside>

      {/* CONTENT */}
      <main style={styles.content}>
        {tab === "HOTELS" && <AdminHotels />}
        {tab === "ROOMS" && <AdminRooms />}
        {tab === "AVAILABILITY" && <AdminAvailability />}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    minHeight: "calc(100vh - 64px)",
    background: "#181818",
    color: "white",
  },
  sidebar: {
    width: 220,
    padding: 24,
    borderRight: "1px solid #333",
  },
  content: {
    flex: 1,
    padding: 32,
  },
  btn: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: 8,
    background: "#222",
    color: "white",
    border: "1px solid #333",
    borderRadius: 6,
    cursor: "pointer",
    textAlign: "left",
  },
  activeBtn: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: 8,
    background: "#0f62fe",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    textAlign: "left",
  },
};
