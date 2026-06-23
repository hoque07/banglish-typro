import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { api } from "../lib/api";

export default function HistoryPanel({ user, refreshKey }) {
  const [items, setItems] = useState([]);

  async function load() {
    if (!user) {
      setItems([]);
      return;
    }

    try {
      const data = await api.history();
      setItems(data.history);
    } catch {
      setItems([]);
    }
  }

  async function remove(id) {
    await api.deleteHistory(id);
    load();
  }

  useEffect(() => {
    load();
  }, [user, refreshKey]);

  return (
    <div className="glass-card history-card">
      <p className="eyebrow">Saved work</p>
      <h2>Conversion history</h2>

      {!user && <p className="muted">Login to save and view conversion history.</p>}

      {user && items.length === 0 && <p className="muted">No saved history yet.</p>}

      <div className="history-list">
        {items.map((item) => (
          <div key={item.id} className="history-item">
            <div>
              <small>{new Date(item.created_at).toLocaleString()}</small>
              <p>{item.output_text}</p>
              <span>{item.input_text}</span>
            </div>
            <button onClick={() => remove(item.id)}><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
