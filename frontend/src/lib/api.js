const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export function getToken() {
  return localStorage.getItem("bt_token");
}

export function setToken(token) {
  localStorage.setItem("bt_token", token);
}

export function clearToken() {
  localStorage.removeItem("bt_token");
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || "Request failed");
  }

  return data;
}

export const api = {
  convert: (text) => request("/convert", { method: "POST", body: JSON.stringify({ text }) }),
  suggest: (text) => request("/suggest", { method: "POST", body: JSON.stringify({ text }) }),
  guide: (text) => request("/guide", { method: "POST", body: JSON.stringify({ text }) }),
  sentences: (text) => request("/sentence", { method: "POST", body: JSON.stringify({ text }) }),
  alphabet: () => request("/guides/alphabet"),
  punctuation: () => request("/guides/punctuation"),
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request("/auth/me"),
  saveHistory: (payload) => request("/history", { method: "POST", body: JSON.stringify(payload) }),
  history: () => request("/history"),
  deleteHistory: (id) => request(`/history/${id}`, { method: "DELETE" })
};
