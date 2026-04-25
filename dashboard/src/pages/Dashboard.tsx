import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("admin_token");
    navigate("/");
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Admin Dashboard</h1>

      <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
        <Card title="Orders Management" onClick={() => navigate("/orders")} />
        <Card title="Products Management" onClick={() => navigate("/products")} />
      </div>

      <div style={{ marginTop: 30 }}>
        <button onClick={logout} style={btnRed}>
          Logout
        </button>
      </div>
    </div>
  );
}

function Card({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: 24,
        borderRadius: 16,
        background: "#fff",
        border: "1px solid #ddd",
        cursor: "pointer",
        minWidth: 240,
      }}
    >
      <h3>{title}</h3>
    </div>
  );
}

const btnRed = {
  padding: 12,
  borderRadius: 10,
  border: "none",
  background: "#ef4444",
  color: "white",
  fontWeight: 700,
};