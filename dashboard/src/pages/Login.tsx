import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { email, password });

      if (res.data.user.role !== "admin") {
        setError("Admin only");
        return;
      }

      localStorage.setItem("admin_token", res.data.token);
      navigate("/dashboard");
    } catch {
      setError("Invalid credentials");
    }
  }

  return (
    <div style={wrap}>
      <form onSubmit={submit} style={card}>
        <h1>Mini Shop Admin</h1>

        <input
          style={input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <input
          style={input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button style={btn}>Login</button>
      </form>
    </div>
  );
}

const wrap = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "#f3f4f6",
};

const card = {
  background: "white",
  padding: 30,
  borderRadius: 16,
  width: 340,
  display: "grid",
  gap: 12,
};

const input = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ddd",
};

const btn = {
  padding: 12,
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "white",
  fontWeight: 700,
};