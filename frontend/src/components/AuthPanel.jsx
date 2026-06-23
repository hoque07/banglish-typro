import { useState } from "react";
import { Lock, UserPlus } from "lucide-react";
import { api } from "../lib/api";

export default function AuthPanel({ user, onAuth, onLogout }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "Tanbir Nebir", email: "demo@banglish.com", password: "123456" });
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = mode === "login"
        ? await api.login({ email: form.email, password: form.password })
        : await api.register(form);

      onAuth(data);
    } catch (err) {
      setError(err.message);
    }
  }

  if (user) {
    return (
      <div id="account" className="glass-card account-card">
        <p className="eyebrow">Account</p>
        <h2>Welcome, {user.name}</h2>
        <p className="muted">Your conversions can now be saved into the local SQLite backend history.</p>
        <button className="ghost-btn" onClick={onLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div id="account" className="glass-card account-card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Account system</p>
          <h2>{mode === "login" ? "Login" : "Create account"}</h2>
        </div>
        {mode === "login" ? <Lock className="icon-blue" /> : <UserPlus className="icon-blue" />}
      </div>

      <form onSubmit={submit} className="auth-form">
        {mode === "register" && (
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full name"
          />
        )}

        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          type="email"
        />

        <input
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
          type="password"
        />

        <button className="primary-btn" type="submit">
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>

      <button className="text-btn" onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "Need an account? Register" : "Already have an account? Login"}
      </button>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
